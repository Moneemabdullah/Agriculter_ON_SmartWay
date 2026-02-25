import React from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Code2, 
  Database, 
  Layout, 
  Cpu,
  ArrowLeft
} from 'lucide-react';

const teamMembers = [
  {
    name: "Abdullah all Moneem",
    role: "Backend Developer",
    focus: "Node.js, Express, & ESP32 Integration",
    icon: <Database className="text-[#84cc16]" size={24} />,
    bio: "Specializes in building robust server-side architectures and ensuring seamless data flow between IoT hardware and the cloud."
  },
  {
    name: "Md. Rifat Hossain",
    role: "Frontend Developer",
    focus: "React.js & Dashboard Analytics",
    icon: <Code2 className="text-[#84cc16]" size={24} />,
    bio: "Passionate about creating responsive, high-performance web interfaces and visualizing real-time sensor data for farmers."
  },
  {
    name: "Rayhan Islam Prome",
    role: "UX & Database Architect",
    focus: "UI Design & MongoDB Schema",
    icon: <Layout className="text-[#84cc16]" size={24} />,
    bio: "Focuses on user-centric design principles and optimizing database queries for high-speed IoT data retrieval."
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
      {/* Hero Section */}
      <div className="bg-[#1a4332] text-white py-24 px-6 relative overflow-hidden">
        {/* Subtle Decorative Circle */}
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-[#84cc16] opacity-10 rounded-full" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <button 
            onClick={() => window.history.back()} 
            className="flex items-center gap-2 text-[#84cc16] font-semibold mb-8 hover:opacity-80 transition-all"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
          <h1 className="text-6xl font-extrabold mb-6 leading-tight">
            Cultivating the <br />
            <span className="text-[#84cc16]">Future of Tech</span>
          </h1>
          <p className="text-emerald-100/80 text-xl max-w-2xl leading-relaxed">
            We are a team of dedicated developers and designers working to bridge the gap 
            between traditional farming and modern IoT technology.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="flex items-center gap-4 mb-16">
          <div className="h-1 w-20 bg-[#84cc16]" />
          <h2 className="text-3xl font-bold text-[#1a4332]">Meet the Team</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {teamMembers.map((member, index) => (
            <div key={index} className="group">
              <div className="relative mb-6 overflow-hidden rounded-2xl bg-slate-100 aspect-square flex items-center justify-center">
                {/* Placeholder for Member Image */}
                <div className="text-[#1a4332]/20 group-hover:scale-110 transition-transform duration-500">
                   <Cpu size={120} />
                </div>
                
                {/* Social Overlay */}
                <div className="absolute inset-0 bg-[#1a4332]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  <button className="p-3 bg-white/10 rounded-full text-white hover:bg-[#84cc16] hover:text-[#1a4332] transition-all">
                    <Github size={20} />
                  </button>
                  <button className="p-3 bg-white/10 rounded-full text-white hover:bg-[#84cc16] hover:text-[#1a4332] transition-all">
                    <Linkedin size={20} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-2">
                {member.icon}
                <span className="text-xs font-bold text-[#84cc16] uppercase tracking-widest">
                  {member.role}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#1a4332] mb-3">{member.name}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                {member.bio}
              </p>
              <p className="text-[#1a4332] font-semibold text-xs border-l-2 border-[#84cc16] pl-3 italic">
                Focus: {member.focus}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-slate-50 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#1a4332] mb-8">Our Vision</h2>
          <p className="text-lg text-slate-600 leading-relaxed italic">
            "To empower farmers with real-time, actionable data through affordable 
            smart technology, ensuring sustainable growth and food security for 
            the generations to come."
          </p>
          <div className="mt-10 flex justify-center gap-6">
             <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-[#1a4332]">10</span>
                <span className="text-xs font-bold text-slate-400 uppercase">Weeks Development</span>
             </div>
             <div className="w-px h-12 bg-slate-200" />
             <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-[#1a4332]">3</span>
                <span className="text-xs font-bold text-slate-400 uppercase">Tech Specialists</span>
             </div>
             <div className="w-px h-12 bg-slate-200" />
             <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-[#1a4332]">1</span>
                <span className="text-xs font-bold text-slate-400 uppercase">Mission</span>
             </div>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="py-12 text-center border-t border-slate-100">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-6 h-6 bg-[#84cc16] rounded-full" />
          <span className="font-bold text-[#1a4332]">SmartAgri</span>
        </div>
        <p className="text-slate-400 text-xs tracking-widest uppercase">
          © 2024 Smart Agri Solutions
        </p>
      </footer>
    </div>
  );
}