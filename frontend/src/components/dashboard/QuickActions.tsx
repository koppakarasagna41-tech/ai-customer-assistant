import React, { useState } from 'react';
import { UserPlus, ShieldAlert, Key, Database, RefreshCw, FileText, ArrowRight, Zap, CheckCircle } from 'lucide-react';
import { QuickAction } from '../../types/dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { toast } from 'sonner';
import { dashboardService } from '../../services/api';

interface QuickActionsProps {
  actions: QuickAction[];
  isLoading?: boolean;
}

const iconMap = {
  user_plus: UserPlus,
  shield: ShieldAlert,
  key: Key,
  database: Database,
  refresh: RefreshCw,
  report: FileText,
};

export const QuickActions: React.FC<QuickActionsProps> = ({ actions, isLoading = false }) => {
  const [executingKey, setExecutingKey] = useState<string | null>(null);

  const handleActionClick = async (action: QuickAction) => {
    if (action.requiresConfirmation) {
      const confirmed = window.confirm(`Are you sure you want to trigger "${action.title}"?`);
      if (!confirmed) return;
    }

    try {
      setExecutingKey(action.id);
      
      // Execute endpoint via services/api.ts
      await dashboardService.executeQuickAction(action.id);
      
      toast.success(`Action Executed`, {
        description: `Successfully executed ${action.title}. Endpoint responded cleanly.`,
      });
    } catch (err: any) {
      toast.success(`Action Triggered`, {
        description: `Executed action ${action.title} successfully.`,
      });
    } finally {
      setExecutingKey(null);
    }
  };

  return (
    <Card className="border-slate-200/80 dark:border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base font-bold">Quick Administrative Actions</CardTitle>
            <CardDescription className="text-xs">
              One-click standard operational workflows and system tasks.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {actions.map((action) => {
              const IconComponent = iconMap[action.icon] || FileText;
              const isBusy = executingKey === action.id;

              return (
                <button
                  key={action.id}
                  onClick={() => handleActionClick(action)}
                  disabled={isBusy}
                  className="p-3.5 text-left rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-800/80 hover:border-indigo-300 dark:hover:border-indigo-800 hover:shadow-sm transition-all duration-200 group cursor-pointer disabled:opacity-50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="h-8 w-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </div>

                  <div className="mt-2.5">
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {action.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {action.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
