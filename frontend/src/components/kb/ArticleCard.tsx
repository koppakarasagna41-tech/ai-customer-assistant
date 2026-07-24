import React from 'react';
import { Clock, Eye, Sparkles, Tag, ThumbsUp, ArrowRight } from 'lucide-react';
import { KBArticle } from '../../types/knowledgeBase';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

interface ArticleCardProps {
  article: KBArticle;
  onSelectArticle: (article: KBArticle) => void;
  featuredOnly?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelectArticle,
  featuredOnly = false,
}) => {
  return (
    <div
      onClick={() => onSelectArticle(article)}
      className={cn(
        'group p-4 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3',
        article.featured ? 'ring-1 ring-amber-500/30' : ''
      )}
    >
      <div className="space-y-2">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant={article.featured ? 'default' : 'secondary'}
            className="text-[10px] uppercase font-bold tracking-wider"
          >
            {article.category}
          </Badge>

          {article.featured && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Featured
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
          {article.title}
        </h3>

        {/* Summary */}
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {article.summary}
        </p>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Meta Details */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.readTime}</span>
          </span>

          <span className="flex items-center gap-1 font-medium">
            <Eye className="w-3.5 h-3.5" />
            <span>{article.views}</span>
          </span>

          <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{article.helpfulCount}</span>
          </span>
        </div>

        <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold group-hover:translate-x-1 transition-transform">
          <span>Read</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
