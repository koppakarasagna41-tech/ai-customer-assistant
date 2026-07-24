export type ReportCategory =
  | 'All'
  | 'Executive'
  | 'Operations'
  | 'SLA & Performance'
  | 'CSAT & Feedback'
  | 'AI & Automation';

export type ReportFrequency = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'On-Demand';

export interface ReportItem {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  frequency: ReportFrequency;
  lastGenerated: string;
  downloadsCount: number;
  iconName: string;
  supportedFormats: ('pdf' | 'csv' | 'xlsx')[];
  featured?: boolean;
}

export interface ReportFilterState {
  category: ReportCategory;
  searchQuery: string;
  startDate: string;
  endDate: string;
}

export interface ReportPreviewData {
  reportId: string;
  title: string;
  generatedAt: string;
  dateRange: string;
  summaryMetrics: { label: string; value: string; subtext?: string }[];
  columns: string[];
  rows: (string | number)[][];
}
