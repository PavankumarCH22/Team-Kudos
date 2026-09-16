import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import GiveKudosModal from '../components/kudos/GiveKudosModal';

const MainLayout = () => {
  const [giveKudosOpen, setGiveKudosOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar
        onOpenGiveKudos={() => setGiveKudosOpen(true)}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Navbar
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onOpenGiveKudos={() => setGiveKudosOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ openGiveKudos: () => setGiveKudosOpen(true) }} />
        </main>
      </div>

      {/* Global Give Kudos Modal */}
      <GiveKudosModal
        isOpen={giveKudosOpen}
        onClose={() => setGiveKudosOpen(false)}
        onSuccess={() => {
          // Trigger feed reload event
          window.dispatchEvent(new Event('kudos:created'));
        }}
      />
    </div>
  );
};

export default MainLayout;
