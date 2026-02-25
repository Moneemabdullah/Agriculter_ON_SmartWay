import React, { useEffect, useState } from "react";
import { Home, Users, Cpu, Settings, LogOut, Search } from "lucide-react";
import api from "@/api/axios";

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
  const [sensorCount, setSensorCount] = useState<number | null>(null);
  const [onlineCount, setOnlineCount] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [quick, setQuick] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await api.get('/sensors/all');
        const list = res.data?.data || [];
        if (!mounted) return;
        setSensorCount(list.length);
        setOnlineCount(list.filter((s: any) => s.status !== 'offline').length);
        setQuick(list.slice(0, 8).map((s: any) => s.sensorId));
      } catch (e) {
        console.warn('Failed to load sensors for sidebar', e);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const filteredQuick = quick.filter(s => s.toLowerCase().includes(query.toLowerCase()));

  const openSensor = (sensorId: string) => {
    try {
      // store for Monitoring to pick up
      localStorage.setItem('adminSelectedSensor', sensorId);
      onChange('monitoring');
    } catch (e) { console.error(e); }
  }

  return (
    <aside className="bg-slate-900 text-slate-100 h-screen w-72 flex flex-col">
      <div className="flex items-center justify-between h-20 border-b border-slate-800 px-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center font-black text-white">SA</div>
          <div className="font-black text-lg">SmartAgri</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-400">{sensorCount !== null ? `${sensorCount} sensors` : '…'}</div>
          <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
            <img src="/test-avatar.png" alt="avatar" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>

      <div className="p-3">
        <div className="flex items-center gap-2 bg-slate-800 rounded-md px-2 py-1">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sensors"
            className="bg-transparent text-sm w-full focus:outline-none text-slate-300"
          />
        </div>

        <div className="mt-3 space-y-2">
          {filteredQuick.map((s) => (
            <button key={s} onClick={() => openSensor(s)} className="text-sm text-slate-300 block w-full text-left py-1 px-2 rounded hover:bg-slate-800">
              {s}
            </button>
          ))}
        </div>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {links.map((link) => (
          <button
            key={link.key}
            onClick={() => onChange(link.key)}
            className={`flex items-center justify-between gap-3 p-3 rounded-lg text-sm font-medium w-full text-left transition-colors ${
              active === link.key ? "bg-emerald-700/20 text-emerald-300" : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="text-slate-300">{link.icon}</div>
              <span>{link.name}</span>
            </div>
            {link.key === 'monitoring' && (
              <div className="text-xs text-slate-400">{onlineCount !== null ? `${onlineCount}` : '—'}</div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-2 p-2 text-slate-300 hover:bg-slate-800 rounded-lg w-full">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
