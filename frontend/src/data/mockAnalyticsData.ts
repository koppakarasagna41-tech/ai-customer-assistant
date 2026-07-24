import {
  KPIMetric,
  TicketTrendPoint,
  CSATRatingDistribution,
  CSATTrendPoint,
  AIUsageMetrics,
  CategoryBreakdown,
  PriorityBreakdown,
  ChannelBreakdown,
} from '../types/analytics';

export const mockKPIMetrics: KPIMetric[] = [
  {
    id: 'kpi-total-tickets',
    title: 'Total Tickets Received',
    value: '1,428',
    change: 14.2,
    trend: 'up',
    isPositiveGood: true,
    periodLabel: 'vs. previous period',
    subtext: '88% resolved within SLA',
    iconName: 'Ticket',
  },
  {
    id: 'kpi-first-response',
    title: 'Avg. First Response Time',
    value: '18 mins',
    change: -22.4,
    trend: 'down',
    isPositiveGood: true, // faster response time is good
    periodLabel: 'vs. previous period',
    subtext: '4.2 mins faster than target',
    iconName: 'Clock',
  },
  {
    id: 'kpi-resolution-rate',
    title: 'First Contact Resolution',
    value: '74.6%',
    change: 5.8,
    trend: 'up',
    isPositiveGood: true,
    periodLabel: 'vs. previous period',
    subtext: '+3.1% benchmark shift',
    iconName: 'CheckCircle2',
  },
  {
    id: 'kpi-csat',
    title: 'Customer Satisfaction (CSAT)',
    value: '4.85 / 5.0',
    change: 3.2,
    trend: 'up',
    isPositiveGood: true,
    periodLabel: 'vs. previous period',
    subtext: 'Based on 412 customer reviews',
    iconName: 'Smile',
  },
  {
    id: 'kpi-ai-deflection',
    title: 'AI Support Deflection Rate',
    value: '62.4%',
    change: 18.5,
    trend: 'up',
    isPositiveGood: true,
    periodLabel: 'vs. previous period',
    subtext: '891 inquiries auto-resolved',
    iconName: 'Sparkles',
  },
  {
    id: 'kpi-cost-saved',
    title: 'Est. Cost Savings',
    value: '$14,250',
    change: 24.1,
    trend: 'up',
    isPositiveGood: true,
    periodLabel: 'vs. previous period',
    subtext: '~178 engineering hours saved',
    iconName: 'DollarSign',
  },
];

export const mock7DayTrends: TicketTrendPoint[] = [
  { date: 'Jul 18', created: 140, resolved: 132, escalated: 12, avgResponseHours: 0.4, avgResolutionHours: 3.2 },
  { date: 'Jul 19', created: 165, resolved: 158, escalated: 15, avgResponseHours: 0.3, avgResolutionHours: 2.8 },
  { date: 'Jul 20', created: 180, resolved: 175, escalated: 18, avgResponseHours: 0.3, avgResolutionHours: 2.5 },
  { date: 'Jul 21', created: 210, resolved: 198, escalated: 22, avgResponseHours: 0.2, avgResolutionHours: 2.2 },
  { date: 'Jul 22', created: 195, resolved: 188, escalated: 14, avgResponseHours: 0.3, avgResolutionHours: 2.4 },
  { date: 'Jul 23', created: 240, resolved: 228, escalated: 25, avgResponseHours: 0.2, avgResolutionHours: 2.1 },
  { date: 'Jul 24', created: 298, resolved: 285, escalated: 19, avgResponseHours: 0.2, avgResolutionHours: 1.9 },
];

export const mock30DayTrends: TicketTrendPoint[] = Array.from({ length: 30 }).map((_, i) => {
  const d = new Date(2026, 6, 1 + i);
  const dayName = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const created = Math.floor(120 + Math.random() * 150);
  const resolved = Math.floor(created * (0.88 + Math.random() * 0.1));
  const escalated = Math.floor(created * (0.05 + Math.random() * 0.08));
  return {
    date: dayName,
    created,
    resolved,
    escalated,
    avgResponseHours: Number((0.2 + Math.random() * 0.3).toFixed(1)),
    avgResolutionHours: Number((1.8 + Math.random() * 1.5).toFixed(1)),
  };
});

export const mockCSATRatings: CSATRatingDistribution[] = [
  { rating: 5, count: 320, percentage: 77.6 },
  { rating: 4, count: 62, percentage: 15.0 },
  { rating: 3, count: 18, percentage: 4.4 },
  { rating: 2, count: 8, percentage: 1.9 },
  { rating: 1, count: 4, percentage: 1.1 },
];

export const mockCSATTrends: CSATTrendPoint[] = [
  { date: 'Week 1', score: 4.68, responses: 84 },
  { date: 'Week 2', score: 4.72, responses: 96 },
  { date: 'Week 3', score: 4.81, responses: 110 },
  { date: 'Week 4', score: 4.85, responses: 122 },
];

export const mockAIUsage: AIUsageMetrics = {
  totalQueries: 3410,
  deflectionRate: 62.4,
  humanHandoffRate: 37.6,
  avgConfidenceScore: 94.8,
  estimatedHoursSaved: 178,
  estimatedCostSavedUSD: 14250,
  topAiTopics: [
    { topic: 'API Key Generation & OAuth Scopes', count: 640, successRate: 92.4 },
    { topic: 'Billing Invoices & Card Updates', count: 520, successRate: 88.6 },
    { topic: 'SAML 2.0 Okta SSO Setup', count: 410, successRate: 95.1 },
    { topic: 'Webhook Delivery Timeout Retry', count: 380, successRate: 84.2 },
    { topic: 'Rate Limits & HTTP 429 Errors', count: 320, successRate: 91.0 },
  ],
  dailyAiVolume: [
    { date: 'Mon', automated: 120, handedOff: 40 },
    { date: 'Tue', automated: 145, handedOff: 48 },
    { date: 'Wed', automated: 180, handedOff: 52 },
    { date: 'Thu', automated: 210, handedOff: 60 },
    { date: 'Fri', automated: 195, handedOff: 55 },
    { date: 'Sat', automated: 90, handedOff: 20 },
    { date: 'Sun', automated: 85, handedOff: 18 },
  ],
};

export const mockCategoryBreakdown: CategoryBreakdown[] = [
  { category: 'Technical & API', count: 482, slaMetPercentage: 94.2, color: '#6366f1' },
  { category: 'Billing & Subscriptions', count: 320, slaMetPercentage: 98.1, color: '#10b981' },
  { category: 'Security & SSO', count: 240, slaMetPercentage: 91.5, color: '#f59e0b' },
  { category: 'Feature Requests', count: 210, slaMetPercentage: 86.4, color: '#ec4899' },
  { category: 'Bug Reports', count: 176, slaMetPercentage: 89.0, color: '#ef4444' },
];

export const mockPriorityBreakdown: PriorityBreakdown[] = [
  { priority: 'Urgent', count: 88, percentage: 6.2, color: '#ef4444' },
  { priority: 'High', count: 284, percentage: 19.9, color: '#f97316' },
  { priority: 'Medium', count: 642, percentage: 44.9, color: '#3b82f6' },
  { priority: 'Low', count: 414, percentage: 29.0, color: '#10b981' },
];

export const mockChannelBreakdown: ChannelBreakdown[] = [
  { channel: 'AI Support Chat', count: 891, percentage: 62.4 },
  { channel: 'Web Portal Queue', count: 312, percentage: 21.8 },
  { channel: 'Email Dispatch', count: 145, percentage: 10.2 },
  { channel: 'REST API Webhook', count: 80, percentage: 5.6 },
];
