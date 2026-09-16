import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Award,
  Gift,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Users,
  Zap,
  BarChart3,
  Flame,
  Heart,
  Star,
  Building2,
  Lock,
  Play,
  Trophy,
  Crown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/common/ThemeToggle';
import Tilt3DCard from '../components/common/Tilt3DCard';

const LandingPage = () => {
  const { user, login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [demoReactions, setDemoReactions] = useState({
    fire: 14,
    clap: 9,
    plusOne: 18
  });
  const [activeReactions, setActiveReactions] = useState(['fire']);

  const toggleDemoEmoji = (type) => {
    const isActive = activeReactions.includes(type);
    setActiveReactions((prev) =>
      isActive ? prev.filter((t) => t !== type) : [...prev, type]
    );
    setDemoReactions((prev) => ({
      ...prev,
      [type]: isActive ? prev[type] - 1 : prev[type] + 1
    }));
  };

  const handleQuickDemoLogin = async (email, password) => {
    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-brand-500 selection:text-white relative overflow-hidden">
      {/* Background Ambient Mesh Lights */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-brand-600/30 via-indigo-600/20 to-purple-600/30 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-gradient-to-tr from-rose-500/20 via-amber-500/20 to-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-brand-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand-400" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Team Kudos
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-extrabold uppercase bg-brand-500/20 text-brand-400 rounded-full border border-brand-500/30">
                Enterprise 3D
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#demo" className="hover:text-white transition-colors">3D Interactive Demo</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {user ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-500/30 transition-all hover:scale-105"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-500/30 transition-all hover:scale-105"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight max-w-5xl mx-auto">
          Transform Company Culture with{' '}
          <span className="bg-gradient-to-r from-brand-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
            Instant Peer Kudos
          </span>
        </h1>

        <p className="mt-6 text-slate-400 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed font-normal">
          Empower your team to send monthly appreciation points, tag core company values, unlock achievement badges, and view real-time leaderboard rankings.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => handleQuickDemoLogin('alex.rivera@teamkudos.com', 'Password123!')}
            className="flex items-center gap-2.5 px-7 py-4 bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-brand-600/40 transition-all transform hover:scale-105 active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch Employee Demo (Alex)</span>
          </button>

          <button
            onClick={() => handleQuickDemoLogin('admin@teamkudos.com', 'Password123!')}
            className="flex items-center gap-2.5 px-7 py-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm rounded-2xl border border-slate-700 shadow-xl transition-all transform hover:scale-105"
          >
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <span>Launch Admin Portal (Sarah)</span>
          </button>
        </div>

        {/* 3D Interactive Card Showcase Section */}
        <div className="mt-20 max-w-3xl mx-auto relative" id="demo">
          {/* Floating 3D Badge 1 (Top Left) */}
          <div className="hidden md:flex absolute -top-8 -left-12 z-30 items-center gap-2 px-4 py-2.5 bg-slate-900/90 border border-amber-500/40 rounded-2xl shadow-2xl backdrop-blur-xl animate-float-3d">
            <Crown className="w-5 h-5 text-amber-400" />
            <div className="text-left text-xs">
              <p className="font-extrabold text-white">#1 Gold Champion</p>
              <p className="text-[10px] text-amber-300">Elena Rostova • 320 pts</p>
            </div>
          </div>

          {/* Floating 3D Badge 2 (Bottom Right) */}
          <div className="hidden md:flex absolute -bottom-8 -right-10 z-30 items-center gap-2 px-4 py-2.5 bg-slate-900/90 border border-brand-500/40 rounded-2xl shadow-2xl backdrop-blur-xl animate-float-reverse-3d">
            <Sparkles className="w-5 h-5 text-brand-400" />
            <div className="text-left text-xs">
              <p className="font-extrabold text-white">+50 Points Transferred</p>
              <p className="text-[10px] text-brand-300">MongoDB Atomic Transaction</p>
            </div>
          </div>

          {/* 3D Tilt Card Wrapper */}
          <Tilt3DCard className="text-left">
            <div className="relative p-1 rounded-3xl bg-gradient-to-r from-brand-500 via-purple-500 to-pink-500 shadow-2xl shadow-purple-500/30">
              <div className="bg-slate-900 rounded-[22px] p-6 sm:p-8 space-y-5">
                <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=alex"
                      alt="Alex"
                      className="w-12 h-12 rounded-full ring-2 ring-brand-500 shadow-md"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white text-base">Alex Rivera</span>
                        <span className="text-xs text-brand-400 font-semibold bg-brand-500/20 px-2 py-0.5 rounded-full border border-brand-500/30">
                          Engineering
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        recognized <strong className="text-purple-300">Elena Rostova</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold text-sm rounded-full shadow-lg shadow-amber-500/30 animate-pulse-glow">
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>+50 Kudos</span>
                  </div>
                </div>

                <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-normal">
                  "Elena architected our database transaction pipeline flawlessly! Zero downtime during peak release windows. Outstanding technical leadership!"
                </p>

                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-brand-500/20 text-brand-300 font-bold text-xs rounded-lg border border-brand-500/30">
                    #Innovation
                  </span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 font-bold text-xs rounded-lg border border-purple-500/30">
                    #Teamwork
                  </span>
                </div>

                {/* Interactive Reaction Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                  <span className="text-slate-400 text-xs font-medium">Try hover tilt & click reactions:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleDemoEmoji('fire')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        activeReactions.includes('fire')
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-lg shadow-rose-500/20'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>🔥</span>
                      <span>{demoReactions.fire}</span>
                    </button>

                    <button
                      onClick={() => toggleDemoEmoji('clap')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        activeReactions.includes('clap')
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/20'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>👏</span>
                      <span>{demoReactions.clap}</span>
                    </button>

                    <button
                      onClick={() => toggleDemoEmoji('plusOne')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        activeReactions.includes('plusOne')
                          ? 'bg-brand-500/20 border-brand-500 text-brand-300 shadow-lg shadow-brand-500/20'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>👍</span>
                      <span>{demoReactions.plusOne}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Tilt3DCard>
        </div>
      </section>

      {/* 3D Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900" id="features">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="px-3.5 py-1 bg-purple-500/10 text-purple-400 font-bold text-xs rounded-full border border-purple-500/20">
            Engineered for Modern Enterprise Teams
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            3D Interactive Feature Architecture
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Tilt3DCard>
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 h-full space-y-4">
              <Gift className="w-8 h-8 text-brand-400" />
              <h3 className="text-xl font-bold text-white">Monthly Allowance</h3>
              <p className="text-slate-400 text-sm">Every employee receives 100 points monthly to appreciate peers.</p>
            </div>
          </Tilt3DCard>

          <Tilt3DCard>
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 h-full space-y-4">
              <Lock className="w-8 h-8 text-purple-400" />
              <h3 className="text-xl font-bold text-white">Atomic Point Transfer</h3>
              <p className="text-slate-400 text-sm">Guaranteed double-spend and self-kudos protection with MongoDB transactions.</p>
            </div>
          </Tilt3DCard>

          <Tilt3DCard>
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 h-full space-y-4">
              <Award className="w-8 h-8 text-amber-400" />
              <h3 className="text-xl font-bold text-white">Monthly Leaderboards</h3>
              <p className="text-slate-400 text-sm">Automated pipeline aggregations highlighting Top 3 monthly contributors.</p>
            </div>
          </Tilt3DCard>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900" id="pricing">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="px-3.5 py-1 bg-brand-500/10 text-brand-400 font-bold text-xs rounded-full border border-brand-500/20">
            Simple Enterprise Pricing
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Flexible Plans for Any Team Size
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-white">Starter</h3>
            <div className="text-4xl font-black text-white">$0 <span className="text-sm font-normal text-slate-400">/ dev demo</span></div>
            <Link to="/login" className="block text-center py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl">
              Launch Demo
            </Link>
          </div>

          <Tilt3DCard>
            <div className="p-8 rounded-3xl bg-gradient-to-b from-brand-900/50 via-slate-900 to-slate-900 border-2 border-brand-500 shadow-2xl shadow-brand-500/20 space-y-6 relative">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-brand-500 to-purple-500 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-full shadow-md">
                Most Popular
              </span>
              <h3 className="text-lg font-bold text-white">Business Pro</h3>
              <div className="text-4xl font-black text-white">$4 <span className="text-sm font-normal text-slate-400">/ user / mo</span></div>
              <Link to="/signup" className="block text-center py-3.5 bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-brand-600/30">
                Start 14-Day Free Trial
              </Link>
            </div>
          </Tilt3DCard>

          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-white">Enterprise</h3>
            <div className="text-4xl font-black text-white">Custom <span className="text-sm font-normal text-slate-400">/ quote</span></div>
            <Link to="/login" className="block text-center py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-xs text-slate-500 flex justify-between items-center">
        <span>© 2026 Team Kudos. All rights reserved.</span>
        <ThemeToggle />
      </footer>
    </div>
  );
};

export default LandingPage;
