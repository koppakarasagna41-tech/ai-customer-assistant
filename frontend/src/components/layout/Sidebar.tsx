import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  User,
  Settings,
  ShieldCheck,
  Code,
  Key,
  X,
  Database,
  MessageSquare,
  Ticket as TicketIcon,
  BookOpen,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Reports', path: '/reports', icon: FileText },
    { label: 'Ticket Queue', path: '/tickets', icon: TicketIcon },
    { label: 'Knowledge Base', path: '/kb', icon: BookOpen },
    { label: 'AI Support Chat', path: '/chat', icon: MessageSquare },
    { label: 'User Profile', path: '/profile', icon: User },
    { label: 'API & Config', path: '/settings', icon: Settings },
  ];

  const infoBlocks = [
    { label: 'Auth Context', value: 'Active', icon: ShieldCheck },
    { label: 'Axios Client', value: 'Configured', icon: Code },
    { label: 'Token Storage', value: 'LocalStorage', icon: Key },
    { label: 'Environment', value: 'VITE_API_URL', icon: Database },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          'fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 dark:bg-slate-900 dark:border-slate-800 transition-transform duration-300 ease-in-out flex flex-col justify-between p-4',
          !isOpen && '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="space-y-6">
          {/* Mobile Header with close button */}
          <div className="flex items-center justify-between lg:hidden pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="font-semibold text-xs text-slate-500 uppercase tracking-wider">
              Navigation Menu
            </span>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <p className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Main Console
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150',
                      isActive
                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 font-bold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                    )
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* System Architecture Highlights */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
              Architecture Status
            </p>
            <div className="space-y-2 px-1">
              {infoBlocks.map((block, idx) => {
                const Icon = block.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="text-[11px] text-slate-600 dark:text-slate-300">
                        {block.label}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                      {block.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white text-xs space-y-1 shadow-xs">
          <p className="font-semibold text-indigo-200">VITE_API_URL Service</p>
          <p className="text-[11px] text-slate-300 leading-tight">
            Ready for API integration via <code className="text-amber-300">src/services/api.ts</code>.
          </p>
        </div>
      </aside>
    </>
  );
};
