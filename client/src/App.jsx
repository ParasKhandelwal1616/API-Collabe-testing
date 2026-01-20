import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WorkspaceLayout from './components/WorkspaceLayout';
import Dashboard from './components/Dashboard';
import RequestPage from './components/RequestPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      {/* The RequestPage will be rendered inside WorkspaceLayout */}
      <Route path="/workspace/:workspaceId/request/:requestId" element={<WorkspaceLayout />} />
    </Routes>
  );
}

export default App;