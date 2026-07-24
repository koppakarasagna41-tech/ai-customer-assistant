import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { CSATRatingDistribution, CSATTrendPoint } from '../../types/analytics';
import { Smile, Star, ThumbsUp, Quote } from 'lucide-react';

interface CustomerSatisfactionChartProps {
  ratings: CSATRatingDistribution[];
  trends: CSATTrendPoint[];
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#f97316', '#ef4444'];

export const CustomerSatisfactionChart: React.FC<CustomerSatisfactionChartProps> = ({
  ratings,
  trends,
}) => {
  const totalReviews = ratings.reduce((acc, r) => acc + r.count, 0);

  return (
    <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Smile className="w-4 h-4 text-emerald-500" />
            Customer Satisfaction (CSAT)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Post-resolution feedback rating distribution &amp; review sentiment.
          </p>
        </div>

        <div className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 text-xs font-extrabold flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
          <span>4.85 / 5.0</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Rating Bars */}
        <div className="space-y-2.5">
          {ratings.map((item, idx) => (
            <div key={item.rating} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1">
                  <span className="font-bold">{item.rating}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </span>
                <span className="text-slate-400 text-[11px]">
                  {item.count} ({item.percentage}%)
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: COLORS[idx] || '#6366f1',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Donut Chart Visualization */}
        <div className="h-48 w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ratings}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="count"
              >
                {ratings.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-lg font-black text-slate-900 dark:text-slate-100">92.6%</span>
            <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
              Positive
            </span>
          </div>
        </div>
      </div>

      {/* Customer Feedback Snippet Quote */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1">
        <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold">
          <Quote className="w-3.5 h-3.5" />
          <span>Recent Verified Feedback</span>
        </div>
        <p className="text-slate-600 dark:text-slate-300 italic text-[11px] leading-relaxed">
          "The AI Support Chat provided an instant code snippet to fix our OAuth refresh token loop within 20 seconds. Exceptional speed and accurate technical resolution!"
        </p>
      </div>
    </div>
  );
};
