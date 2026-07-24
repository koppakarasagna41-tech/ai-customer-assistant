import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { AIUsageMetrics } from '../../types/analytics';
import { Sparkles, Bot, Zap, DollarSign, Cpu, CheckCircle } from 'lucide-react';

interface AIUsageChartProps {
  metrics: AIUsageMetrics;
}

export const AIUsageChart: React.FC<AIUsageChartProps> = ({ metrics }) => {
  return (
    <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            AI Assistant Performance &amp; Deflection Engine
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Automated ticket resolution rate, human agent hand-offs, and estimated ROI.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900 text-xs font-extrabold">
            {metrics.deflectionRate}% Auto-Deflected
          </span>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <Bot className="w-3 h-3 text-indigo-500" />
            Total Queries
          </span>
          <div className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
            {metrics.totalQueries.toLocaleString()}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500" />
            Avg AI Confidence
          </span>
          <div className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
            {metrics.avgConfidenceScore}%
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-blue-500" />
            Staff Hours Saved
          </span>
          <div className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
            {metrics.estimatedHoursSaved} hrs
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-emerald-500" />
            Cost Saved (Est.)
          </span>
          <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
            ${metrics.estimatedCostSavedUSD.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Main Chart + Top Resolved Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Daily Volume Bar Chart */}
        <div className="lg:col-span-2 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Daily AI Automated vs Handoff Inflow
          </h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.dailyAiVolume} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="automated" name="AI Auto-Resolved" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
                <Bar dataKey="handedOff" name="Human Escalation" stackId="a" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top AI Topics List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Top AI Resolved Inquiry Topics
          </h3>
          <div className="space-y-2">
            {metrics.topAiTopics.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="font-bold text-slate-800 dark:text-slate-200 truncate">
                    {item.topic}
                  </div>
                  <div className="text-[10px] text-slate-400">{item.count} conversations</div>
                </div>

                <div className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold text-[10px] shrink-0">
                  {item.successRate}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
