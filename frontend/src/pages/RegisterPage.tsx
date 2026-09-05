import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Sprout, User, Mail, Phone, MapPin, KeyRound, ArrowRight } from 'lucide-react';
import { Role } from '../types';

export const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRole = (searchParams.get('role') as Role) || 'CONSUMER';

  const [role, setRole] = useState<Role>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');

  // Role specific
  const [farmName, setFarmName] = useState('');
  const [farmingType, setFarmingType] = useState('Organic & Natural');
  const [organizationName, setOrganizationName] = useState('');
  const [businessType, setBusinessType] = useState('Retailer');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name,
        email,
        phone,
        password,
        location,
        role,
        farmName,
        farmingType,
        organizationName,
        businessType
      };

      const res = await api.post('/auth/register', payload);
      login(res.data.token, res.data.user);

      if (role === 'FARMER') navigate('/farmer/dashboard');
      else if (role === 'CONSUMER') navigate('/consumer/dashboard');
      else if (role === 'BULK_BUYER') navigate('/buyer/dashboard');
      else navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#f4f7f5]">
        <div className="max-w-xl w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100">
          
          <div className="text-center">
            <div className="w-14 h-14 bg-agri-dark text-agri-accent rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
              <Sprout className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Create Your Account
            </h2>
            <p className="mt-1 text-xs text-gray-500 font-medium">
              Join the direct Indian Agricultural Marketplace
            </p>
          </div>

          {/* Role Switcher */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Select Your Role</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { r: 'FARMER', label: '🌾 Farmer / FPO' },
                { r: 'CONSUMER', label: '🛒 Consumer' },
                { r: 'BULK_BUYER', label: '🏢 Bulk Buyer' }
              ].map((item) => (
                <button
                  key={item.r}
                  type="button"
                  onClick={() => setRole(item.r as Role)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                    role === item.r
                      ? 'bg-agri-dark text-agri-accent border-agri-dark shadow-md'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
              ⚠️ {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ramesh Kumar"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-agri-primary text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-agri-primary text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-agri-primary text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">City / Region</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Madanapalle, AP"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-agri-primary text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-agri-primary text-sm"
              />
            </div>

            {/* Dynamic Role-Based Extra Fields */}
            {role === 'FARMER' && (
              <div className="bg-agri-pale/40 p-4 rounded-2xl border border-agri-light/30 space-y-3">
                <span className="text-xs font-bold text-agri-dark block">🌾 Farmer Profile Details</span>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Farm Name</label>
                  <input
                    type="text"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    placeholder="Green Agro Farm"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm"
                  />
                </div>
              </div>
            )}

            {role === 'BULK_BUYER' && (
              <div className="bg-agri-pale/40 p-4 rounded-2xl border border-agri-light/30 space-y-3">
                <span className="text-xs font-bold text-agri-dark block">🏢 Business Details</span>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Organization Name</label>
                  <input
                    type="text"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder="Reliance Retail Fresh"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-agri-dark text-white font-bold text-sm hover:bg-agri-primary transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>
    </MainLayout>
  );
};
