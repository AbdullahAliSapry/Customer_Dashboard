import React, { useState, ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import UnifiedSidebar from './UnifiedSidebar';
import Header from './Header';

interface DashboardLayoutProps {
  isRegistrationCompleted: boolean;
  children?: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ isRegistrationCompleted, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : isRTL ? 'translate-x-64' : '-translate-x-64'} fixed inset-y-0 z-50 lg:relative lg:translate-x-0 transition duration-300 ease-in-out lg:flex`}>
        <UnifiedSidebar isRegistrationCompleted={isRegistrationCompleted} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
          {children ? children : <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;