import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileCode, Folder, Plus } from 'lucide-react';
import axios from 'axios';

export default function Sidebar() {
  const navigate = useNavigate();
  const { workspaceId, requestId } = useParams();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (workspaceId) {
      fetchRequests();
    }
  }, [workspaceId]);

  const fetchRequests = async () => {
    try {
      // TODO: Create this endpoint in backend
      const res = await axios.get(`http://localhost:5000/api/workspaces/${workspaceId}/requests`);
      setRequests(res.data);
    } catch (error) {
      console.error('Failed to fetch requests', error);
    }
  };

  const handleCreateRequest = async () => {
    try {
        const res = await axios.post(`http://localhost:5000/api/workspaces/${workspaceId}/requests`);
        setRequests([...requests, res.data]);
        navigate(`/workspace/${workspaceId}/request/${res.data._id}`);
    } catch (error) {
        console.error('Failed to create request', error);
    }
  };

  const handleSelect = (id) => {
    navigate(`/workspace/${workspaceId}/request/${id}`);
  };

  const methodColor = (m) => {
    if (m === 'GET') return 'text-emerald-400';
    if (m === 'POST') return 'text-amber-400';
    if (m === 'PUT') return 'text-blue-400';
    if (m === 'DELETE') return 'text-rose-400';
    return 'text-blue-500';
  };

  return (
    <div className="w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col h-full">
      <div className="p-4 font-bold text-gray-200 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <Folder size={18} className="text-violet-400" /> 
           <span className="truncate max-w-[120px]">Workspace</span>
        </div>
        <button 
            onClick={handleCreateRequest}
            className="text-gray-400 hover:text-white transition-colors"
        >
            <Plus size={16} />
        </button>
      </div>
      
      <div className="flex-1 overflow-auto p-2">
        {requests.map((req) => (
          <div 
            key={req._id}
            onClick={() => handleSelect(req._id)}
            className={`
              flex items-center gap-2 p-2 rounded-lg cursor-pointer text-sm mb-1 transition-all
              ${requestId === req._id ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}
            `}
          >
            <span className={`text-[10px] font-bold w-10 ${methodColor(req.method)}`}>{req.method}</span>
            <span className="truncate">{req.url || 'Untitled Request'}</span>
          </div>
        ))}
        {requests.length === 0 && (
             <div className="text-center py-8 text-gray-600 text-xs">
                 No requests yet
             </div>
        )}
      </div>
    </div>
  );
}