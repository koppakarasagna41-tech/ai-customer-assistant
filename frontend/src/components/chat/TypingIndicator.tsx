import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

interface TypingIndicatorProps {
  modelName?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ modelName = 'AI Customer Assistant' }) => {
  return (
    <div className="flex items-start gap-3 my-3 max-w-2xl animate-in fade-in-50 duration-200">
      {/* Bot Avatar */}
      <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-400 text-white flex items-center justify-center shrink-0 shadow-xs border border-indigo-300 dark:border-indigo-700">
        <Bot className="w-4 h-4" />
      </div>

      <div className="p-3.5 rounded-2xl rounded-tl-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">{modelName}</span>
          <span>is typing</span>
          <Sparkles className="w-3 h-3 text-amber-500 animate-spin" />
        </div>

        {/* Pulsing Dots */}
        <div className="flex items-center gap-1.5 py-1 px-0.5">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
        </div>
      </div>
    </div>
  );
};
