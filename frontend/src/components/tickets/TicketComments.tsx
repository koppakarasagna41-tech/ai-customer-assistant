import React, { useState } from 'react';
import { MessageSquare, Lock, Send, User, CornerDownRight, Check } from 'lucide-react';
import { TicketComment, TicketUser } from '../../types/ticket';
import { Button } from '../ui/Button';
import { toast } from 'sonner';

interface TicketCommentsProps {
  comments: TicketComment[];
  currentUser?: TicketUser;
  onAddComment: (content: string, isInternal: boolean) => Promise<void>;
  isLoading?: boolean;
}

export const TicketComments: React.FC<TicketCommentsProps> = ({
  comments,
  currentUser,
  onAddComment,
  isLoading = false,
}) => {
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onAddComment(newComment.trim(), isInternal);
      setNewComment('');
      setIsInternal(false);
      toast.success(isInternal ? 'Internal note added' : 'Comment posted');
    } catch {
      toast.error('Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Discussion & Activity Log ({comments.length})
          </h3>
        </div>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
          <textarea
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={
              isInternal
                ? 'Type an internal note (visible to staff only)...'
                : 'Write a response to the customer...'
            }
            className={`w-full p-3 text-xs bg-transparent focus:outline-none leading-relaxed text-slate-900 dark:text-slate-100 placeholder-slate-400 resize-none ${
              isInternal ? 'bg-amber-50/30 dark:bg-amber-950/20' : ''
            }`}
          />

          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-semibold cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isInternal}
                onChange={(e) => setIsInternal(e.target.checked)}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span className={isInternal ? 'text-amber-700 dark:text-amber-400 font-bold' : ''}>
                Staff Internal Note
              </span>
            </label>

            <Button
              type="submit"
              size="sm"
              isLoading={isSubmitting}
              disabled={!newComment.trim() || isLoading}
              leftIcon={<Send className="w-3.5 h-3.5" />}
              className={isInternal ? 'bg-amber-600 hover:bg-amber-700 text-white' : ''}
            >
              {isInternal ? 'Post Internal Note' : 'Post Reply'}
            </Button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3 pt-2">
        {comments.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            No discussion comments yet. Be the first to leave a response.
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`p-4 rounded-xl border transition-all ${
                comment.isInternal
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-900/60'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[11px] font-extrabold flex items-center justify-center shrink-0">
                    {comment.author.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100">
                      <span>{comment.author.name}</span>
                      {comment.author.role && (
                        <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 font-medium">
                          {comment.author.role}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {comment.isInternal && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      <Lock className="w-3 h-3" />
                      Internal Note
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400">{comment.createdAt}</span>
                </div>
              </div>

              <div className="text-xs text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed pl-9">
                {comment.content}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
