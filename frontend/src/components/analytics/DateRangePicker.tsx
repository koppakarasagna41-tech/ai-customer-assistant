import React, { useState } from 'react';
import {
  Calendar,
  Filter,
  Download,
  RefreshCw,
  SlidersHorizontal,
  FileSpreadsheet,
  FileText,
  ChevronDown,
} from 'lucide-react';
import { DateFilterState, DateRangePreset } from '../../types/analytics';
import { Button } from '../ui/Button';
import { toast } from 'sonner';

interface DateRangePickerProps {
  filterState: DateFilterState;
  onFilterChange: (newState: Partial<DateFilterState>) => void;
  onRefresh: () => void;
  onExport: (format: 'csv' | 'pdf') => void;
  isRefreshing?: boolean;
}

const presets: { label: string; value: DateRangePreset }[] = [
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 90 Days', value: '90d' },
  { label: 'Last 12 Months', value: '12m' },
  { label: 'Custom Range', value: 'custom' },
];

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  filterState,
  onFilterChange,
  onRefresh,
  onExport,
  isRefreshing = false,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Preset Selector Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 mr-1 flex items-center gap-1 shrink-0">
            <Calendar className="w-3.5 h-3.5" />
            Period:
          </span>
          {presets.map((p) => (
            <button
              key={p.value}
              onClick={() => onFilterChange({ preset: p.value })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filterState.preset === p.value
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Secondary Filter Dropdowns & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="relative">
            <select
              value={filterState.category}
              onChange={(e) => onFilterChange({ category: e.target.value })}
              className="pl-3 pr-8 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Technical">Technical &amp; API</option>
              <option value="Billing">Billing &amp; Payments</option>
              <option value="Security">Security &amp; SSO</option>
              <option value="Feature Request">Feature Requests</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Channel Filter */}
          <div className="relative">
            <select
              value={filterState.channel}
              onChange={(e) => onFilterChange({ channel: e.target.value })}
              className="pl-3 pr-8 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
            >
              <option value="All">All Channels</option>
              <option value="AI Support Chat">AI Support Chat</option>
              <option value="Web Portal Queue">Web Portal Queue</option>
              <option value="Email Dispatch">Email Dispatch</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            leftIcon={
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-500' : ''}`}
              />
            }
            className="text-xs"
          >
            Refresh
          </Button>

          {/* Export Dropdown Menu */}
          <div className="relative">
            <Button
              size="sm"
              onClick={() => setShowExportMenu(!showExportMenu)}
              leftIcon={<Download className="w-3.5 h-3.5" />}
              className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
            >
              Export
            </Button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-30 animate-in fade-in-50">
                <button
                  onClick={() => {
                    setShowExportMenu(false);
                    onExport('csv');
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                  <span>Export Raw Data (CSV)</span>
                </button>

                <button
                  onClick={() => {
                    setShowExportMenu(false);
                    onExport('pdf');
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-indigo-500" />
                  <span>Export Report (PDF)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Date Inputs if 'custom' is selected */}
      {filterState.preset === 'custom' && (
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs animate-in fade-in-50">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500">From:</span>
            <input
              type="date"
              value={filterState.startDate}
              onChange={(e) => onFilterChange({ startDate: e.target.value })}
              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500">To:</span>
            <input
              type="date"
              value={filterState.endDate}
              onChange={(e) => onFilterChange({ endDate: e.target.value })}
              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};
