import React from 'react';
import {
  CategoryBreakdown,
  PriorityBreakdown,
  ChannelBreakdown,
} from '../../types/analytics';
import { Layers, ShieldAlert, Radio } from 'lucide-react';

interface CategoryPriorityBreakdownProps {
  categories: CategoryBreakdown[];
  priorities: PriorityBreakdown[];
  channels: ChannelBreakdown[];
}

export const CategoryPriorityBreakdown: React.FC<CategoryPriorityBreakdownProps> = ({
  categories,
  priorities,
  channels,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Category Distribution & SLA */}
      <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-4">
        <div className="pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              Category Breakdown &amp; SLA Compliance
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Ticket volume per topic category and SLA response success rate.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          {categories.map((cat) => (
            <div key={cat.category} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-800 dark:text-slate-200 font-bold">{cat.category}</span>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="text-slate-400">{cat.count} tickets</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    {cat.slaMetPercentage}% SLA met
                  </span>
                </div>
              </div>

              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(cat.count / 500) * 100}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Priority & Channel Distribution */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-5">
        {/* Priority Breakdown */}
        <div className="space-y-3">
          <div className="pb-1 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
              Priority Severity
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {priorities.map((p) => (
              <div
                key={p.priority}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
                    {p.priority}
                  </span>
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: p.color }}
                  />
                </div>
                <div className="text-sm font-black text-slate-900 dark:text-slate-100">
                  {p.count} <span className="text-[10px] font-normal text-slate-400">({p.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Channel Inflow */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="pb-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-indigo-500" />
              Inflow Channel Distribution
            </h2>
          </div>

          <div className="space-y-2">
            {channels.map((ch) => (
              <div key={ch.channel} className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  <span>{ch.channel}</span>
                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                    {ch.percentage}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${ch.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
