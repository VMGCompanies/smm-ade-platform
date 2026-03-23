import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import HitlPanel from '../common/HitlPanel';

const AppShell: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-bg-primary overflow-hidden">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
          <footer className="text-center py-4 text-xs text-text-muted border-t border-border-base mt-6 font-sans">
            Powered by Neuralogic Group
          </footer>
        </main>
        {/* HITL sidebar */}
        <HitlPanel />
      </div>
    </div>
  );
};

export default AppShell;
