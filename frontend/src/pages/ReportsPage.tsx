import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  FileText,
  Search,
  Download,
  Calendar,
  Sparkles,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';

import { ReportCategory, ReportItem, ReportFilterState } from '../types/report';
import { reportsService } from '../services/api';
import { ReportCard } from '../components/reports/ReportCard';
import { ReportPreviewModal } from '../components/reports/ReportPreviewModal';
import { Button } from '../components/ui/Button';

const categories: ReportCategory[] = [
  'All',
  'Executive',
  'Operations',
  'SLA & Performance',
  'CSAT & Feedback',
  'AI & Automation',
];

const defaultCatalog: ReportItem[] = [
  {
    id: 'executive-summary',
    title: 'Executive Support Summary',
    description: 'High-level operational overview including overall ticket volumes, SLA compliance, and cost savings.',
    category: 'Executive',
    frequency: 'Monthly',
    lastGenerated: new Date().toISOString().split('T')[0],
    downloadsCount: 42,
    iconName: 'BarChart2',
    supportedFormats: ['pdf', 'csv', 'xlsx'],
    featured: true,
  },
  {
    id: 'sla-compliance',
    title: 'SLA Performance & Breach Analysis',
    description: 'Detailed analysis of first-response times, resolution SLAs, and breach breakdown by department.',
    category: 'SLA & Performance',
    frequency: 'Weekly',
    lastGenerated: new Date().toISOString().split('T')[0],
    downloadsCount: 28,
    iconName: 'Clock',
    supportedFormats: ['pdf', 'csv'],
  },
  {
    id: 'csat-feedback',
    title: 'Customer Satisfaction (CSAT) Report',
    description: 'Customer rating scores, survey feedback comments, and trend analysis over time.',
    category: 'CSAT & Feedback',
    frequency: 'Weekly',
    lastGenerated: new Date().toISOString().split('T')[0],
    downloadsCount: 35,
    iconName: 'Smile',
    supportedFormats: ['pdf', 'csv', 'xlsx'],
  },
  {
    id: 'ai-deflection',
    title: 'AI Automation & Deflection Metrics',
    description: 'Comprehensive metrics on AI assistant query resolution rates, accuracy, and agent handoffs.',
    category: 'AI & Automation',
    frequency: 'Daily',
    lastGenerated: new Date().toISOString().split('T')[0],
    downloadsCount: 64,
    iconName: 'Bot',
    supportedFormats: ['pdf', 'csv'],
  },
];

export const ReportsPage: React.FC = () => {
  const [filterState, setFilterState] = useState<ReportFilterState>({
    category: 'All',
    searchQuery: '',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const [reports, setReports] = useState<ReportItem[]>(defaultCatalog);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReportForPreview, setSelectedReportForPreview] = useState<ReportItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const scheduled = await reportsService.getScheduledReports();
      if (scheduled && scheduled.length > 0) {
        setReports([...defaultCatalog, ...scheduled]);
      } else {
        setReports(defaultCatalog);
      }
    } catch (err) {
      console.error('Failed to load reports schedule from backend:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Filter report catalog based on category and search query
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesCategory =
        filterState.category === 'All' || report.category === filterState.category;
      const matchesSearch =
        report.title.toLowerCase().includes(filterState.searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(filterState.searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [reports, filterState]);

  const handlePreview = (report: ReportItem) => {
    setSelectedReportForPreview(report);
    setIsPreviewOpen(true);
  };

  const handleExport = async (report: ReportItem, format: 'pdf' | 'csv' | 'xlsx') => {
    toast.info(`Generating ${format.toUpperCase()} report for "${report.title}"...`);
    try {
      await reportsService.generateReport({
        reportId: report.id,
        format,
        startDate: filterState.startDate,
        endDate: filterState.endDate,
      });
      toast.success(`${format.toUpperCase()} report successfully compiled and downloaded`);
    } catch (err) {
      toast.error(`Failed to export report in ${format.toUpperCase()} format`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight">Enterprise Reports &amp; Exports</h1>
          </div>
          <p className="text-xs text-slate-300 max-w-xl">
            Generate, schedule, and export comprehensive performance reports in PDF, CSV, or Excel formats.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={fetchReports}
            leftIcon={<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-white font-bold"
          >
            Sync Schedules
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-xs border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={filterState.searchQuery}
              onChange={(e) => setFilterState((prev) => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="w-4 h-4" />
              <span>Range:</span>
            </div>
            <input
              type="date"
              value={filterState.startDate}
              onChange={(e) => setFilterState((prev) => ({ ...prev, startDate: e.target.value }))}
              className="text-xs px-2 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            />
            <span className="text-xs text-slate-400">to</span>
            <input
              type="date"
              value={filterState.endDate}
              onChange={(e) => setFilterState((prev) => ({ ...prev, endDate: e.target.value }))}
              className="text-xs px-2 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 border-t border-slate-100 dark:border-slate-800/60 pt-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterState((prev) => ({ ...prev, category: cat }))}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                filterState.category === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredReports.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            onPreview={handlePreview}
            onExport={handleExport}
          />
        ))}
      </div>

      {/* Preview Modal */}
      <ReportPreviewModal
        report={selectedReportForPreview}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onExport={handleExport}
      />
    </div>
  );
};
