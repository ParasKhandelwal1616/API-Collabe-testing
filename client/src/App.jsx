import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loadUser } from './features/auth/authSlice';
import setAuthToken from './utils/setAuthToken';

import WorkspaceLayout from './components/WorkspaceLayout';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';

// Check for token in localStorage on first load
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      
      {/* Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/workspace/:workspaceId/request/:requestId" element={<WorkspaceLayout />} />
        {/* Fallback for unknown request IDs in a workspace. Will fetch first available request. */}
        <Route path="/workspace/:workspaceId" element={<PrivateRouteFallback />} /> 
      </Route>
    </Routes>
  );
}

// Temporary component for fallback, will be replaced by actual logic.
function PrivateRouteFallback() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFirstRequest = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/workspaces/${workspaceId}/requests`);
        if (res.data && res.data.length > 0) {
          navigate(`/workspace/${workspaceId}/request/${res.data[0]._id}`, { replace: true });
        } else {
          // If no requests, maybe create a new one or show an empty state
          // For now, redirect to dashboard.
          navigate('/', { replace: true }); 
        }
      } catch (error) {
        console.error('Failed to fetch requests for fallback', error);
        navigate('/', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    if (workspaceId) {
      fetchFirstRequest();
    } else {
      setLoading(false);
      navigate('/', { replace: true }); // No workspaceId, go to dashboard
    }
  }, [workspaceId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        Loading workspace...
      </div>
    );
  }
  return null;
}

export default App;