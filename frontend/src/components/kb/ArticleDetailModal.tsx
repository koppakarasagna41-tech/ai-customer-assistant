import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Clock,
  Eye,
  ThumbsUp,
  ThumbsDown,
  User,
  Share2,
  Calendar,
  Sparkles,
  Check,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { KBArticle } from '../../types/knowledgeBase';
import { RichTextViewer } from './RichTextViewer';
import { Button } from '../ui/Button';
import { toast } from 'sonner';

interface ArticleDetailModalProps {
  article: KBArticle | null;
  isOpen: boolean;
  onClose: () => void;
  onRateArticle: (id: string, isHelpful: boolean) => Promise<void>;
  relatedArticles?: KBArticle[];
  onSelectArticle: (article: KBArticle) => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  isOpen,
  onClose,
  onRateArticle,
  relatedArticles = [],
  onSelectArticle,
}) => {
  const [userRating, setUserRating] = useState<'helpful' | 'unhelpful' | null>(null);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  if (!isOpen || !article) return null;

  const handleRating = async (isHelpful: boolean) => {
    if (userRating !== null || isSubmittingRating) return;
    try {
      setIsSubmittingRating(true);
      await onRateArticle(article.id, isHelpful);
      setUserRating(isHelpful ? 'helpful' : 'unhelpful');
      toast.success(
        isHelpful
          ? 'Thank you! Marked article as helpful.'
          : 'Feedback received. We will update this guide.'
      );
    } catch {
      toast.error('Failed to submit feedback');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Article link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-50 duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50 sticky top-0 z-10">
          <div className="flex items-center gap-2 min-w-0">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-bold uppercase shrink-0">
              {article.category}
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
              {article.readTime}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              leftIcon={<Share2 className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Share Link
            </Button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-4 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* Article Title & Metadata Header */}
          <div className="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-5">
            <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
              {article.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              {article.summary}
            </p>

            {/* Author and Date metadata */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                  {article.author.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">
                    {article.author.name}
                  </div>
                  <div className="text-[11px] text-slate-400">{article.author.role}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[11px] font-medium">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Updated {article.updatedAt}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>{article.views} views</span>
                </span>
              </div>
            </div>
          </div>

          {/* Article Body Content */}
          <RichTextViewer content={article.content} />

          {/* Article Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <div className="flex flex-wrap gap-1.5">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Helpfulness Rating Box */}
          <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 text-center sm:text-left">
              <h4 className="text-xs font-extrabold text-indigo-950 dark:text-indigo-200">
                Was this article helpful?
              </h4>
              <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80">
                {article.helpfulCount} people found this documentation guide useful.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={userRating === 'helpful' ? 'primary' : 'outline'}
                disabled={userRating !== null || isSubmittingRating}
                onClick={() => handleRating(true)}
                leftIcon={<ThumbsUp className="w-3.5 h-3.5" />}
                className="text-xs"
              >
                {userRating === 'helpful' ? 'Marked Helpful' : 'Yes'}
              </Button>

              <Button
                size="sm"
                variant={userRating === 'unhelpful' ? 'primary' : 'outline'}
                disabled={userRating !== null || isSubmittingRating}
                onClick={() => handleRating(false)}
                leftIcon={<ThumbsDown className="w-3.5 h-3.5" />}
                className="text-xs"
              >
                {userRating === 'unhelpful' ? 'Feedback Sent' : 'No'}
              </Button>
            </div>
          </div>

          {/* Related Articles Section */}
          {relatedArticles.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Related Help Articles
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedArticles.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectArticle(rel)}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 bg-white dark:bg-slate-900 transition-all cursor-pointer flex items-center justify-between gap-2"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                        {rel.title}
                      </h4>
                      <p className="text-[10px] text-slate-400">{rel.readTime}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-indigo-500 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
