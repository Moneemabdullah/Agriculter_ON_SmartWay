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

// Assuming Button and cn are implemented using a modern UI library like shadcn/ui

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
      {/* Mobile overlay - Stays the same for functionality */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar - Fancier styling applied here */}
      <aside
        className={cn(
          // Base: Dark background, tall, fixed/sticky, subtle shadow
          "fixed left-0 top-0 z-50 h-full w-64 bg-gray-900 shadow-2xl transition-transform duration-300 ease-in-out md:sticky md:translate-x-0",
          // Mobile state: -translate-x-full when closed, translate-x-0 when open
          isOpen ? "translate-x-0" : "-translate-x-full",
          // Added a slight rounded-tr-lg for a modern look
          "rounded-tr-xl" 
        )}
      >
        {/* Header/Logo Section */}
        <div className="flex h-16 items-center justify-between border-b border-gray-700 px-6">
          <h2 className="text-xl font-bold tracking-wider text-green-400 ml-3">
            SmartAgri
          </h2>
          {/* Close button for mobile */}
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
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onClose();
                }}
                className={cn(
                  // Base link styling: full width, flex, gap, padding, rounded, transition
                  "group flex w-full items-center gap-4 rounded-lg px-4 py-2.5 font-medium transition-all duration-200",
                  // Inactive state: lighter text, hover effect
                  !isActive && "text-gray-300 hover:bg-gray-700 hover:text-white",
                  // Active state: vibrant background, bold text, slight shadow, scale effect on hover
                  isActive
                    ? "bg-green-600 text-white shadow-lg shadow-green-600/30 ring-2 ring-green-500/50 transform hover:scale-[1.01]"
                    : "hover:translate-x-1" // Subtle animation on inactive hover
                )}
              >
                {/* Icon styling - different colors based on active state */}
                <Icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-white" : "text-green-500 group-hover:text-green-400"
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