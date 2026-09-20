import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AlertBanner from '../common/AlertBanner';
import EmergencyInfoStrip from '../alerts/EmergencyInfoStrip';

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#0b1120] text-slate-200 selection:bg-blue-500/30">
      <Navbar />
      
      {/* Global alert ticker sits right under the navigation */}
      <AlertBanner />
      
      {/* Main Content Area grows to push the footer down */}
      <main className="flex-1 flex flex-col w-full relative">
        <Outlet />
      </main>

      {/* Emergency contacts strictly visible at the bottom of public pages */}
      <EmergencyInfoStrip />
      
      <Footer />
    </div>
  );
};

export default PublicLayout;