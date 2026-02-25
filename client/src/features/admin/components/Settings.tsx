import React, { useState } from "react";
import { 
  Settings as SettingsIcon, Shield, Bell, Globe, 
  Save, Database, Lock, UserCog, Mail, AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Settings: React.FC = () => {
  const [emailNotifs, setEmailNotifs] = useState(true);

  return (
    <div className="p-4 md:p-10 space-y-8 animate-in fade-in duration-500 max-w-5xl">
      
      {/* Header Section */}
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <SettingsIcon className="text-emerald-600" size={32} /> System Configuration
        </h1>
        <p className="text-slate-500 mt-1">Global parameters for sensors, security, and administrative access.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* Section 1: Administrative Security */}
        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="px-8 pt-8 border-b border-slate-50 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Shield size={20} />
              </div>
              <CardTitle className="text-xl font-bold text-slate-800">Security & Access</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Admin Session Timeout</label>
                <Input placeholder="30 Minutes" className="rounded-xl border-slate-100 bg-slate-50/50" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Two-Factor Authentication</label>
                <div className="flex items-center gap-4 h-10 px-1">
                   <BadgeToggle enabled={true} />
                   <span className="text-sm font-bold text-slate-600 tracking-tight">Enforced for all Admins</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Sensor & Data Preferences */}
        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="px-8 pt-8 border-b border-slate-50 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <Database size={20} />
              </div>
              <CardTitle className="text-xl font-bold text-slate-800">Telemetry & Data Logs</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="flex items-center justify-between group">
              <div className="space-y-1">
                <p className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">Auto-archive Offline Sensors</p>
                <p className="text-xs text-slate-400">Move sensors to archive after 30 days of inactivity.</p>
              </div>
              <BadgeToggle enabled={emailNotifs} onToggle={() => setEmailNotifs(!emailNotifs)} />
            </div>

            <div className="flex items-center justify-between group">
              <div className="space-y-1">
                <p className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">Global API Polling Rate</p>
                <p className="text-xs text-slate-400">Frequency of hardware status updates (Seconds).</p>
              </div>
              <Input type="number" defaultValue={15} className="w-24 rounded-xl text-center font-bold" />
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Danger Zone */}
        <Card className="border-2 border-rose-50 shadow-none bg-rose-50/20 rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-500 text-white rounded-2xl shadow-lg shadow-rose-200">
                <AlertTriangle size={24} />
              </div>
              <div>
                <p className="font-black text-rose-900 uppercase text-xs tracking-widest">Maintenance Mode</p>
                <p className="text-sm text-rose-700 font-medium">Temporarily disable user access for system upgrades.</p>
              </div>
            </div>
            <Button variant="destructive" className="rounded-2xl px-8 font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-rose-100">
              Activate Mode
            </Button>
          </CardContent>
        </Card>

        {/* Floating Save Button */}
        <div className="flex justify-end pt-4">
          <Button className="bg-slate-900 hover:bg-black text-white px-10 py-6 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-slate-200 transition-all active:scale-95">
            <Save className="mr-3 h-5 w-5" /> Save Global Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- Custom Modern Toggle Component ---
const BadgeToggle = ({ enabled, onToggle }: { enabled: boolean; onToggle?: () => void }) => (
  <button 
    onClick={onToggle}
    className={`w-12 h-6 rounded-full transition-all relative ${enabled ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-slate-200'}`}
  >
    <div className={`absolute top-1 h-4 w-4 bg-white rounded-full transition-all ${enabled ? 'left-7' : 'left-1'}`} />
  </button>
);

export default Settings;