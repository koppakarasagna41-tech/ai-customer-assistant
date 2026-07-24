import React from 'react';
import {
  Ticket,
  Clock,
  CheckCircle2,
  Smile,
  Sparkles,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { KPIMetric } from '../../types/analytics';
import { cn } from '../../lib/utils';

interface AnalyticsKPICardsProps {
  metrics: KPIMetric[];
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Ticket,
  Clock,
  CheckCircle2,
  Smile,
  Sparkles,
  DollarSign,
};

export const AnalyticsKPICards: React.FC<AnalyticsKPICardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((m) => {
        const IconComponent = iconMap[m.iconName] || Ticket;

        // Determine if change direction is good or bad based on isPositiveGood
        const isGoodChange = m.isPositiveGood ? m.change >= 0 : m.change <= 0;

        return (
          <div
            key={m.id}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-3 group"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {m.title}
              </span>

              <div className="h-9 w-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <IconComponent className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                {m.value}
              </div>

              <div className="flex items-center gap-2 pt-0.5">
                <span
                  className={cn(
                    'inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-extrabold',
                    isGoodChange
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                  )}
                >
                  {m.change >= 0 ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {m.change >= 0 ? `+${m.change}%` : `${m.change}%`}
                </span>

                <span className="text-[11px] text-slate-400 font-medium">
                  {m.periodLabel}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {m.subtext}
            </div>
          </div>
        );
      })}
    </div>
  );
};
