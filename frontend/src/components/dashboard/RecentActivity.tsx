import React, { useState } from 'react';
import { Search, Filter, CheckCircle2, Clock, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { ActivityItem } from '../../types/dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ActivitySkeleton } from '../ui/Skeleton';
import { Input as CustomInput } from '../ui/Input';

interface RecentActivityProps {
  activities: ActivityItem[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  isLoading = false,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredActivities = activities.filter((act) => {
    const matchesSearch =
      act.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.target.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || act.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: ActivityItem['status']) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge variant="warning" className="gap-1">
            <Clock className="w-3 h-3 animate-spin" />
            In Progress
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="danger" className="gap-1">
            <XCircle className="w-3 h-3" />
            Failed
          </Badge>
        );
      case 'pending':
      default:
        return (
          <Badge variant="secondary" className="gap-1">
            <AlertCircle className="w-3 h-3" />
            Pending
          </Badge>
        );
    }
  };

  return (
    <Card className="border-slate-200/80 dark:border-slate-800">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold">Recent System Activity</CardTitle>
            <CardDescription>
              Real-time audit log stream of user actions, system events, and API invocations.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Refresh Activity Log"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
          <div className="w-full sm:w-64">
            <CustomInput
              placeholder="Search activity, user, target..."
              leftIcon={<Search className="w-4 h-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
            {['all', 'security', 'system', 'user', 'api'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white dark:bg-indigo-600'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <ActivitySkeleton key={i} />
            ))}
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            No activities matching current search filters.
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredActivities.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-300 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {item.user.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      <span className="font-bold">{item.user.name}</span>{' '}
                      <span className="font-normal text-slate-600 dark:text-slate-400">{item.action}</span>{' '}
                      <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
                        {item.target}
                      </code>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span>{item.timestamp}</span>
                      <span>•</span>
                      <span className="capitalize">{item.category}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">{getStatusBadge(item.status)}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
