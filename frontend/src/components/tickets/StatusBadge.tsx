import React from 'react';
import { Circle, Clock, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { TicketStatus } from '../../types/ticket';
import { cn } from '../../lib/utils';

interface StatusBadgeProps {
  status: TicketStatus;
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  showIcon = true,
}) => {
  const config: Record<
    TicketStatus,
    { label: string; icon: React.FC<{ className?: string }>; style: string }
  > = {
    open: {
      label: 'Open',
      icon: Circle,
      style: 'bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    },
    in_progress: {
      label: 'In Progress',
      icon: Clock,
      style: 'bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    },
    pending: {
      label: 'Pending',
      icon: AlertCircle,
      style: 'bg-purple-50 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    },
    resolved: {
      label: 'Resolved',
      icon: CheckCircle2,
      style: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    },
    closed: {
      label: 'Closed',
      icon: XCircle,
      style: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    },
  };

  const item = config[status] || config.open;
  const IconComponent = item.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border transition-colors whitespace-nowrap',
        item.style,
        className
      )}
    >
      {showIcon && <IconComponent className="w-3 h-3 shrink-0" />}
      <span>{item.label}</span>
    </span>
  );
};
