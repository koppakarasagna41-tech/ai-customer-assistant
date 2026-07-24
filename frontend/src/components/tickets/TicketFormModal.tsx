import React, { useState, useEffect } from 'react';
import { X, Ticket as TicketIcon, AlertCircle, Save, Plus } from 'lucide-react';
import {
  CreateTicketPayload,
  Ticket,
  TicketCategory,
  TicketPriority,
  TicketUser,
} from '../../types/ticket';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { toast } from 'sonner';

import { userService } from '../../services/api';

interface TicketFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateTicketPayload | Partial<Ticket>) => Promise<void>;
  initialTicket?: Ticket | null;
  users?: TicketUser[];
}

const defaultStaffUsers: TicketUser[] = [
  { id: 'usr-1', name: 'Sarah Jenkins', email: 'sarah@example.com', role: 'Support Lead' },
  { id: 'usr-2', name: 'Alex Morgan', email: 'alex@example.com', role: 'Senior Engineer' },
  { id: 'usr-3', name: 'Michael Chen', email: 'michael@example.com', role: 'DevOps Specialist' },
  { id: 'usr-4', name: 'Emma Watson', email: 'emma@example.com', role: 'Billing Specialist' },
];

export const TicketFormModal: React.FC<TicketFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTicket = null,
  users: propUsers,
}) => {
  const [staffUsers, setStaffUsers] = useState<TicketUser[]>(propUsers || defaultStaffUsers);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [category, setCategory] = useState<TicketCategory>('Technical');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [dueDate, setDueDate] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && !propUsers) {
      userService.getUsers()
        .then((res: any[]) => {
          if (Array.isArray(res) && res.length > 0) {
            const mapped = res.map((u) => ({
              id: u.id || u.user_id,
              name: u.name || u.email || 'Agent',
              email: u.email || '',
              role: u.role || 'Agent',
            }));
            setStaffUsers(mapped);
          }
        })
        .catch(() => {});
    }
  }, [isOpen, propUsers]);

  const isEditMode = !!initialTicket;

  useEffect(() => {
    if (initialTicket) {
      setTitle(initialTicket.title);
      setDescription(initialTicket.description);
      setPriority(initialTicket.priority);
      setCategory(initialTicket.category);
      setAssigneeId(initialTicket.assignee?.id || '');
      setDueDate(initialTicket.dueDate || '');
      setTagsInput(initialTicket.tags ? initialTicket.tags.join(', ') : '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('Technical');
      setAssigneeId('');
      setDueDate('');
      setTagsInput('');
    }
    setErrors({});
  }, [initialTicket, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Ticket title is required';
    if (!description.trim()) errs.description = 'Ticket description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    const tagsArr = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      setIsSubmitting(true);
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
        category,
        assigneeId: assigneeId || undefined,
        dueDate: dueDate || undefined,
        tags: tagsArr,
      });

      toast.success(isEditMode ? 'Ticket updated successfully' : 'Ticket created successfully');
      onClose();
    } catch {
      toast.error('Failed to save ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-50 duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
              <TicketIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                {isEditMode ? `Edit Ticket (${initialTicket.ticketNumber})` : 'Create New Ticket'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEditMode
                  ? 'Update ticket properties, assignee, or priority'
                  : 'Submit a new support ticket to the queue'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Ticket Title <span className="text-rose-500">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Cannot process credit card payment on checkout page"
              error={errors.title}
              className="text-xs"
            />
          </div>

          {/* Priority & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent / Critical</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TicketCategory)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
              >
                <option value="Technical">Technical Issue</option>
                <option value="Billing">Billing & Subscriptions</option>
                <option value="Bug">Software Bug</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Security">Security / Compliance</option>
                <option value="Account">Account Access</option>
              </select>
            </div>
          </div>

          {/* Assignee & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Assignee</label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
              >
                <option value="">-- Unassigned --</option>
                {staffUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role || 'Staff'})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Due Date</label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Tags (comma separated)
            </label>
            <Input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="api, checkout, high-impact, v2-release"
              className="text-xs"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide full reproduction steps, expected behavior, and error messages..."
              className="w-full p-3 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none leading-relaxed"
            />
            {errors.description && (
              <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.description}</span>
              </p>
            )}
          </div>

          {/* Footer controls */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <Button variant="outline" type="button" onClick={onClose} size="sm">
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={isSubmitting}
              leftIcon={isEditMode ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            >
              {isEditMode ? 'Save Changes' : 'Create Ticket'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
