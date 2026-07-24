import React from 'react';
import { LogOut, AlertTriangle, X } from 'lucide-react';
import { Button } from '../ui/Button';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLogout: () => void;
  isLoggingOut?: boolean;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirmLogout,
  isLoggingOut = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-50">
      <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400 flex items-center justify-center font-bold shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
            Sign Out of Account?
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            You will be signed out of your current session. Unsaved draft tickets or changes will be safely stored in local state.
          </p>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoggingOut}
            className="flex-1 text-xs font-bold"
          >
            Cancel
          </Button>

          <Button
            size="sm"
            onClick={onConfirmLogout}
            isLoading={isLoggingOut}
            leftIcon={<LogOut className="w-4 h-4" />}
            className="flex-1 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white"
          >
            Sign Out Now
          </Button>
        </div>
      </div>
    </div>
  );
};
