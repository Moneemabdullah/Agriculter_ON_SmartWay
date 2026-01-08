import React from "react";
import { Home, Users, Cpu, Settings, LogOut } from "lucide-react";

interface SidebarProps {
  active: string;
  onChange: (page: string) => void;
}

const links = [
  { name: "Overview", icon: <Home size={16} />, key: "overview" },
  { name: "Users", icon: <Users size={16} />, key: "users" },
  { name: "Monitoring", icon: <Cpu size={16} />, key: "monitoring" },
  { name: "Settings", icon: <Settings size={16} />, key: "settings" },
];

const AdminSidebar: React.FC<SidebarProps> = ({ active, onChange }) => {
  return (
    <aside className="bg-white border-r border-slate-200 h-screen w-64 flex flex-col">
      <div className="flex items-center justify-center h-20 border-b border-slate-100 font-black text-xl text-green-600">
        Admin Panel
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {links.map((link) => (
          <button
            key={link.key}
            onClick={() => onChange(link.key)}
            className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium w-full text-left transition-colors ${
              active === link.key ? "bg-green-50 text-green-600" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {link.icon}
            <span>{link.name}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-100">
        <button className="flex items-center gap-2 p-2 text-slate-600 hover:bg-slate-50 rounded-lg w-full">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
