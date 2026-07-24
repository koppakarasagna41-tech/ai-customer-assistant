import React from 'react';
import { cn } from '../../lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  ...props
}) => {
  const variantStyles = {
    text: 'h-4 w-full rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
    card: 'h-32 w-full rounded-2xl',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-slate-200/80 dark:bg-slate-800/80 transition-colors',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
};

export const StatCardSkeleton: React.FC = () => (
  <div className="p-5 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/90 space-y-3">
    <div className="flex items-center justify-between">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
    <Skeleton className="h-7 w-28" />
    <div className="flex items-center gap-2 pt-1">
      <Skeleton className="h-4 w-12 rounded-full" />
      <Skeleton className="h-3 w-20" />
    </div>
  </div>
);

export const ActivitySkeleton: React.FC = () => (
  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900/40 flex items-center justify-between gap-4">
    <div className="flex items-center gap-3 w-full">
      <Skeleton variant="circular" className="h-10 w-10 shrink-0" />
      <div className="space-y-1.5 w-full max-w-md">
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <Skeleton className="h-6 w-20 rounded-full shrink-0" />
  </div>
);
