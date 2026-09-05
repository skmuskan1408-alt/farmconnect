import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/common/Navbar';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  TrendingUp,
  Truck,
  MessageSquare,
  Star,
  Users,
  DollarSign,
  PlusCircle,
  FileText,
  ShieldAlert,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title, subtitle, actionButton }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getNavItems = () => {
    if (!user) return [];

    switch (user.role) {
      case 'FARMER':
        return [
          { label: 'Dashboard', path: '/farmer/dashboard', icon: LayoutDashboard },
          { label: 'My Products', path: '/farmer/products', icon: Package },
          { label: 'Orders & Sales', path: '/farmer/orders', icon: ShoppingBag },
          { label: 'AI Demand Forecast', path: '/farmer/forecast', icon: TrendingUp },
          { label: 'Smart Logistics', path: '/farmer/deliveries', icon: Truck },
          { label: 'Messages', path: '/farmer/messages', icon: MessageSquare },
          { label: 'Reviews', path: '/farmer/reviews', icon: Star }
        ];

      case 'CONSUMER':
        return [
          { label: 'Dashboard', path: '/consumer/dashboard', icon: LayoutDashboard },
          { label: 'Browse Produce', path: '/marketplace', icon: Package },
          { label: 'My Orders', path: '/consumer/orders', icon: ShoppingBag },
          { label: 'Logistics Tracking', path: '/consumer/tracking', icon: Truck }
        ];

      case 'BULK_BUYER':
        return [
          { label: 'Dashboard', path: '/buyer/dashboard', icon: LayoutDashboard },
          { label: 'Bulk Requests', path: '/bulk-requests', icon: FileText },
          { label: 'My Bids & Offers', path: '/buyer/bids', icon: DollarSign }
        ];

      case 'ADMIN':
        return [
          { label: 'Admin Analytics', path: '/admin/dashboard', icon: LayoutDashboard },
          { label: 'Manage Users', path: '/admin/users', icon: Users },
          { label: 'All Orders', path: '/admin/orders', icon: ShoppingBag },
          { label: 'Product Audit', path: '/admin/products', icon: ShieldAlert }
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7f5]">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-28">
            
            {/* User Profile Card */}
            <div className="flex items-center space-x-3.5 pb-6 mb-6 border-b border-gray-100">
              <div className="w-12 h-12 rounded-2xl bg-agri-dark text-agri-accent font-extrabold text-lg flex items-center justify-center shadow-md">
                {user?.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <h3 className="font-bold text-gray-900 text-sm truncate">{user?.name}</h3>
                <span className="inline-block text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded bg-agri-pale text-agri-dark mt-0.5">
                  {user?.role.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Nav Menu */}
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-agri-dark text-white shadow-md'
                        : 'text-gray-600 hover:bg-agri-pale/60 hover:text-agri-dark'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-agri-accent' : 'text-gray-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4 text-agri-accent" />}
                  </Link>
                );
              })}
            </nav>

            {/* Quick Logout */}
            <div className="pt-6 mt-6 border-t border-gray-100">
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>Log Out</span>
              </button>
            </div>

          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 min-h-[75vh]">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-gray-100 gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">{title}</h1>
                {subtitle && <p className="text-sm text-gray-500 mt-1 font-medium">{subtitle}</p>}
              </div>
              {actionButton && <div>{actionButton}</div>}
            </div>

            {/* Content */}
            {children}

          </div>
        </main>

      </div>
    </div>
  );
};
