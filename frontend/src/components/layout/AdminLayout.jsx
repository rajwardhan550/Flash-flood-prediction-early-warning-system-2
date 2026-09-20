import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AdminLayout = () => {
  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 overflow-hidden">
      {/* 
        The Sidebar component will dynamically render admin-specific links 
        based on the role prop passed to it.
      */}
      <Sidebar role="admin" />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <main className="flex-1 overflow-y-auto bg-[#0b1120]">
          {/* The nested admin page components (e.g., AdminOverview) render here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;