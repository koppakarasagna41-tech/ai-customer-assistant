import React from 'react';
import {
  FileText,
  PieChart,
  ShieldAlert,
  Sparkles,
  Smile,
  BarChart3,
  Users,
  Tag,
  Download,
  Eye,
  FileSpreadsheet,
  Clock,
  Calendar,
} from 'lucide-react';
import { ReportItem } from '../../types/report';
import { Button } from '../ui/Button';

interface ReportCardProps {
  report: ReportItem;
  onPreview: (report: ReportItem) => void;
  onExport: (report: ReportItem, format: 'pdf' | 'csv' | 'xlsx') => void;
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  PieChart,
  ShieldAlert,
  Sparkles,
  Smile,
  BarChart3,
  Users,
  Tag,
};

export const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onPreview,
  onExport,
}) => {
  const IconComponent = iconMap[report.iconName] || FileText;

  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-4 relative group">
      {report.featured && (
        <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[10px] font-extrabold uppercase tracking-wider">
          Featured
        </div>
      )}

      <div className="space-y-3">
        {/* Header Icon + Category */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <IconComponent className="w-5 h-5" />
          </div>

          <div className="space-y-0.5 min-w-0 pr-12">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {report.category}
            </span>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 truncate">
              {report.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {report.description}
        </p>
      </div>

      {/* Meta Info + Formats */}
      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            Generated: {report.lastGenerated}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
            {report.frequency}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPreview(report)}
            leftIcon={<Eye className="w-3.5 h-3.5" />}
            className="flex-1 text-xs font-bold"
          >
            Preview
          </Button>

          <Button
            size="sm"
            onClick={() => onExport(report, 'pdf')}
            leftIcon={<Download className="w-3.5 h-3.5" />}
            className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            PDF
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => onExport(report, 'csv')}
            leftIcon={<FileSpreadsheet className="w-3.5 h-3.5" />}
            className="text-xs font-bold"
          >
            CSV
          </Button>
        </div>
      </div>
    </div>
  );
};
