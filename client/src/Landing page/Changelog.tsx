import React from 'react';
import {
  Layers,
  Cpu,
  Globe,
  Database,
  ShieldCheck,
  LineChart,
  TestTube2,
  Presentation,
  ArrowLeft,
  Settings,
  Code2,
  CheckCircle2,
  Trophy,
  ChevronRight,
} from 'lucide-react';

interface TimelinePhase {
  week: string;
  segment: string;
  tasks: string[];
  status: 'completed' | 'in-progress' | 'upcoming';
}

const timelineData: TimelinePhase[] = [
  { week: 'Week 1', segment: 'Planning & Setup', tasks: ['Finalize ideas and assign team roles', 'Set up GitHub & project tools'], status: 'completed' },
  { week: 'Week 2', segment: 'System Design', tasks: ['Create architecture diagrams', 'Plan databases', 'List sensors & components'], status: 'completed' },
  { week: 'Week 3', segment: 'Hardware Setup', tasks: ['Connect ESP32 with soil & DHT sensors', 'Test readings via Serial Monitor'], status: 'completed' },
  { week: 'Week 4', segment: 'Backend Setup', tasks: ['Build Node.js + Express API', 'Connect MongoDB', 'Test data routes'], status: 'completed' },
  { week: 'Week 5', segment: 'Frontend Setup', tasks: ['Start React app', 'Add Firebase authentication', 'Basic dashboard UI'], status: 'completed' },
  { week: 'Week 6', segment: 'IoT Integration', tasks: ['Send ESP32 data to backend', 'Store in MongoDB', 'Verify live updates'], status: 'completed' },
  { week: 'Week 7', segment: 'Feature Integration', tasks: ['Add Cloudinary (image upload)', 'SSLCommerz (payment integration)'], status: 'completed' },
  { week: 'Week 8', segment: 'Role Based Dashboard', tasks: ['Enable real-time data display', 'Add charts for sensor readings'], status: 'completed' },
  { week: 'Week 9', segment: 'Testing & Debugging', tasks: ['Fix bugs and improve UI', 'Test full system from ESP32 to web'], status: 'in-progress' },
  { week: 'Week 10', segment: 'Finalization & Presentation', tasks: ['Prepare reports & slides', 'Create demo video', 'Finalize deployment'], status: 'upcoming' },
];

export default function Changelog() {
  const completedCount = timelineData.filter(p => p.status === 'completed').length;
  const progressPercentage = Math.round((completedCount / timelineData.length) * 100);

  const inProgressIndex = timelineData.findIndex(p => p.status === 'in-progress');
  let weekNumber: number;
  if (inProgressIndex !== -1) weekNumber = inProgressIndex + 1;
  else if (completedCount === timelineData.length) weekNumber = timelineData.length;
  else weekNumber = Math.min(completedCount + 1, timelineData.length);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 border-b border-slate-100 pb-12">
          <div className="max-w-2xl">
            <button 
              onClick={() => window.history.back()} 
              className="flex items-center gap-2 text-[#1a4332] font-semibold mb-4 hover:gap-3 transition-all"
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>
            <h1 className="text-5xl font-bold text-[#1a4332] mb-4">
              Project <span className="text-[#84cc16]">Roadmap</span>
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              Tracking the 10-week journey of the SmartAgri IoT Ecosystem. 
              Currently in final optimization and stress-testing.
            </p>
          </div>

          <div className="w-full md:w-80">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[#1a4332] font-bold text-3xl">{progressPercentage}%</span>
              <span className="text-slate-400 text-sm font-medium pb-1">Week {weekNumber} of {timelineData.length}</span>
            </div>
            <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-1 border border-slate-200">
              <div 
                className="bg-[#84cc16] h-full rounded-full transition-all duration-1000 ease-out shadow-sm" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {timelineData.map((phase, index) => (
            <div 
              key={index}
              className={`relative p-8 rounded-2xl transition-all border-2 ${
                phase.status === 'completed' 
                  ? 'bg-slate-50/50 border-slate-100' 
                  : phase.status === 'in-progress'
                  ? 'bg-white border-[#84cc16] shadow-xl scale-105 z-10'
                  : 'bg-white border-dashed border-slate-200 opacity-60'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-xl ${
                  phase.status === 'completed' ? 'bg-[#1a4332] text-white' : 'bg-[#84cc16] text-[#1a4332]'
                }`}>
                  {getPhaseIcon(phase.week)}
                </div>
                {phase.status === 'completed' ? (
                  <div className="bg-[#84cc16] p-1 rounded-full">
                    <CheckCircle2 className="text-[#1a4332]" size={20} />
                  </div>
                ) : phase.status === 'in-progress' ? (
                  <span className="flex items-center gap-1 bg-[#84cc16]/20 text-[#1a4332] px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                    CURRENT
                  </span>
                ) : null}
              </div>

              <div>
                <span className="text-slate-400 font-bold text-xs tracking-widest">{phase.week.toUpperCase()}</span>
                <h3 className={`text-xl font-bold mt-1 mb-4 ${
                   phase.status === 'in-progress' ? 'text-[#1a4332]' : 'text-slate-700'
                }`}>
                  {phase.segment}
                </h3>
                
                <ul className="space-y-3">
                  {phase.tasks.map((task, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <ChevronRight size={14} className={`mt-1 shrink-0 ${
                        phase.status === 'completed' ? 'text-[#84cc16]' : 'text-slate-300'
                      }`} />
                      <span className={phase.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-600'}>
                        {task}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          {/* Final Goal Card */}
          <div className="bg-[#1a4332] rounded-2xl p-8 flex flex-col items-center justify-center text-center text-white space-y-4">
             <Trophy size={48} className="text-[#84cc16]" />
             <h3 className="text-2xl font-bold">Project Launch</h3>
             <p className="text-sm opacity-80 leading-relaxed">
               All systems operational. FarmHub ready for commercial deployment.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const getPhaseIcon = (week: string) => {
  const icons: Record<string, React.ReactNode> = {
    'Week 1': <Settings size={22} />,
    'Week 2': <Layers size={22} />,
    'Week 3': <Cpu size={22} />,
    'Week 4': <Database size={22} />,
    'Week 5': <Code2 size={22} />,
    'Week 6': <Globe size={22} />,
    'Week 7': <ShieldCheck size={22} />,
    'Week 8': <LineChart size={22} />,
    'Week 9': <TestTube2 size={22} />,
    'Week 10': <Presentation size={22} />,
  };
  return icons[week] || <Layers size={22} />;
};