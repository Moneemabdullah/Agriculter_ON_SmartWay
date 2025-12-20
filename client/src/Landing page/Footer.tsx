import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0f2e23] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#7ab42c] rounded-full flex items-center justify-center">
                <span className="text-white">🌱</span>
              </div>
              <span className="text-xl">FarmHub</span>
            </div>
            <p className="text-gray-400 mb-6">
              Cultivating excellence in organic farming for over 30 years. 
              From our fields to your table, we deliver nature's best.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-[#1a4d3c] rounded-full flex items-center justify-center hover:bg-[#7ab42c] transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-[#1a4d3c] rounded-full flex items-center justify-center hover:bg-[#7ab42c] transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-[#1a4d3c] rounded-full flex items-center justify-center hover:bg-[#7ab42c] transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-[#1a4d3c] rounded-full flex items-center justify-center hover:bg-[#7ab42c] transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-[#7ab42c] transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#7ab42c] transition-colors">Our Services</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#7ab42c] transition-colors">Products</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#7ab42c] transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#7ab42c] transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl mb-6">Our Services</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-[#7ab42c] transition-colors">Organic Farming</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#7ab42c] transition-colors">Fresh Produce</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#7ab42c] transition-colors">Farm Consulting</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#7ab42c] transition-colors">Wholesale Supply</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#7ab42c] transition-colors">Farm Tours</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin size={20} className="flex-shrink-0 mt-1 text-[#7ab42c]" />
                <span>123 Farm Road, Green Valley, CA 94567</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone size={20} className="flex-shrink-0 text-[#7ab42c]" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail size={20} className="flex-shrink-0 text-[#7ab42c]" />
                <span>info@farmhub.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#1a4d3c]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 FarmHub. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-[#7ab42c] transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-[#7ab42c] transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-[#7ab42c] transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
