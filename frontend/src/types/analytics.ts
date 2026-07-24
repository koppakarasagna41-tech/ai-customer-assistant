export type DateRangePreset = '7d' | '30d' | '90d' | '12m' | 'custom';

export interface DateFilterState {
  preset: DateRangePreset;
  startDate: string;
  endDate: string;
  category: string;
  channel: string;
}

export interface KPIMetric {
  id: string;
  title: string;
  value: string | number;
  change: number; // e.g. +12.5 or -3.2
  trend: 'up' | 'down' | 'neutral';
  isPositiveGood: boolean; // if true, + change is green; if false (e.g. response time), - change is green
  periodLabel: string;
  subtext: string;
  iconName: string;
}

export interface TicketTrendPoint {
  date: string;
  created: number;
  resolved: number;
  escalated: number;
  avgResponseHours: number;
  avgResolutionHours: number;
}

export interface CSATRatingDistribution {
  rating: number; // 1 to 5
  count: number;
  percentage: number;
}

export interface CSATTrendPoint {
  date: string;
  score: number; // 0 - 100 or 1 - 5 scale
  responses: number;
}

export interface AIUsageMetrics {
  totalQueries: number;
  deflectionRate: number; // percentage
  humanHandoffRate: number; // percentage
  avgConfidenceScore: number; // e.g. 94.2%
  estimatedHoursSaved: number;
  estimatedCostSavedUSD: number;
  topAiTopics: { topic: string; count: number; successRate: number }[];
  dailyAiVolume: { date: string; automated: number; handedOff: number }[];
}

export interface CategoryBreakdown {
  category: string;
  count: number;
  slaMetPercentage: number;
  color: string;
}

export interface PriorityBreakdown {
  priority: string;
  count: number;
  percentage: number;
  color: string;
}

export interface ChannelBreakdown {
  channel: string;
  count: number;
  percentage: number;
}
