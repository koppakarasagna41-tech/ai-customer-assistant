import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  User as UserIcon,
  Globe,
  ShieldCheck,
  Bell,
  Sun,
  LogOut,
  Search,
  CheckCircle2,
  Lock,
} from 'lucide-react';

import { useAuth } from '../hooks/useAuth';
import { ProfileSettingsTab } from '../components/settings/ProfileSettingsTab';
import { AccountSettingsTab } from '../components/settings/AccountSettingsTab';
import { SecuritySettingsTab } from '../components/settings/SecuritySettingsTab';
import { NotificationSettingsTab } from '../components/settings/NotificationSettingsTab';
import { ThemeSettingsTab } from '../components/settings/ThemeSettingsTab';
import { LogoutModal } from '../components/settings/LogoutModal';
import { Badge } from '../components/ui/Badge';

export type SettingsTabId =
  | 'profile'
  | 'account'
  | 'security'
  | 'notifications'
  | 'theme';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Tab state synced with URL search params
  const activeTabFromUrl = (searchParams.get('tab') as SettingsTabId) || 'profile';
  const [activeTab, setActiveTab] = useState<SettingsTabId>(
    ['profile', 'account', 'security', 'notifications', 'theme'].includes(activeTabFromUrl)
      ? activeTabFromUrl
      : 'profile'
  );

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [settingsQuery, setSettingsQuery] = useState('');

  useEffect(() => {
    if (activeTabFromUrl !== activeTab) {
      setSearchParams({ tab: activeTab }, { replace: true });
    }
  }, [activeTab, activeTabFromUrl, setSearchParams]);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success('Signed out successfully.');
      navigate('/login');
    } catch {
      toast.error('Logout error occurred. Local session cleared.');
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
      setIsLogoutModalOpen(false);
    }
  };

  const tabs = [
    {
      id: 'profile' as SettingsTabId,
      label: 'Profile Information',
      description: 'Display name, photo, bio, contact',
      icon: UserIcon,
    },
    {
      id: 'account' as SettingsTabId,
      label: 'Account Preferences',
      description: 'Language, timezone, default landing',
      icon: Globe,
    },
    {
      id: 'security' as SettingsTabId,
      label: 'Security & Passwords',
      description: 'Change password, 2FA, sessions',
      icon: ShieldCheck,
    },
    {
      id: 'notifications' as SettingsTabId,
      label: 'Notification Alerts',
      description: 'Email, push, sound, SLA warnings',
      icon: Bell,
    },
    {
      id: 'theme' as SettingsTabId,
      label: 'Theme & Appearance',
      description: 'Light/dark mode, accent colors',
      icon: Sun,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Header Banner & User Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white text-xl font-extrabold shadow-md shrink-0">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AS'}
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 truncate">
                {user?.name || 'Account & System Settings'}
              </h1>
              <Badge variant="default" className="capitalize text-[10px] px-2 py-0.5">
                {user?.role || 'User'}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {user?.email || 'alex.smith@company.com'} • {user?.department || 'Engineering Support'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/80 border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Settings Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs sticky top-20">
          <div className="px-3 py-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Settings Navigation
          </div>

          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-900 dark:bg-indigo-950/80 dark:text-indigo-100 font-bold border border-indigo-200/80 dark:border-indigo-900 shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <div className="text-xs font-bold truncate">{tab.label}</div>
                    <div className="text-[10px] text-slate-400 truncate leading-tight font-normal">
                      {tab.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content Panel */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && <ProfileSettingsTab />}
          {activeTab === 'account' && <AccountSettingsTab />}
          {activeTab === 'security' && <SecuritySettingsTab />}
          {activeTab === 'notifications' && <NotificationSettingsTab />}
          {activeTab === 'theme' && <ThemeSettingsTab />}
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirmLogout={handleConfirmLogout}
        isLoggingOut={isLoggingOut}
      />
    </div>
  );
};
