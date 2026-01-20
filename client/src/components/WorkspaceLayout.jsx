import React from 'react';
import RequestPage from './RequestPage';
import Sidebar from './Sidebar';

export default function WorkspaceLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <RequestPage />
      </div>
    </div>
  );
}