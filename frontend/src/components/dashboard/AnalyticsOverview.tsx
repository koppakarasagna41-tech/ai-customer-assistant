import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { BarChart2, Cpu, HardDrive, Wifi } from 'lucide-react';

export const AnalyticsOverview: React.FC = () => {
  return (
    <Card className="border-slate-200/80 dark:border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Infrastructure & System Throughput
            </CardTitle>
            <CardDescription className="text-xs">
              Live operational metrics & resource distribution across clusters.
            </CardDescription>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Cluster Healthy
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <Cpu className="w-3.5 h-3.5 text-indigo-500" /> CPU Allocation
              </span>
              <span className="font-bold text-slate-900 dark:text-slate-100">34.2%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full w-[34.2%]" />
            </div>
            <div className="text-[11px] text-slate-400">8 of 24 Cores Active</div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <HardDrive className="w-3.5 h-3.5 text-cyan-500" /> Memory Footprint
              </span>
              <span className="font-bold text-slate-900 dark:text-slate-100">62.8%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full w-[62.8%]" />
            </div>
            <div className="text-[11px] text-slate-400">10.05 GB / 16 GB Allocated</div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <Wifi className="w-3.5 h-3.5 text-emerald-500" /> Network Bandwidth
              </span>
              <span className="font-bold text-slate-900 dark:text-slate-100">1.2 GB/s</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[45%]" />
            </div>
            <div className="text-[11px] text-slate-400">Low latency (12ms average)</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
