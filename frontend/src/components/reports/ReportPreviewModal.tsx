import React, { useState } from 'react';
import {
  X,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  Calendar,
  CheckCircle2,
  Sparkles,
  BarChart2,
} from 'lucide-react';
import { ReportItem, ReportPreviewData } from '../../types/report';
import { getMockReportPreview } from '../../data/mockReportsData';
import { Button } from '../ui/Button';
import { toast } from 'sonner';

interface ReportPreviewModalProps {
  report: ReportItem | null;
  isOpen: boolean;
  onClose: () => void;
  onExport: (report: ReportItem, format: 'pdf' | 'csv' | 'xlsx') => void;
}

export const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({
  report,
  isOpen,
  onClose,
  onExport,
}) => {
  if (!isOpen || !report) return null;

  const previewData: ReportPreviewData = getMockReportPreview(report.id);
  const [selectedDateRange, setSelectedDateRange] = useState('7d');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in-50">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/80 shrink-0">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400">
              Interactive Report Document Preview
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              {previewData.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 print:p-0">
          {/* Metadata & Date Range Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span className="font-bold">Period:</span>
              <span>{previewData.dateRange}</span>
            </div>

            <div className="text-slate-400">
              Generated at: <span className="font-semibold">{previewData.generatedAt}</span>
            </div>
          </div>

          {/* Key Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {previewData.summaryMetrics.map((metric, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-950/80 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-1"
              >
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  {metric.label}
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-slate-100">
                  {metric.value}
                </div>
                {metric.subtext && (
                  <div className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                    {metric.subtext}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Data Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Report Data Breakdown
            </h3>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold uppercase tracking-wider">
                  <tr>
                    {previewData.columns.map((col, idx) => (
                      <th key={idx} className="p-3">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {previewData.rows.map((row, rowIdx) => (
                    <tr
                      key={rowIdx}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {row.map((cell, cellIdx) => (
                        <td
                          key={cellIdx}
                          className={`p-3 text-slate-800 dark:text-slate-200 ${
                            cellIdx === 0 ? 'font-bold' : ''
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/80 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
            className="text-xs"
          >
            Print
          </Button>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onExport(report, 'csv')}
              leftIcon={<FileSpreadsheet className="w-4 h-4 text-emerald-500" />}
              className="text-xs font-bold"
            >
              Export CSV
            </Button>

            <Button
              size="sm"
              onClick={() => onExport(report, 'pdf')}
              leftIcon={<Download className="w-4 h-4" />}
              className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              Export PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
