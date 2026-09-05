import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Sprout, LogIn, KeyRound, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);

      const role = res.data.user.role;
      if (role === 'FARMER') navigate('/farmer/dashboard');
      else if (role === 'CONSUMER') navigate('/consumer/dashboard');
      else if (role === 'BULK_BUYER') navigate('/buyer/dashboard');
      else if (role === 'ADMIN') navigate('/admin/dashboard');
      else navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#f4f7f5]">
        <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100">
          
          <div className="text-center">
            <div className="w-14 h-14 bg-agri-dark text-agri-accent rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
              <Sprout className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome to FARMCONNECT
            </h2>
            <p className="mt-1 text-xs text-gray-500 font-medium">
              Log in to your role-based agricultural dashboard
            </p>
          </div>

          {/* Quick Demo Login Preset Buttons */}
          <div className="bg-agri-pale/40 p-4 rounded-2xl border border-agri-light/30 space-y-2">
            <span className="text-[11px] font-extrabold text-agri-dark uppercase tracking-wider block mb-1">
              ⚡ Instant SIH Demo One-Click Fill:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleQuickDemo('ramesh.farmer@farmconnect.in')}
                className="p-2 rounded-xl bg-white hover:bg-agri-dark hover:text-white border border-gray-200 text-left transition-colors text-[11px] truncate shadow-2xs"
              >
                🌾 Demo Farmer
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('priya.consumer@gmail.com')}
                className="p-2 rounded-xl bg-white hover:bg-agri-dark hover:text-white border border-gray-200 text-left transition-colors text-[11px] truncate shadow-2xs"
              >
                🛒 Demo Consumer
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('procure@bigbasketco.com')}
                className="p-2 rounded-xl bg-white hover:bg-agri-dark hover:text-white border border-gray-200 text-left transition-colors text-[11px] truncate shadow-2xs"
              >
                🏢 Bulk Buyer
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin@farmconnect.in')}
                className="p-2 rounded-xl bg-white hover:bg-agri-dark hover:text-white border border-gray-200 text-left transition-colors text-[11px] truncate shadow-2xs"
              >
                🛡️ Demo Admin
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
              ⚠️ {error}
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@farmconnect.in"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-agri-primary text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-agri-primary text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-agri-dark text-white font-bold text-sm hover:bg-agri-primary transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Logging in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-agri-primary hover:underline">
                Create Account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};
