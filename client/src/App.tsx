import { useState } from 'react';
import { DashboardHeader } from './components/DashboardHeader';
import { DashboardSidebar } from './components/DashboardSidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { IrrigationControl } from './components/IrrigationControl';
import { CropManagement } from './components/CropManagement';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { AlertsPanel } from './components/AlertsPanel';
import { TeamManagement } from './components/TeamManagement';
import { PaymentsPanel } from './components/PaymentsPanel';
import { SettingsPanel } from './components/SettingsPanel';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'irrigation':
        return (
          <div className="space-y-6">
            <h2>Irrigation Control</h2>
            <IrrigationControl />
          </div>
        );
      case 'crops':
        return <CropManagement />;
      case 'analytics':
        return (
          <div className="space-y-6">
            <h2>Analytics & Reports</h2>
            <AnalyticsCharts />
          </div>
        );
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
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
