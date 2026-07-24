import React, { useState } from 'react';
import {
  Menu,
  Bot,
  Trash2,
  Download,
  Sparkles,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import { Conversation } from '../../types/chat';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { toast } from 'sonner';

interface ChatHeaderProps {
  conversation?: Conversation;
  onToggleSidebar: () => void;
  onClearHistory: () => void;
  onExportChat: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  onToggleSidebar,
  onClearHistory,
  onExportChat,
}) => {
  const [selectedModel, setSelectedModel] = useState('Gemini 2.5 Support Engine');
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const models = [
    'Gemini 2.5 Support Engine',
    'Enterprise Flash Assistant',
    'Deep Reasoning Support Agent',
  ];

  return (
    <div className="h-16 px-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between gap-3 shrink-0 z-10 sticky top-0">
      {/* Left: Mobile Toggle & Conversation Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden cursor-pointer"
          title="Open Conversation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Bot className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 truncate max-w-[180px] sm:max-w-xs">
                {conversation?.title || 'AI Customer Support'}
              </h1>
              {conversation && (
                <Badge variant="secondary" className="text-[10px] hidden sm:inline-flex">
                  {conversation.category}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Online</span>
              <span>•</span>
              <span className="hidden sm:inline">24/7 Customer Assistance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Model Selector & Quick Actions */}
      <div className="flex items-center gap-2">
        {/* Model Selector Dropdown */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setShowModelDropdown(!showModelDropdown)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{selectedModel}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showModelDropdown && (
            <div className="absolute right-0 mt-2 w-64 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 animate-in fade-in-50 duration-150">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Select Support AI Engine
              </div>
              {models.map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setSelectedModel(m);
                    setShowModelDropdown(false);
                    toast.info(`Switched model to ${m}`);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                    selectedModel === m
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{m}</span>
                  {selectedModel === m && <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <Button
          variant="outline"
          size="sm"
          onClick={onExportChat}
          leftIcon={<Download className="w-3.5 h-3.5" />}
          className="text-xs hidden sm:inline-flex"
        >
          Export Log
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClearHistory}
          leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
          className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
        >
          Clear
        </Button>
      </div>
    </div>
  );
};
