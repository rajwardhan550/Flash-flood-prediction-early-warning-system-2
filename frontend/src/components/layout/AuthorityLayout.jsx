import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AuthorityLayout = () => {
  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 overflow-hidden">
      {/* 
        The Sidebar configures itself for operational authority tasks.
      */}
      <Sidebar role="authority" />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <main className="flex-1 overflow-y-auto bg-[#0b1120]">
          {/* The nested authority page components (e.g., AuthorityOverview) render here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AuthorityLayout;