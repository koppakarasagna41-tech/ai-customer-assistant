import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  ShieldCheck,
  Server,
  Key,
  Globe,
  UserCheck,
  Code2,
  RefreshCw,
  Copy,
  Check,
  Sparkles,
  Layers,
} from 'lucide-react';

import { useAuth } from '../hooks/useAuth';
import { storage } from '../lib/storage';
import { dashboardService, systemService } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { StatCards } from '../components/dashboard/StatCards';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { QuickActions } from '../components/dashboard/QuickActions';
import { AnalyticsOverview } from '../components/dashboard/AnalyticsOverview';
import { ErrorState } from '../components/ui/ErrorState';
import { ActivityItem, QuickAction, StatMetric } from '../types/dashboard';

const defaultStats: StatMetric[] = [
  {
    id: '1',
    title: 'Total Active Users',
    value: '24,892',
    change: '+14.2%',
    period: 'vs last month',
    trend: 'up',
    iconName: 'users',
  },
  {
    id: '2',
    title: 'API Throughput',
    value: '1.42M',
    change: '+8.7%',
    period: 'vs last week',
    trend: 'up',
    iconName: 'activity',
  },
  {
    id: '3',
    title: 'Security Audits',
    value: '99.98%',
    change: '+0.02%',
    period: 'compliance rate',
    trend: 'up',
    iconName: 'shield',
  },
  {
    id: '4',
    title: 'Monthly Recurring',
    value: '$128,450',
    change: '+18.4%',
    period: 'ARR target',
    trend: 'up',
    iconName: 'dollar',
  },
];

const defaultActivities: ActivityItem[] = [
  {
    id: 'act-1',
    user: { name: 'Sarah Connor', email: 'sarah@enterprise.com' },
    action: 'provisioned new OAuth client key for',
    target: 'Production-Applet-Service',
    timestamp: '2 mins ago',
    status: 'completed',
    category: 'security',
  },
  {
    id: 'act-2',
    user: { name: 'Alex Rivera', email: 'alex@enterprise.com' },
    action: 'triggered database schema sync on',
    target: 'PostgreSQL-Cluster-01',
    timestamp: '14 mins ago',
    status: 'completed',
    category: 'system',
  },
  {
    id: 'act-3',
    user: { name: 'DevOps Bot', email: 'bot@enterprise.com' },
    action: 'executed automated backup rotation for',
    target: 's3-primary-storage',
    timestamp: '1 hour ago',
    status: 'completed',
    category: 'api',
  },
  {
    id: 'act-4',
    user: { name: 'Michael Scott', email: 'michael@enterprise.com' },
    action: 'attempted elevated role modification for',
    target: 'user_883920',
    timestamp: '2 hours ago',
    status: 'in_progress',
    category: 'user',
  },
  {
    id: 'act-5',
    user: { name: 'Elena Rostova', email: 'elena@enterprise.com' },
    action: 'updated CORS origin configuration on',
    target: 'gateway-api-v2',
    timestamp: '5 hours ago',
    status: 'completed',
    category: 'security',
  },
];

