import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ProfileSettingsTab } from '../components/settings/ProfileSettingsTab';
import { SecuritySettingsTab } from '../components/settings/SecuritySettingsTab';
import { LogoutModal } from '../components/settings/LogoutModal';
import { User, Key, LogOut, ShieldCheck } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'security'>('profile');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success('Signed out successfully.');
      navigate('/login');
    } catch {
      toast.error('Logout error occurred.');
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
      setIsLogoutModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Header Profile Card */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white text-2xl font-bold shadow-md shrink-0">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AS'}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {user?.name || 'User Profile'}
              </h1>
              <Badge variant="default" className="capitalize text-[10px]">
                {user?.role || 'User'}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user?.email} {user?.department ? `• ${user.department}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/80 border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Sub Tabs Selector */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'profile'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          Profile Details
        </button>

        <button
          onClick={() => setActiveSubTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'security'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Security &amp; Password
        </button>
      </div>

      {/* Selected Tab Content */}
      {activeSubTab === 'profile' ? <ProfileSettingsTab /> : <SecuritySettingsTab />}

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirmLogout={handleConfirmLogout}
        isLoggingOut={isLoggingOut}
      />
    </div>
  );
};
