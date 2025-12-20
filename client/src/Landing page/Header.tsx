import React, { useState, useEffect } from 'react';
import { Menu, X, Search, ShoppingCart, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthModal } from './popup';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      const userInfo = localStorage.getItem('userName');
      setUserName(userInfo || 'User');
    }

    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCartItems(JSON.parse(savedCart));

    const handleCartUpdate = () => {
      const updatedCart = localStorage.getItem('cart');
      if (updatedCart) setCartItems(JSON.parse(updatedCart));
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const cartItemCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserName('');
    setProfileMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Searching for: ${searchQuery}`);
    setSearchOpen(false);
    setSearchQuery('');
  };

  const removeFromCart = (index: number) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const getTotalPrice = () =>
    cartItems
      .reduce((total, item) => total + parseFloat(item.price.replace('$', '')) * (item.quantity || 1), 0)
      .toFixed(2);

  return (
    <>
      <header className="bg-[#1a4d3c] text-white sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#7ab42c] rounded-full flex items-center justify-center">
                <span className="text-white">🌱</span>
              </div>
              <span className="text-xl">FarmHub</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <a href="#home" className="hover:text-[#7ab42c] transition-colors">Home</a>
              <a href="#about" className="hover:text-[#7ab42c] transition-colors">About</a>
              <Link to="/services" className="hover:text-[#7ab42c] transition-colors">Services</Link>
              <a href="#products" className="hover:text-[#7ab42c] transition-colors">Products</a>
              <Link to="/blogs" className="hover:text-[#7ab42c] transition-colors">Blog</Link>
              <a href="#contact" className="hover:text-[#7ab42c] transition-colors">Contact</a>
            </nav>

            {/* Right side icons */}
            <div className="hidden lg:flex items-center gap-4">
              <button onClick={() => setSearchOpen(!searchOpen)} className="hover:text-[#7ab42c] transition-colors">
                <Search size={20} />
              </button>

              <button onClick={() => setCartOpen(!cartOpen)} className="hover:text-[#7ab42c] transition-colors relative">
                <ShoppingCart size={20} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#7ab42c] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>

              <div className="relative">
                <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="hover:text-[#7ab42c] transition-colors">
                  <User size={20} />
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 text-gray-800">
                    {isLoggedIn ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-200">
                          <p className="text-sm text-gray-600">Signed in as</p>
                          <p className="truncate">{userName}</p>
                        </div>
                        <a href="#profile" className="block px-4 py-2 hover:bg-gray-100 transition-colors">My Profile</a>
                        <a href="#orders" className="block px-4 py-2 hover:bg-gray-100 transition-colors">My Orders</a>
                        <a href="#settings" className="block px-4 py-2 hover:bg-gray-100 transition-colors">Settings</a>
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-red-600 flex items-center gap-2">
                          <LogOut size={16} /> Logout
                        </button>
                      </>
                    ) : (
                      <button onClick={() => { setProfileMenuOpen(false); setAuthModalOpen(true); }} className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors">
                        Login / Register
                      </button>
                    )}
                  </div>
                )}
              </div>

              {!isLoggedIn && (
                <button onClick={() => setAuthModalOpen(true)} className="bg-[#7ab42c] text-white px-6 py-2 rounded-md hover:bg-[#6a9c28] transition-colors">
                  Get Started
                </button>
              )}
            </div>

            <button className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <div className="py-4 border-t border-[#2a5d4c]">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, blogs..."
                  className="flex-1 px-4 py-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7ab42c]"
                  autoFocus
                />
                <button type="submit" className="bg-[#7ab42c] text-white px-6 py-2 rounded-md hover:bg-[#6a9c28] transition-colors">
                  Search
                </button>
              </form>
            </div>
          )}

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="lg:hidden py-4 border-t border-[#2a5d4c] flex flex-col gap-4">
              <a href="#home" className="hover:text-[#7ab42c] transition-colors">Home</a>
              <a href="#about" className="hover:text-[#7ab42c] transition-colors">About</a>
              <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#7ab42c] transition-colors">Services</Link>
              <a href="#products" className="hover:text-[#7ab42c] transition-colors">Products</a>
              <Link to="/blogs" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#7ab42c] transition-colors">Blog</Link>
              <a href="#contact" className="hover:text-[#7ab42c] transition-colors">Contact</a>
            </nav>
          )}
        </div>
      </header>

      {/* Cart Sidebar & AuthModal code remains same */}
      {cartOpen && <div>...cart code...</div>}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
