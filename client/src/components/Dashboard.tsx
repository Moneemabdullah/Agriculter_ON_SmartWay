import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/axios';
import { DashboardHeader } from './DashboardHeader';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardOverview } from './DashboardOverview';
import { IrrigationControl } from './IrrigationControl';
import { CropManagement } from './CropManagement';
import { AnalyticsCharts } from './AnalyticsCharts';
import { AlertsPanel } from './AlertsPanel';
import { TeamManagement } from './TeamManagement';
import { PaymentsPanel } from './PaymentsPanel';
import { SettingsPanel } from './SettingsPanel';

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
            {/* <h2>Irrigation Control</h2> */}
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
            {/* small greeting for current user */}
            <div className="mb-4">
              <Greeting />
            </div>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

function Greeting() {
  const [name, setName] = useState<string | null>(null);
  const { userId } = useParams<{ userId?: string }>();

  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      try {
        if (userId) {
          // try a few sensible endpoints to fetch another user's profile
          const endpoints = [`/users/${userId}`, `/auth/users/${userId}`, `/users?id=${userId}`];
          for (const ep of endpoints) {
            try {
              const res = await api.get(ep);
              if (res?.data) {
                const data = res.data.data || res.data;
                if ((res.data?.success || data) && mounted) {
                  setName(data?.name || data?.email || `User ${userId}`);
                  return;
                }
              }
            } catch (_) {
              // try next
            }
          }
          // fallback if no endpoint worked
          if (mounted) setName(`User ${userId}`);
        } else {
          const res = await api.get('/auth/me');
          if (res.data?.success && mounted) {
            setName(res.data.data?.name || res.data.data?.email || 'User');
          }
        }
      } catch (err) {
        if (userId && mounted) setName(`User ${userId}`);
      }
    };

    fetchProfile();

    const onAuthChanged = () => fetchProfile();
    window.addEventListener('auth-changed', onAuthChanged);
    return () => {
      mounted = false;
      window.removeEventListener('auth-changed', onAuthChanged);
    };
  }, [userId]);

  if (!name) return null;

  return <h2 className="text-xl font-semibold">{userId ? `Viewing: ${name}` : `Welcome, ${name} 👋`}</h2>;
}