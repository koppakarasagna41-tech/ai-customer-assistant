import React from 'react';

export const AnalyticsSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top Filter Bar Skeleton */}
      <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />

      {/* KPI Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
              <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            </div>
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
          </div>
        ))}
      </div>

      {/* Main Charts Row Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
          <div className="h-64 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-full" />
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
          <div className="h-64 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-full" />
        </div>
      </div>

      {/* Secondary Row Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-2/5" />
          <div className="h-48 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-full" />
        </div>
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-2/5" />
          <div className="h-48 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
};
