import React from 'react';
import { Menu, Sparkles, Award, Gift } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ onToggleMobileSidebar, onOpenGiveKudos }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white lg:hidden rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white tracking-tight">Team Kudos</span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* User Quick Stats Header Pill */}
        <div className="hidden sm:flex items-center gap-3 bg-slate-100/80 dark:bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
            <Award className="w-4 h-4 text-amber-500" />
            <span>{user?.earnedPoints || 0} Earned</span>
          </div>
          <div className="w-px h-3.5 bg-slate-300 dark:bg-slate-700" />
          <div className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400">
            <Gift className="w-4 h-4 text-brand-500" />
            <span>{user?.givingAllowance || 0} Left</span>
          </div>
        </div>

        {/* Theme Switcher Toggle */}
        <ThemeToggle />

        <button
          onClick={onOpenGiveKudos}
          className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white rounded-lg text-xs font-medium"
        >
          <Gift className="w-3.5 h-3.5" />
          <span>Kudos</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
