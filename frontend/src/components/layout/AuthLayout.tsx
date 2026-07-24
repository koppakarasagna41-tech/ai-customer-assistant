import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ShieldCheck, Server, Lock, Layers } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Left Branding & Showcase Panel (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white relative overflow-hidden flex-col justify-between p-12 dark:bg-slate-900/90 dark:border-r dark:border-slate-800">
        {/* Background Subtle Patterns */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Branding Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white">Nexus Enterprise</span>
            <p className="text-xs text-indigo-300 font-medium">Frontend Architecture Template</p>
          </div>
        </div>

        {/* Central Feature Showcase */}
        <div className="relative z-10 my-auto max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
            <Server className="w-3.5 h-3.5" />
            Configured with VITE_API_URL
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
            Production-ready React 19 Frontend Boilerplate
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Engineered with strict TypeScript typing, Axios request interceptors, Auth Context, Zod validation, and dark mode support.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <ShieldCheck className="w-5 h-5 text-indigo-400 mb-2" />
              <h4 className="text-sm font-semibold text-white">JWT Interceptors</h4>
              <p className="text-xs text-slate-400 mt-1">Automatic Bearer token injection & 401 handling.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Lock className="w-5 h-5 text-indigo-400 mb-2" />
              <h4 className="text-sm font-semibold text-white">Secure Storage</h4>
              <p className="text-xs text-slate-400 mt-1">Encapsulated token storage with session recovery.</p>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-6">
          <span>&copy; {new Date().getFullYear()} Nexus Enterprise Frontend</span>
          <div className="flex gap-4">
            <a href="#terms" className="hover:text-slate-200 transition-colors">Terms</a>
            <a href="#privacy" className="hover:text-slate-200 transition-colors">Privacy</a>
          </div>
        </div>
      </div>

      {/* Right Form Content Area */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-4 sm:p-8 lg:p-12 relative">
        {/* Top Right Controls */}
        <div className="flex items-center justify-between lg:justify-end w-full">
          <Link to="/" className="lg:hidden flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-base">Nexus</span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle showLabel />
          </div>
        </div>

        {/* Form Outlet */}
        <div className="w-full max-w-md mx-auto my-auto py-8">
          <Outlet />
        </div>

        {/* Mobile Footer */}
        <div className="lg:hidden text-center text-xs text-slate-500 dark:text-slate-400 pt-4">
          &copy; {new Date().getFullYear()} Nexus Enterprise Frontend
        </div>
      </div>
    </div>
  );
};
