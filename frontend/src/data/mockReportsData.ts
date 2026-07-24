import { ReportItem, ReportPreviewData } from '../types/report';

export const mockReportCatalog: ReportItem[] = [
  {
    id: 'rep-exec-summary',
    title: 'Executive Support KPI Summary',
    description: 'High-level overview of total ticket volumes, CSAT, first contact resolution rates, and AI cost savings.',
    category: 'Executive',
    frequency: 'Monthly',
    lastGenerated: 'Jul 24, 2026',
    downloadsCount: 142,
    iconName: 'PieChart',
    supportedFormats: ['pdf', 'csv', 'xlsx'],
    featured: true,
  },
  {
    id: 'rep-sla-compliance',
    title: 'SLA Compliance & Escalations',
    description: 'Detailed analysis of first response and resolution time breaches across urgency levels and support tiers.',
    category: 'SLA & Performance',
    frequency: 'Weekly',
    lastGenerated: 'Jul 22, 2026',
    downloadsCount: 98,
    iconName: 'ShieldAlert',
    supportedFormats: ['pdf', 'csv'],
    featured: true,
  },
  {
    id: 'rep-ai-deflection',
    title: 'AI Bot Deflection & ROI Analytics',
    description: 'Metrics on self-service query resolutions, top deflecting topics, human agent hand-offs, and estimated hours saved.',
    category: 'AI & Automation',
    frequency: 'Weekly',
    lastGenerated: 'Jul 23, 2026',
    downloadsCount: 215,
    iconName: 'Sparkles',
    supportedFormats: ['pdf', 'csv', 'xlsx'],
    featured: true,
  },
  {
    id: 'rep-csat-ratings',
    title: 'Customer Satisfaction & Review Audit',
    description: 'Granular CSAT breakdown by rating tiers (1-5 stars), verbatim customer comments, and sentiment classification.',
    category: 'CSAT & Feedback',
    frequency: 'Monthly',
    lastGenerated: 'Jul 20, 2026',
    downloadsCount: 84,
    iconName: 'Smile',
    supportedFormats: ['pdf', 'csv'],
  },
  {
    id: 'rep-ticket-volume-channel',
    title: 'Inflow Channel & Volume Distribution',
    description: 'Comparative tracking of inquiries originating from AI Chat, Web Portal, Email Dispatch, and REST API Webhooks.',
    category: 'Operations',
    frequency: 'Daily',
    lastGenerated: 'Jul 24, 2026',
    downloadsCount: 310,
    iconName: 'BarChart3',
    supportedFormats: ['pdf', 'csv', 'xlsx'],
  },
  {
    id: 'rep-agent-workload',
    title: 'Agent Productivity & Capacity Audit',
    description: 'Individual and team resolution throughput, active ticket loads, average handle times, and re-assignment rates.',
    category: 'SLA & Performance',
    frequency: 'Weekly',
    lastGenerated: 'Jul 21, 2026',
    downloadsCount: 76,
    iconName: 'Users',
    supportedFormats: ['pdf', 'csv'],
  },
  {
    id: 'rep-category-tagging',
    title: 'Top Issue Categories & Bug Frequency',
    description: 'Trend lines for top technical issues, billing discrepancies, SSO onboarding blockers, and bug escalations.',
    category: 'Operations',
    frequency: 'Monthly',
    lastGenerated: 'Jul 19, 2026',
    downloadsCount: 112,
    iconName: 'Tag',
    supportedFormats: ['pdf', 'csv', 'xlsx'],
  },
];

export const getMockReportPreview = (reportId: string): ReportPreviewData => {
  switch (reportId) {
    case 'rep-sla-compliance':
      return {
        reportId,
        title: 'SLA Compliance & Escalations Report',
        generatedAt: '2026-07-24 09:30 AM',
        dateRange: 'Jul 18, 2026 - Jul 24, 2026',
        summaryMetrics: [
          { label: 'Overall SLA Met', value: '94.2%', subtext: 'Target >= 90.0%' },
          { label: 'Avg First Response', value: '18 mins', subtext: '-4.2m vs last week' },
          { label: 'Total Escalations', value: '119 tickets', subtext: '8.3% escalation rate' },
        ],
        columns: ['Category', 'Total Tickets', 'SLA Met %', 'Avg Response Time', 'Escalations'],
        rows: [
          ['Technical & API', 482, '94.2%', '14 mins', 24],
          ['Billing & Subscriptions', 320, '98.1%', '8 mins', 6],
          ['Security & SSO', 240, '91.5%', '22 mins', 38],
          ['Feature Requests', 210, '86.4%', '45 mins', 18],
          ['Bug Reports', 176, '89.0%', '32 mins', 33],
        ],
      };

    case 'rep-ai-deflection':
      return {
        reportId,
        title: 'AI Bot Deflection & ROI Analytics Report',
        generatedAt: '2026-07-24 10:15 AM',
        dateRange: 'Jul 01, 2026 - Jul 24, 2026',
        summaryMetrics: [
          { label: 'Deflection Rate', value: '62.4%', subtext: '891 auto-resolved' },
          { label: 'Est. Cost Savings', value: '$14,250', subtext: 'Based on $80/hr tier' },
          { label: 'Hours Saved', value: '178 hrs', subtext: 'Engineering time saved' },
        ],
        columns: ['Topic Category', 'Total Inquiries', 'Auto-Deflected', 'Human Handoff', 'Success Rate'],
        rows: [
          ['API Key & OAuth Tokens', 640, 591, 49, '92.4%'],
          ['Billing Invoices & Card Updates', 520, 461, 59, '88.6%'],
          ['SAML 2.0 Okta SSO Config', 410, 390, 20, '95.1%'],
          ['Webhook Delivery Retry', 380, 320, 60, '84.2%'],
          ['Rate Limits & HTTP 429 Errors', 320, 291, 29, '91.0%'],
        ],
      };

    default:
      return {
        reportId,
        title: 'Executive Support KPI Summary Report',
        generatedAt: '2026-07-24 08:00 AM',
        dateRange: 'Jul 01, 2026 - Jul 24, 2026',
        summaryMetrics: [
          { label: 'Total Inflow', value: '1,428', subtext: '+14.2% MoM' },
          { label: 'CSAT Score', value: '4.85 / 5.0', subtext: '92.6% positive' },
          { label: 'First Contact Resolution', value: '74.6%', subtext: '+5.8% shift' },
        ],
        columns: ['Support Metric', 'Current Value', 'Previous Period', 'YoY Growth', 'Status'],
        rows: [
          ['Total Tickets Handled', '1,428', '1,250', '+14.2%', 'On Target'],
          ['First Response Time', '18 mins', '23 mins', '-21.7%', 'Exceeding'],
          ['First Contact Resolution', '74.6%', '68.8%', '+5.8%', 'On Target'],
          ['Customer Satisfaction (CSAT)', '4.85 / 5.0', '4.70 / 5.0', '+3.2%', 'Exceeding'],
          ['AI Support Deflection Rate', '62.4%', '43.9%', '+18.5%', 'Exceeding'],
        ],
      };
  }
};
