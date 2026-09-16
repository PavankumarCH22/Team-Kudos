import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Gift,
  Trophy,
  BarChart3,
  User,
  ShieldAlert,
  LogOut,
  Sparkles,
  Send
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Sidebar = ({ onOpenGiveKudos, mobileOpen, setMobileOpen }) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Kudos Feed', path: '/feed', icon: Gift },
    { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { label: 'Department Stats', path: '/analytics', icon: BarChart3 },
    { label: 'My Profile', path: '/profile', icon: User }
  ];

  if (isAdmin) {
    navItems.push({ label: 'Admin Portal', path: '/admin', icon: ShieldAlert });
  }

  const closeSidebarMobile = () => {
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={closeSidebarMobile}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-slate-900 dark:bg-slate-950 text-white flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-slate-800 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight text-white">Team Kudos</h1>
                <p className="text-xs text-slate-400 font-medium">Peer Recognition Wall</p>
              </div>
            </div>
          </div>

          {/* Give Kudos Quick Action Button */}
          <div className="p-4">
            <button
              onClick={() => {
                closeSidebarMobile();
                onOpenGiveKudos();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-brand-600/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Send className="w-4 h-4" />
              <span>Give Kudos</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebarMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-600/20 text-brand-400 border-l-4 border-brand-500 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Allowance & Profile Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          {/* Monthly Allowance Pill */}
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
              <span>Giving Allowance</span>
              <span className="font-semibold text-brand-400">{user?.givingAllowance || 0} pts</span>
            </div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-brand-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, ((user?.givingAllowance || 0) / 100) * 100)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-9 h-9 rounded-full bg-slate-700 object-cover flex-shrink-0"
              />
              <div className="truncate">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.department}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleLogout}
                title="Log out"
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
