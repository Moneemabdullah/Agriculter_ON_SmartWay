import React, { useState } from 'react';
import api from '../utils/axios';
import { X, User, Mail, Lock, Phone, MapPin, Hash, Calendar } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'register' | 'changePassword';

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    address: '',
    nID: '',
    Phone: '',
    email: '',
    password: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setSuccess('');

  try {
    const identifier = formData.email || formData.Phone;

    const response = await api.post('/auth/signin', {
      identifier,
      password: formData.password,
    });

    const result = response.data?.data;

    if (!response.data?.success) {
      throw new Error(response.data?.message || 'Login failed');
    }

    localStorage.setItem('token', result.token);
    localStorage.setItem('userId', result.user?.id);

    window.dispatchEvent(new Event('auth-changed'));

    setSuccess('Login successful!');

    // 1.2 second pore modal close
    setTimeout(() => {
      onClose();
      resetForm();

      // 2. modal close howar sathe sathe page reload
      window.location.reload();
      // jodi ektu delay chai, tahole:
      // setTimeout(() => window.location.reload(), 300);
    }, 1200);
  } catch (err: any) {
    setError(err.message || 'Login failed. Please try again.');
  } finally {
    setLoading(false);
  }
};


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        age: formData.age,
        address: formData.address,
        nID: formData.nID,
        phone: formData.Phone,
        email: formData.email,
        password: formData.password,
      };

      const response = await api.post('/auth/signup', payload);

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Registration failed');
      }

      setSuccess('Registered successfully!');

      setTimeout(() => {
        onClose();
        resetForm();
      }, 1400);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/change-password', {
        email: formData.email,
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Password change failed');
      }

      setSuccess('Password changed successfully!');

      setTimeout(() => {
        setMode('login');
        resetForm();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Password change failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      address: '',
      nID: '',
      Phone: '',
      email: '',
      password: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setError('');
    setSuccess('');
  };

  const handleClose = () => {
    resetForm();
    setMode('login');
    onClose();
  };

  // common input classes with visible text + placeholder
  const inputClass =
    'w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg ' +
    'focus:outline-none focus:ring-2 focus:ring-[#7ab42c] focus:border-transparent ' +
    'text-gray-900 placeholder-gray-400';

  const textareaClass =
    'w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg ' +
    'focus:outline-none focus:ring-2 focus:ring-[#7ab42c] focus:border-transparent ' +
    'resize-none text-gray-900 placeholder-gray-400';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl text-[#1a4d3c]">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'register' && 'Create Account'}
            {mode === 'changePassword' && 'Change Password'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Mode Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setMode('login');
                resetForm();
              }}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                mode === 'login'
                  ? 'bg-[#7ab42c] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setMode('register');
                resetForm();
              }}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                mode === 'register'
                  ? 'bg-[#7ab42c] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Register
            </button>
            <button
              onClick={() => {
                setMode('changePassword');
                resetForm();
              }}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors text-sm ${
                mode === 'changePassword'
                  ? 'bg-[#7ab42c] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Change Password
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Email or Phone</label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    aria-label="Email or phone"
                    className={inputClass}
                    placeholder="Enter your email or phone"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    aria-label="Password"
                    className={inputClass}
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#7ab42c] text-white py-3 rounded-lg hover:bg-[#6a9c28] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          )}

          {/* Register Form */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    aria-label="Full name"
                    className={inputClass}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Age</label>
                  <div className="relative">
                    <Calendar
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      required
                      aria-label="Age"
                      className={inputClass}
                      placeholder="Age"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">National ID</label>
                  <div className="relative">
                    <Hash
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      name="nID"
                      value={formData.nID}
                      onChange={handleChange}
                      required
                      aria-label="National ID"
                      className={inputClass}
                      placeholder="National ID"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={2}
                    aria-label="Address"
                    className={textareaClass}
                    placeholder="Enter your address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="tel"
                    name="Phone"
                    value={formData.Phone}
                    onChange={handleChange}
                    required
                    aria-label="Phone number"
                    className={inputClass}
                    placeholder="Enter your phone number (e.g., +1234567890)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    aria-label="Email"
                    className={inputClass}
                    placeholder="Enter your email (name@example.com)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    aria-label="Password"
                    className={inputClass}
                    placeholder="Create a password (min 8 characters)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    aria-label="Confirm password"
                    className={inputClass}
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#7ab42c] text-white py-3 rounded-lg hover:bg-[#6a9c28] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}

          {/* Change Password Form */}
          {mode === 'changePassword' && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    aria-label="Email"
                    className={inputClass}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Old Password</label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="password"
                    name="oldPassword"
                    value={formData.oldPassword}
                    onChange={handleChange}
                    required
                    aria-label="Old password"
                    className={inputClass}
                    placeholder="Enter your old password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    aria-label="New password"
                    className={inputClass}
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Confirm New Password</label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    aria-label="Confirm new password"
                    className={inputClass}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#7ab42c] text-white py-3 rounded-lg hover:bg-[#6a9c28] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Changing Password...' : 'Change Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
