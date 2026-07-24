import React, { useState } from 'react';
import {
  X,
  Ticket as TicketIcon,
  User,
  Calendar,
  Tag,
  Clock,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import {
  Ticket,
  TicketComment,
  TicketPriority,
  TicketStatus,
  TicketUser,
} from '../../types/ticket';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { TicketComments } from './TicketComments';
import { Button } from '../ui/Button';
import { toast } from 'sonner';

interface TicketDetailModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onEditTicket: (ticket: Ticket) => void;
  onDeleteTicket: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: TicketStatus) => Promise<void>;
  onUpdatePriority: (id: string, newPriority: TicketPriority) => Promise<void>;
  comments: TicketComment[];
  onAddComment: (content: string, isInternal: boolean) => Promise<void>;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticket,
  isOpen,
  onClose,
  onEditTicket,
  onDeleteTicket,
  onUpdateStatus,
  onUpdatePriority,
  comments,
  onAddComment,
}) => {
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  if (!isOpen || !ticket) return null;

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as TicketStatus;
    try {
      setIsChangingStatus(true);
      await onUpdateStatus(ticket.id, newStatus);
      toast.success(`Ticket status updated to ${newStatus.replace('_', ' ')}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setIsChangingStatus(false);
    }
  };

  const handlePriorityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPriority = e.target.value as TicketPriority;
    try {
      await onUpdatePriority(ticket.id, newPriority);
      toast.success(`Priority set to ${newPriority}`);
    } catch {
      toast.error('Failed to update priority');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-50 duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Sticky Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50 sticky top-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-mono font-extrabold shrink-0">
              {ticket.ticketNumber}
            </span>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100 truncate">
              {ticket.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditTicket(ticket)}
              leftIcon={<Edit2 className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete ${ticket.ticketNumber}?`)) {
                  onDeleteTicket(ticket.id);
                  onClose();
                }
              }}
              leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
              className="text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            >
              Delete
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick Properties Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
            {/* Status Control */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Status
              </span>
              <select
                value={ticket.status}
                onChange={handleStatusChange}
                disabled={isChangingStatus}
                className="w-full px-2 py-1 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Priority Control */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Priority
              </span>
              <select
                value={ticket.priority}
                onChange={handlePriorityChange}
                className="w-full px-2 py-1 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Category */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Category
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block py-1">
                {ticket.category}
              </span>
            </div>

            {/* Assignee */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Assignee
              </span>
              <div className="flex items-center gap-1.5 py-1">
                <User className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {ticket.assignee ? ticket.assignee.name : 'Unassigned'}
                </span>
              </div>
            </div>
          </div>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Reporter:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{ticket.reporter.name}</span>
            </div>

            <span>•</span>

            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Created {ticket.createdAt}</span>
            </div>

            {ticket.dueDate && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Due {ticket.dueDate}</span>
                </div>
              </>
            )}
          </div>

          {/* Description Block */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Issue Description
            </h3>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
              {ticket.description}
            </div>
          </div>

          {/* Tags list */}
          {ticket.tags && ticket.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <div className="flex flex-wrap gap-1.5">
                {ticket.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Comments and Activity Section */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <TicketComments
              comments={comments}
              onAddComment={onAddComment}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
