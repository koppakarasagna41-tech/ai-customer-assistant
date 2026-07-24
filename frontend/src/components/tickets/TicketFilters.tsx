import React from 'react';
import {
  Search,
  Filter,
  X,
  ArrowUpDown,
  LayoutGrid,
  List,
  RotateCcw,
} from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface TicketFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusChange: (s: string) => void;
  priorityFilter: string;
  onPriorityChange: (p: string) => void;
  categoryFilter: string;
  onCategoryChange: (c: string) => void;
  sortBy: string;
  onSortByChange: (sb: string) => void;
  sortOrder: 'asc' | 'desc';
  onToggleSortOrder: () => void;
  viewMode: 'table' | 'cards';
  onViewModeChange: (vm: 'table' | 'cards') => void;
  onResetFilters: () => void;
  totalResults: number;
}

export const TicketFilters: React.FC<TicketFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  categoryFilter,
  onCategoryChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onToggleSortOrder,
  viewMode,
  onViewModeChange,
  onResetFilters,
  totalResults,
}) => {
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    categoryFilter !== 'all';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-2xs">
      {/* Top Search & Primary Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="flex-1 max-w-lg">
          <Input
            placeholder="Search tickets by ID, title, description or tag..."
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="text-xs"
          />
        </div>

        {/* View Switcher & Reset */}
        <div className="flex items-center gap-2 justify-between md:justify-end">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => onViewModeChange('cards')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Cards View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Cards</span>
            </button>
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              className="text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Filter Dropdowns Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
        {/* Status Filter */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
            Priority
          </label>
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
            Category
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Technical">Technical</option>
            <option value="Billing">Billing</option>
            <option value="Bug">Bug</option>
            <option value="Feature Request">Feature Request</option>
            <option value="Security">Security</option>
            <option value="Account">Account</option>
          </select>
        </div>

        {/* Sort By Control */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
            Sort By
          </label>
          <div className="flex items-center gap-1">
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="flex-1 px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="createdAt">Date Created</option>
              <option value="updatedAt">Last Updated</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
              <option value="title">Title</option>
            </select>
            <button
              onClick={onToggleSortOrder}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              title={`Sort ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between pt-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
        <span>
          Showing <strong className="text-slate-900 dark:text-slate-100">{totalResults}</strong> tickets
        </span>
        {hasActiveFilters && (
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-[11px]">
            Filtered Results
          </span>
        )}
      </div>
    </div>
  );
};
