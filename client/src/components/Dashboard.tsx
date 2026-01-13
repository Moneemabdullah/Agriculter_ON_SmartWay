import React, { useState, useEffect } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardOverview } from './DashboardOverview';
import { IrrigationControl } from './IrrigationControl';
import { CropManagement } from './CropManagement';
import SensorAnalytics from './SensorAnalytics';
import { AlertsPanel } from './AlertsPanel';
import { TeamManagement } from './TeamManagement';
import { PaymentsPanel } from './PaymentsPanel';
import { SettingsPanel } from './SettingsPanel';
import FirmManagement from './FirmManagement';
import BlogSection from './BlogSection';

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    try {
      return localStorage.getItem('dashboardActiveTab') || 'dashboard';
    } catch (e) {
      return 'dashboard';
    }
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Persist selected tab so refresh keeps the same page
  useEffect(() => {
    try {
      localStorage.setItem('dashboardActiveTab', activeTab);
    } catch (e) {
      // ignore storage errors
    }
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'irrigation':
        return <IrrigationControl />;
      case 'crops':
        return <CropManagement />;
      case 'firm':
        return <FirmManagement />;
      case 'blogs':
        return <BlogSection />;
      case 'sensor-analytics':
        return <SensorAnalytics />;
      case 'alerts':
        return <AlertsPanel />;
      case 'team':
        return <TeamManagement />;
      case 'payments':
        return <PaymentsPanel />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
