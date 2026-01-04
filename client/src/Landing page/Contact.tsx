import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare, 
  Clock, 
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    alert('Thank you for reaching out to FarmHub Support!');
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
      {/* Header / Hero Section */}
      <div className="bg-[#1a4332] text-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={() => window.history.back()} 
            className="flex items-center gap-2 text-[#84cc16] font-semibold mb-6 hover:gap-3 transition-all"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
          <h1 className="text-5xl font-bold mb-4">
            Get in <span className="text-[#84cc16]">Touch</span>
          </h1>
          <p className="text-emerald-100/80 text-lg max-w-2xl leading-relaxed">
            Have questions about your IoT sensors, payment integration, or farming data? 
            Our technical team is here to help you grow.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-12 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Information Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
              <h3 className="text-[#1a4332] font-bold text-xl mb-6">Contact Details</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#84cc16]/10 text-[#1a4332] rounded-xl">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Us</p>
                    <p className="font-semibold text-[#1a4332]">info@smartagri.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#84cc16]/10 text-[#1a4332] rounded-xl">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Call Support</p>
                    <p className="font-semibold text-[#1a4332]">+880 1616413419</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#84cc16]/10 text-[#1a4332] rounded-xl">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Location</p>
                    <p className="font-semibold text-[#1a4332]">Cumilla, Bangladesh</p>
                  </div>
                </div>
              </div>

              <hr className="my-8 border-slate-100" />

              {/* IoT System Status indicator */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-[#1a4332]">System Status</span>
                  <span className="flex h-2 w-2 rounded-full bg-[#84cc16]"></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck size={14} className="text-[#84cc16]" />
                  All IoT Gateways Operational
                </div>
              </div>
            </div>

            <div className="bg-[#84cc16] p-8 rounded-2xl text-[#1a4332]">
              <Clock className="mb-4" size={32} />
              <h4 className="font-bold text-lg mb-1">Support Hours</h4>
              <p className="text-sm font-medium opacity-80">
                Sat - Thu: 9:00 AM - 6:00 PM<br />
                Friday: Emergency Support Only
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-10 rounded-2xl shadow-xl border border-slate-100 h-full">
              <div className="flex items-center gap-3 mb-8">
                <MessageSquare className="text-[#84cc16]" size={28} />
                <h2 className="text-3xl font-bold text-[#1a4332]">Send a Message</h2>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Your Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#84cc16] focus:ring-2 focus:ring-[#84cc16]/20 outline-none transition-all"
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#84cc16] focus:ring-2 focus:ring-[#84cc16]/20 outline-none transition-all"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Subject</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#84cc16] focus:ring-2 focus:ring-[#84cc16]/20 outline-none transition-all bg-white"
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  >
                    <option>General Inquiry</option>
                    <option>Technical Support (IoT Sensors)</option>
                    <option>Payment/Subscription Issue</option>
                    <option>Partnership Opportunity</option>
                  </select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Message</label>
                  <textarea 
                    rows={5}
                    required
                    placeholder="How can we help your farm today?"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#84cc16] focus:ring-2 focus:ring-[#84cc16]/20 outline-none transition-all resize-none"
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>

                <div className="md:col-span-2 pt-4">
                  <button 
                    type="submit"
                    className="w-full md:w-auto px-10 py-4 bg-[#1a4332] text-white font-bold rounded-xl hover:bg-[#2a5c45] shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 group"
                  >
                    Send Message
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}