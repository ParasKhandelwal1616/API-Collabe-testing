import React, { useState, useEffect } from 'react';
import RequestPanel from './RequestPanel';
import { useDispatch, useSelector } from 'react-redux';
import { setUrl, setMethod, setLoading, setResponse, fetchRequestById, setActiveRequestId } from '../features/request/requestSlice';
import axios from 'axios';
import { Play, Zap, Copy, Check, Clock, X } from 'lucide-react';
import { useParams } from 'react-router-dom';

export default function RequestPage() {
  const dispatch = useDispatch();
  const { currentRequest, response, isLoading, saveStatus } = useSelector((state) => state.request);
  const [copied, setCopied] = useState(false);
  const { workspaceId, requestId } = useParams();

  useEffect(() => {
    if (requestId) {
        dispatch(setActiveRequestId(requestId));
        dispatch(fetchRequestById(requestId));
    }
  }, [requestId, dispatch]);

  const handleSend = async () => {
    dispatch(setLoading(true));
    const startTime = Date.now();
    
    try {
      let parsedBody = currentRequest.bodyContent;
      try {
        parsedBody = JSON.parse(currentRequest.bodyContent);
      } catch (e) {
        // Keep as string if not valid JSON
      }

      // Prepare Query Params
      const params = {};
      if (currentRequest.queryParams) {
        currentRequest.queryParams.forEach(p => {
          if (p.key && p.isChecked) params[p.key] = p.value;
        });
      }

      const res = await axios.post('http://localhost:5000/api/proxy', {
        url: currentRequest.url,
        method: currentRequest.method,
        headers: currentRequest.headers || {},
        params: params,
        body: parsedBody
      });
      
      const duration = Date.now() - startTime;
      dispatch(setResponse({ ...res.data, _duration: duration, _statusCode: res.data.status }));
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(error);
      dispatch(setResponse({ 
        error: error.message || "Failed to fetch",
        _duration: duration,
        _statusCode: error.response?.status
      }));
    }
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMethodColor = (method) => {
    switch(method) {
      case 'GET': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'POST': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'PUT': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'DELETE': return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'text-gray-400';
    if (status >= 200 && status < 300) return 'text-emerald-400';
    if (status >= 400 && status < 500) return 'text-amber-400';
    if (status >= 500) return 'text-rose-400';
    return 'text-gray-400';
  };
  
  console.log('Current Response State:', response);

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a] text-gray-100 overflow-hidden">
      {/* Animated grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:64px_64px] opacity-30 pointer-events-none"></div>
      
      {/* Gradient orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[128px] pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 backdrop-blur-xl bg-black/40">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                  API Forge
                </h1>
                <p className="text-xs text-gray-500 font-mono">Lightning-fast API testing</p>
              </div>
            </div>
            
            {response?._duration && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs font-mono text-cyan-400">{response._duration}ms</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-xs ml-auto border-l border-white/10 pl-4 h-full">
              {saveStatus === 'saving' ? (
                <span className="text-amber-400 animate-pulse flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    Saving...
                </span>
              ) : (
                <span className="text-gray-500 flex items-center gap-1">
                    <Check size={12} />
                    Saved
                </span>
              )}
            </div>
          </div>

          {/* Request Bar */}
          <div className="flex gap-3 items-stretch">
            <select 
              value={currentRequest.method}
              onChange={(e) => dispatch(setMethod(e.target.value))}
              className={`px-4 py-2.5 rounded-lg border font-bold text-sm uppercase tracking-wider transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${getMethodColor(currentRequest.method)}`}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>

            <div className="flex-1 relative group">
              <input 
                type="text" 
                placeholder="https://api.example.com/v1/endpoint"
                value={currentRequest.url}
                onChange={(e) => dispatch(setUrl(e.target.value))}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-500/20 to-cyan-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none blur"></div>
            </div>

            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="px-8 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/25"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Sending
                </>
              ) : (
                <>
                  <Play size={16} fill="white" />
                  Send
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Request */}
          <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0 border-r border-white/5">
             <RequestPanel />
          </div>

          {/* Right Panel - Response */}
          <div className="flex-1 flex flex-col bg-[#141414] min-w-0 h-full overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Response</h3>
                {(response?._statusCode || response?.status) && (
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${getStatusColor(response._statusCode || response.status)}`}>
                    {response._statusCode || response.status}
                  </span>
                )}
              </div>
              
              {response && !response.error && (
                <button
                  onClick={handleCopyResponse}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-gray-300 transition-all"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>

            <div className="flex-1 p-4 overflow-auto">
              {response ? (
                response.error ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                        <X className="w-8 h-8 text-rose-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-rose-400 mb-2">Request Failed</h3>
                      <p className="text-sm text-gray-500 font-mono">{response.error}</p>
                    </div>
                  </div>
                ) : (
                  <pre className="text-emerald-400 font-mono text-sm leading-relaxed whitespace-pre-wrap break-all">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                )
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-cyan-500/20 rounded-2xl blur-xl"></div>
                      <div className="relative w-full h-full bg-gradient-to-br from-violet-500/10 to-cyan-500/10 rounded-2xl border border-white/10 flex items-center justify-center">
                        <Zap className="w-10 h-10 text-gray-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-400 mb-2">Ready to Send</h3>
                    <p className="text-sm text-gray-600">Hit the Send button to see your response</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}