import React, { useState, useEffect } from "react";
import { DashboardHeader } from "../components/DashboardHeader";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { DashboardOverview } from "../components/DashboardOverview";
import { IrrigationControl } from "../components/IrrigationControl";
import { CropManagement } from "../components/CropManagement";
import SensorAnalytics from "../components/SensorAnalytics";
import { AlertsPanel } from "../components/AlertsPanel";
import { TeamManagement } from "../components/TeamManagement";
import { PaymentsPanel } from "../components/PaymentsPanel";
import { SettingsPanel } from "../components/SettingsPanel";
import FirmManagement from "../components/FirmManagement";
import BlogSection from "../components/BlogSection";

export default function Dashboard() {
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
