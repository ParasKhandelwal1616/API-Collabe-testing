import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, ArrowRight, Hash, Copy, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [joinWorkspaceId, setJoinWorkspaceId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const createWorkspace = async () => {
    if (!newWorkspaceName) return;
    try {
      const res = await axios.post('http://localhost:5000/api/workspaces', { name: newWorkspaceName });
      setShowModal(false);
      setNewWorkspaceName('');
      navigate(`/workspace/${res.data.workspace._id}/request/${res.data.defaultRequestId}`);
    } catch (error) {
      console.error('Failed to create workspace', error);
      setError('Failed to create workspace');
    }
  };

  const handleJoin = async () => {
    if (!joinWorkspaceId) return;
    try {
      // Validate ID format (simple check)
      if (joinWorkspaceId.length !== 24) {
          setError('Invalid Workspace ID format');
          return;
      }

      // Check if workspace exists (optional, or just navigate and let the layout handle 404)
      // For speed, we'll try to fetch requests. If it fails, ID is likely wrong.
      const res = await axios.get(`http://localhost:5000/api/workspaces/${joinWorkspaceId}/requests`);
      
      if (res.data && res.data.length > 0) {
        navigate(`/workspace/${joinWorkspaceId}/request/${res.data[0]._id}`);
      } else {
        // Valid workspace but no requests? Navigate to new request page or handle gracefully
        // For now, we assume a workspace always has at least one request (created on init)
        // If not, we can force create one or just go to a default route
         navigate(`/workspace/${joinWorkspaceId}/request/new`); 
      }
    } catch (error) {
       console.error(error);
       setError('Workspace not found or invalid ID');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            API Forge
          </h1>
          <p className="text-gray-400">Collaborative API Development</p>
          {user && <p className="text-sm text-gray-500">Welcome, {user.username}</p>}
        </div>

        {/* Error Message */}
        {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center">
                {error}
            </div>
        )}

        <div className="bg-[#1e1e1e] p-8 rounded-2xl border border-white/5 shadow-2xl space-y-6">
          
          {/* Join Existing */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-400 uppercase tracking-wider">Join Workspace</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                    type="text" 
                    placeholder="Enter Workspace ID"
                    value={joinWorkspaceId}
                    onChange={(e) => {
                        setJoinWorkspaceId(e.target.value);
                        setError('');
                    }}
                    className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors font-mono text-sm"
                />
              </div>
              <button 
                onClick={handleJoin}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 rounded-lg transition-colors"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#1e1e1e] text-gray-500">Or</span>
            </div>
          </div>

          {/* Create New */}
          <button 
            onClick={() => setShowModal(true)}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-500/20"
          >
            <Plus size={20} /> Create New Workspace
          </button>
        </div>
        
        {user && (
            <button 
                onClick={handleLogout}
                className="mt-6 flex items-center gap-2 text-gray-500 hover:text-red-400 mx-auto"
            >
                <LogOut size={18} /> Logout
            </button>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e1e1e] p-6 rounded-xl border border-white/10 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Create Workspace</h2>
            <input
              type="text"
              placeholder="Workspace Name (e.g., Team Alpha)"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-3 mb-6 text-white focus:outline-none focus:border-violet-500"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={createWorkspace}
                className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}