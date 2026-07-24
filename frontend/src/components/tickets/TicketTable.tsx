import React, { useState } from 'react';
import {
  Eye,
  Edit2,
  Trash2,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  User,
  Clock,
  MoreVertical,
  CheckSquare,
  Square,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { Ticket, TicketStatus } from '../../types/ticket';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { Button } from '../ui/Button';

interface TicketTableProps {
  tickets: Ticket[];
  viewMode: 'table' | 'cards';
  onViewTicket: (ticket: Ticket) => void;
  onEditTicket: (ticket: Ticket) => void;
  onDeleteTicket: (id: string) => void;
  onQuickStatusChange: (id: string, status: TicketStatus) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const TicketTable: React.FC<TicketTableProps> = ({
  tickets,
  viewMode,
  onViewTicket,
  onEditTicket,
  onDeleteTicket,
  onQuickStatusChange,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(tickets.map((t) => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  if (tickets.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3">
        <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
          No tickets found
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          No support tickets match your active filter criteria or search query.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Responsive Table View */}
      {viewMode === 'table' ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === tickets.length && tickets.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4 w-28">Ticket ID</th>
                  <th className="py-3 px-4">Subject / Title</th>
                  <th className="py-3 px-4 w-32">Status</th>
                  <th className="py-3 px-4 w-28">Priority</th>
                  <th className="py-3 px-4 w-32">Assignee</th>
                  <th className="py-3 px-4 w-28">Created</th>
                  <th className="py-3 px-4 w-28 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {tickets.map((t) => {
                  const isSelected = selectedIds.includes(t.id);
                  return (
                    <tr
                      key={t.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                        isSelected ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(t.id)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                      </td>

                      {/* Ticket ID */}
                      <td className="py-3 px-4 font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
                        {t.ticketNumber}
                      </td>

                      {/* Title & Category */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5 max-w-md">
                          <button
                            onClick={() => onViewTicket(t)}
                            className="font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 text-left line-clamp-1 cursor-pointer"
                          >
                            {t.title}
                          </button>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400">
                            <span className="font-semibold text-slate-500">{t.category}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              <span>{t.commentsCount}</span>
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <StatusBadge status={t.status} />
                      </td>

                      {/* Priority */}
                      <td className="py-3 px-4">
                        <PriorityBadge priority={t.priority} />
                      </td>

                      {/* Assignee */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[120px]">
                          <User className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span className="truncate">{t.assignee ? t.assignee.name : 'Unassigned'}</span>
                        </div>
                      </td>

                      {/* Created */}
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                        {t.createdAt}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onViewTicket(t)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                            title="View Ticket"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditTicket(t)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                            title="Edit Ticket"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete ticket ${t.ticketNumber}?`)) {
                                onDeleteTicket(t.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                            title="Delete Ticket"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Mobile Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {tickets.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-indigo-500/50 transition-all flex flex-col justify-between gap-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                    {t.ticketNumber}
                  </span>
                  <StatusBadge status={t.status} />
                </div>

                <h4
                  onClick={() => onViewTicket(t)}
                  className="text-xs font-extrabold text-slate-900 dark:text-slate-100 hover:text-indigo-600 cursor-pointer line-clamp-2"
                >
                  {t.title}
                </h4>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {t.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <PriorityBadge priority={t.priority} />
                  <span className="font-semibold text-slate-500">{t.category}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-indigo-500" />
                    <span className="truncate max-w-[100px]">
                      {t.assignee ? t.assignee.name : 'Unassigned'}
                    </span>
                  </span>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewTicket(t)}
                      className="text-[10px] h-7 px-2"
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditTicket(t)}
                      className="text-[10px] h-7 px-2"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 px-4 shadow-2xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            Page <strong className="text-slate-900 dark:text-slate-100">{currentPage}</strong> of{' '}
            <strong className="text-slate-900 dark:text-slate-100">{totalPages}</strong>
          </span>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
