import React, { useState } from 'react';
import { Check, Copy, Code2 } from 'lucide-react';
import { toast } from 'sonner';

interface CodeBlockProps {
  language?: string;
  value: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language = 'text', value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 font-mono text-xs shadow-md">
      {/* Code Block Header */}
      <div className="flex items-center justify-between bg-slate-900 px-4 py-2 border-b border-slate-800 text-slate-400">
        <div className="flex items-center gap-2">
          <Code2 className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold text-[11px] lowercase tracking-wider text-slate-300">
            {language || 'code'}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-[11px] font-medium"
          title="Copy code snippet"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="p-4 overflow-x-auto bg-slate-950 text-slate-100 font-mono text-xs leading-relaxed">
        <pre className="whitespace-pre">
          <code>{value}</code>
        </pre>
      </div>
    </div>
  );
};
