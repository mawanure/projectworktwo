import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  FolderHeart, 
  FileText, 
  CreditCard, 
  Mail, 
  Send, 
  Settings, 
  LogOut, 
  Home,
  Menu,
  X
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Products', path: '/admin/products', icon: ShoppingBag },
    { name: 'Categories', path: '/admin/categories', icon: FolderHeart },
    { name: 'Orders', path: '/admin/orders', icon: FileText },
    { name: 'Payments', path: '/admin/payments', icon: CreditCard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Support Messages', path: '/admin/messages', icon: Mail },
    { name: 'Newsletter', path: '/admin/newsletter', icon: Send },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-dark text-white shrink-0">
        <div className="h-20 flex items-center justify-between px-6 border-b border-neutral-800">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold font-spartan text-primary">CozyCart</span>
            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Admin
            </span>
          </Link>
        </div>

        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-primary text-white font-semibold'
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                }`
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-neutral-800 space-y-2">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all"
          >
            <Home className="h-5 w-5" />
            <span>Customer Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center space-x-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-all text-left"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Sidebar Drawer for Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-neutral-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative flex flex-col w-64 max-w-xs bg-dark text-white h-full animate-in slide-in-from-left duration-300">
            <div className="h-20 flex items-center justify-between px-6 border-b border-neutral-800">
              <span className="text-xl font-bold font-spartan text-primary">CozyCart</span>
              <button onClick={() => setSidebarOpen(false)} className="p-1.5 text-neutral-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
              {menuItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-primary text-white font-semibold'
                        : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>
            <div className="p-4 border-t border-neutral-800 space-y-2">
              <Link
                to="/"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white"
              >
                <Home className="h-5 w-5" />
                <span>Customer Site</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center space-x-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-950/40 hover:text-red-300 text-left"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-grow overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-150 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 text-neutral-600 hover:text-dark lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold font-spartan tracking-wide capitalize text-dark">
              Admin Portal
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-dark">{user?.name}</p>
              <p className="text-xs text-neutral-400">{user?.email}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Dynamic Outlet */}
        <main className="flex-grow p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
