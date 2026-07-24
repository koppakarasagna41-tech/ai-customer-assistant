export type TrendDirection = 'up' | 'down' | 'neutral';

export interface StatMetric {
  id: string;
  title: string;
  value: string | number;
  change: string;
  trend: TrendDirection;
  period: string;
  iconName: 'users' | 'activity' | 'shield' | 'server' | 'database' | 'dollar';
}

export interface ActivityItem {
  id: string;
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  action: string;
  target: string;
  status: 'completed' | 'pending' | 'failed' | 'in_progress';
  timestamp: string;
  category: 'security' | 'user' | 'system' | 'api';
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: 'user_plus' | 'user-plus' | 'key' | 'database' | 'server' | 'settings' | 'refresh' | 'shield' | 'report' | string;
  category: string;
  actionKey?: string;
  requiresConfirmation?: boolean;
}

export interface DashboardSummary {
  stats: StatMetric[];
  activities: ActivityItem[];
  quickActions: QuickAction[];
  systemHealth: {
    status: 'healthy' | 'degraded' | 'maintenance';
    uptime: string;
    lastPing: string;
    activeSessions: number;
  };
}
