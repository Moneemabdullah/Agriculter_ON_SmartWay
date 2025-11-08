import {
  LayoutDashboard,
  Droplets,
  Sprout,
  BarChart3,
  Settings,
  CreditCard,
  Bell,
  Users,
  X,
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from './ui/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'irrigation', label: 'Irrigation', icon: Droplets },
  { id: 'crops', label: 'Crop Management', icon: Sprout },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function DashboardSidebar({ activeTab, onTabChange, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 bg-gray-900 shadow-2xl transition-transform duration-300 ease-in-out md:sticky md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "rounded-tr-xl" 
        )}
      >
        {/* Header/Logo Section */}
        <div className="flex h-16 items-center justify-between border-b border-gray-700 px-6">
          <h2 className="text-xl font-bold tracking-wider text-green-400 ml-3">
            SmartAgri
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:bg-gray-700 md:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Navigation Links */}
        <nav className="space-y-2 p-4">
          {navigation.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isDisabled = index > 7; // Only first two are active

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (!isDisabled) {
                    onTabChange(item.id);
                    onClose();
                  }
                }}
                disabled={isDisabled}
                className={cn(
                  "group flex w-full items-center gap-4 rounded-lg px-4 py-2.5 font-medium transition-all duration-200",
                  isDisabled
                    ? "cursor-not-allowed text-white opacity-60"
                    : isActive
                      ? "bg-green-600 text-white shadow-lg shadow-green-600/30 ring-2 ring-green-500/50 transform hover:scale-[1.01]"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white hover:translate-x-1"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isDisabled
                      ? "text-gray-600"
                      : isActive
                        ? "text-white"
                        : "text-green-500 group-hover:text-green-400"
                  )}
                />
                <span className="text-sm tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
