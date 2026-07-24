import React from 'react';
import {
  Rocket,
  CreditCard,
  Code2,
  ShieldCheck,
  Wrench,
  UserCheck,
  BookOpen,
  ChevronRight,
} from 'lucide-react';
import { ArticleCategory } from '../../types/knowledgeBase';
import { cn } from '../../lib/utils';

interface CategoryCardProps {
  category: ArticleCategory;
  articleCount: number;
  isSelected: boolean;
  onSelect: (cat: ArticleCategory) => void;
}

const categoryIcons: Record<string, React.FC<{ className?: string }>> = {
  'Getting Started': Rocket,
  'Billing & Subscription': CreditCard,
  'API & Integration': Code2,
  'Security & Compliance': ShieldCheck,
  Troubleshooting: Wrench,
  'Account Management': UserCheck,
};

const categoryDescriptions: Record<string, string> = {
  'Getting Started': 'Essential guides, quickstart walk-throughs, and onboarding basics.',
  'Billing & Subscription': 'Invoices, payment gateways, plan upgrades, and team seats.',
  'API & Integration': 'REST endpoints, OAuth authentication, webhooks, and SDKs.',
  'Security & Compliance': 'SOC2 compliance, role permissions, encryption, and audit logs.',
  Troubleshooting: 'Resolving common status codes, rate limits, and network errors.',
  'Account Management': 'Updating profile details, security MFA, and team workspaces.',
};

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  articleCount,
  isSelected,
  onSelect,
}) => {
  const IconComponent = categoryIcons[category] || BookOpen;
  const description = categoryDescriptions[category] || 'Explore helpful documentation articles.';

  return (
    <div
      onClick={() => onSelect(category)}
      className={cn(
        'group relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3',
        isSelected
          ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-500 shadow-sm ring-2 ring-indigo-500/20'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 hover:shadow-2xs'
      )}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div
            className={cn(
              'h-10 w-10 rounded-xl flex items-center justify-center font-bold transition-colors',
              isSelected
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white'
            )}
          >
            <IconComponent className="w-5 h-5" />
          </div>

          <span
            className={cn(
              'px-2 py-0.5 rounded-full text-[10px] font-extrabold',
              isSelected
                ? 'bg-indigo-200 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-100'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
            )}
          >
            {articleCount} {articleCount === 1 ? 'article' : 'articles'}
          </span>
        </div>

        <div>
          <h3
            className={cn(
              'text-xs font-extrabold transition-colors',
              isSelected
                ? 'text-indigo-950 dark:text-indigo-100'
                : 'text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
            )}
          >
            {category}
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <div className="flex items-center text-[11px] font-bold text-indigo-600 dark:text-indigo-400 pt-1 group-hover:translate-x-0.5 transition-transform">
        <span>Browse topic</span>
        <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
      </div>
    </div>
  );
};
