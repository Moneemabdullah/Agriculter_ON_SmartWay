import React, { useState, useEffect } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthModal } from './popup';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      setUserName(localStorage.getItem('userName') || 'User');
      setUserId(localStorage.getItem('userId') || '');
      setRole(localStorage.getItem('role') || 'User');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setProfileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-[#1a4d3c] text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between py-4">
        {/* Logo */}
        <Link to="/home" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#7ab42c] rounded-full flex items-center justify-center">
            <span className="text-white">🌱</span>
          </div>
          <span className="text-xl">FarmHub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link to="/home" className="hover:text-[#7ab42c] transition-colors">Home</Link>
          <Link to="/about" className="hover:text-[#7ab42c] transition-colors">About</Link>
          <Link to="/services" className="hover:text-[#7ab42c] transition-colors">Services</Link>
          <Link to="/home#products" className="hover:text-[#7ab42c] transition-colors">Products</Link>
          <Link to="/blog" className="hover:text-[#7ab42c] transition-colors">Blog</Link>
          <Link to="/contact" className="hover:text-[#7ab42c] transition-colors">Contact</Link>
          <Link to="/test" className="hover:text-[#7ab42c] transition-colors">Tests</Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Profile avatar */}
          {isLoggedIn && (
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="hover:text-[#7ab42c] transition-colors"
              >
                <User size={24} />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 text-gray-800">
                  {/* Name & Role */}
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="font-semibold">{userName || 'User'}</p>
                    <p className="text-sm text-gray-600">{role || 'User'}</p>
                  </div>

                  {/* Dashboard */}
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      navigate(`/dashboard/${userId}`);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <User size={16} /> Dashboard
                  </button>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center gap-2"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Get Started button */}
          {!isLoggedIn && (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="bg-[#7ab42c] text-white px-6 py-2 rounded-md hover:bg-[#6a9c28] transition-colors"
            >
              Get Started
            </button>
          )}

          {/* Mobile menu toggle */}
          <button className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-[#2a5d4c] flex flex-col gap-4">
            <Link to="/home" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#7ab42c] transition-colors">Home</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#7ab42c] transition-colors">About</Link>
            <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#7ab42c] transition-colors">Services</Link>
            <Link to="/home#products" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#7ab42c] transition-colors">Products</Link>
            <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#7ab42c] transition-colors">Blog</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#7ab42c] transition-colors">Contact</Link>
            <Link to="/test" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#7ab42c] transition-colors">Tests</Link>
          </nav>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </header>
  );
}