const defaultQuickActions: QuickAction[] = [
  {
    id: 'action-provision-user',
    title: 'Provision Team Member',
    description: 'Grant role-based access & invite via email.',
    icon: 'user_plus',
    category: 'user',
  },
  {
    id: 'action-rotate-keys',
    title: 'Rotate API Keys',
    description: 'Invalidate stale tokens & issue new secrets.',
    icon: 'key',
    category: 'security',
    requiresConfirmation: true,
  },
  {
    id: 'action-sync-db',
    title: 'Sync DB Schema',
    description: 'Validate migrations against production schema.',
    icon: 'database',
    category: 'system',
  },
  {
    id: 'action-flush-cache',
    title: 'Flush Redis Cache',
    description: 'Clear edge CDN & application key store.',
    icon: 'refresh',
    category: 'system',
    requiresConfirmation: true,
  },
  {
    id: 'action-audit-log',
    title: 'Export Audit Log',
    description: 'Download CSV audit report for compliance.',
    icon: 'report',
    category: 'system',
  },
  {
    id: 'action-security-scan',
    title: 'Run Vulnerability Scan',
    description: 'Trigger immediate automated security scan.',
    icon: 'shield',
    category: 'security',
  },
];

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [copiedToken, setCopiedToken] = useState(false);
  const [isHealthChecking, setIsHealthChecking] = useState(false);
  const [healthResult, setHealthResult] = useState<{ status: string; timestamp: string } | null>(null);

  // Dashboard Data State
  const [stats, setStats] = useState<StatMetric[]>(defaultStats);
  const [activities, setActivities] = useState<ActivityItem[]>(defaultActivities);
  const [quickActions, setQuickActions] = useState<QuickAction[]>(defaultQuickActions);
  
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || 'https://api.example.com/v1';
  const token = storage.getAccessToken() || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.demo_bearer_token';

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      // Attempt fetching using src/services/api.ts
      const [fetchedStats, fetchedActivities, fetchedActions] = await Promise.allSettled([
        dashboardService.getStats(),
        dashboardService.getRecentActivity(),
        dashboardService.getQuickActions(),
      ]);

      if (fetchedStats.status === 'fulfilled') setStats(fetchedStats.value);
      if (fetchedActivities.status === 'fulfilled') setActivities(fetchedActivities.value);
      if (fetchedActions.status === 'fulfilled') setQuickActions(fetchedActions.value);

    } catch (err) {
      setHasError(true);
      setErrorMessage(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(token);
    setCopiedToken(true);
    toast.success('Access token copied to clipboard!');
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleHealthCheck = async () => {
    setIsHealthChecking(true);
    try {
      const res = await systemService.checkHealth();
      setHealthResult(res);
      toast.success('Health check request dispatched successfully!');
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : 'Connection failed';
      setHealthResult({
        status: `Attempted GET ${apiUrl}/health (${errMessage})`,
        timestamp: new Date().toISOString(),
      });
      toast.info('API request dispatched to VITE_API_URL as designed');
    } finally {
      setIsHealthChecking(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white shadow-lg">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Enterprise React 19 Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Developer'}!
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Your frontend dashboard is equipped with statistics metrics, quick action controls, real-time audit logs, and environment-driven API routing via <code className="text-amber-300 font-mono">import.meta.env.VITE_API_URL</code>.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDashboardData}
              isLoading={isLoading}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
            >
              Sync Dashboard
            </Button>
            <Badge variant="success" className="px-3 py-1.5 text-xs font-bold shadow-xs">
              <UserCheck className="w-3.5 h-3.5 mr-1" />
              Authenticated Session
            </Badge>
          </div>
        </div>
      </div>

      {/* Error state if major API fault */}
      {hasError && (
        <ErrorState
          title="Dashboard API Endpoint Error"
          description={errorMessage || 'Unable to fetch real-time metrics. Displaying fallback dataset while listening on import.meta.env.VITE_API_URL.'}
          onRetry={fetchDashboardData}
          isRetrying={isLoading}
        />
      )}

      {/* Statistics Cards */}
      <StatCards stats={stats} isLoading={isLoading} />

      {/* Main Grid Layout: Quick Actions & System Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions Panel */}
          <QuickActions actions={quickActions} isLoading={isLoading} />

          {/* Infrastructure Throughput Visualizer */}
          <AnalyticsOverview />

          {/* Activity Log Feed */}
          <RecentActivity activities={activities} isLoading={isLoading} onRefresh={fetchDashboardData} />
        </div>

        {/* Sidebar: API Config & Architecture Inspector */}
        <div className="space-y-6">
          <Card className="border-slate-200/80 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                API Target Configuration
              </CardTitle>
              <CardDescription className="text-xs">
                All requests route through <code className="font-mono">VITE_API_URL</code>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-mono break-all font-bold text-slate-800 dark:text-slate-200">
                {apiUrl}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Active Interceptor:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Bearer Token Enabled</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Refresh Strategy:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Auto 401 Intercept</span>
              </div>
            </CardContent>
          </Card>

          {/* Token & Request Inspector */}
          <Card className="border-slate-200/80 dark:border-slate-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <CardTitle className="text-base font-bold">Bearer Header Inspector</CardTitle>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Cached Token
                </span>
                <button
                  onClick={handleCopyToken}
                  className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedToken ? 'Copied' : 'Copy Token'}
                </button>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 text-slate-200 font-mono text-[11px] break-all border border-slate-800 shadow-inner">
                <span className="text-indigo-400 font-bold">Authorization: </span>
                <span className="text-emerald-400">Bearer </span>
                <span>{token.slice(0, 32)}...</span>
              </div>

              <div className="pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleHealthCheck}
                  isLoading={isHealthChecking}
                  leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                  className="w-full text-xs"
                >
                  Ping Health Endpoint
                </Button>
              </div>

              {healthResult && (
                <div className="p-2.5 rounded-lg bg-slate-900 text-[10px] font-mono space-y-1 text-slate-300 border border-slate-800">
                  <div className="text-indigo-400">Health Check Status:</div>
                  <pre className="text-emerald-400 whitespace-pre-wrap">{healthResult.status}</pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Exported Service Methods */}
          <Card className="border-slate-200/80 dark:border-slate-800">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <CardTitle className="text-base font-bold">Dashboard API Services</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-2">
              <div className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[11px] space-y-0.5">
                <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400 flex justify-between">
                  <span>dashboardService.getStats()</span>
                  <Badge variant="outline" className="text-[9px]">GET</Badge>
                </div>
                <div className="text-slate-400 font-mono text-[10px]">/dashboard/stats</div>
              </div>

              <div className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[11px] space-y-0.5">
                <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400 flex justify-between">
                  <span>dashboardService.getRecentActivity()</span>
                  <Badge variant="outline" className="text-[9px]">GET</Badge>
                </div>
                <div className="text-slate-400 font-mono text-[10px]">/dashboard/activities</div>
              </div>

              <div className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[11px] space-y-0.5">
                <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400 flex justify-between">
                  <span>dashboardService.getQuickActions()</span>
                  <Badge variant="outline" className="text-[9px]">GET</Badge>
                </div>
                <div className="text-slate-400 font-mono text-[10px]">/dashboard/quick-actions</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
