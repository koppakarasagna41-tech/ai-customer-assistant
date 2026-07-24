import React from 'react';
import { Flame, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { TicketPriority } from '../../types/ticket';
import { cn } from '../../lib/utils';

interface PriorityBadgeProps {
  priority: TicketPriority;
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className }) => {
  const config: Record<
    TicketPriority,
    { label: string; icon: React.FC<{ className?: string }>; style: string }
  > = {
    urgent: {
      label: 'Urgent',
      icon: Flame,
      style: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200 border-rose-300 dark:border-rose-800 font-extrabold animate-pulse',
    },
    high: {
      label: 'High',
      icon: ArrowUp,
      style: 'bg-orange-50 text-orange-700 dark:bg-orange-950/80 dark:text-orange-300 border-orange-200 dark:border-orange-800 font-bold',
    },
    medium: {
      label: 'Medium',
      icon: Minus,
      style: 'bg-sky-50 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300 border-sky-200 dark:border-sky-800 font-semibold',
    },
    low: {
      label: 'Low',
      icon: ArrowDown,
      style: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700 font-medium',
    },
  };

  const item = config[priority] || config.medium;
  const IconComponent = item.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] border uppercase tracking-wider whitespace-nowrap',
        item.style,
        className
      )}
    >
      <IconComponent className="w-3 h-3 shrink-0" />
      <span>{item.label}</span>
    </span>
  );
};
