import React from 'react';
import { CreditCard, HelpCircle, ShieldAlert, Terminal, Zap, ArrowRight } from 'lucide-react';
import { SuggestedPrompt } from '../../types/chat';

interface SuggestedPromptsProps {
  onSelectPrompt: (promptText: string) => void;
}

export const defaultSuggestedPrompts: SuggestedPrompt[] = [
  {
    id: 'prompt-1',
    category: 'Billing',
    title: 'Subscription & Invoicing',
    description: 'How do I upgrade my plan and download my monthly VAT invoice?',
    prompt: 'How can I upgrade my team subscription plan and access past monthly invoices for tax accounting?',
    iconName: 'card',
  },
  {
    id: 'prompt-2',
    category: 'API & Integration',
    title: 'Fix 401 Unauthorized Errors',
    description: 'Troubleshoot bearer token expiration and refresh token rotation in SDK.',
    prompt: 'I am getting a 401 Unauthorized response from the API endpoint. How do I configure automatic token refresh in axios?',
    iconName: 'terminal',
  },
  {
    id: 'prompt-3',
    category: 'Security',
    title: 'Rotate API Secret Keys',
    description: 'Best practices for invalidating active keys and re-issuing production secrets.',
    prompt: 'What is the recommended procedure for rotating compromised API keys without service downtime?',
    iconName: 'shield',
  },
  {
    id: 'prompt-4',
    category: 'Account',
    title: 'SSO & Role Permissions',
    description: 'How do I grant Admin or Developer access to team members?',
    prompt: 'How do I invite new engineers to my workspace and assign granular role-based permissions (RBAC)?',
    iconName: 'zap',
  },
];

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  card: CreditCard,
  terminal: Terminal,
  shield: ShieldAlert,
  zap: Zap,
};

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({ onSelectPrompt }) => {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4 my-auto">
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>AI Customer Support Hub</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          How can we help you today?
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Choose a common question below or type your inquiry directly into the chat input.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {defaultSuggestedPrompts.map((item) => {
          const IconComponent = iconMap[item.iconName || 'zap'] || HelpCircle;

          return (
            <button
              key={item.id}
              onClick={() => onSelectPrompt(item.prompt)}
              className="p-4 text-left rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-indigo-50/50 dark:hover:bg-slate-800/80 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all duration-200 group cursor-pointer shadow-2xs flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="h-9 w-9 rounded-xl bg-indigo-100/80 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {item.category}
                </span>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-snug">
                  {item.description}
                </p>
              </div>

              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                <span>Ask this question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
