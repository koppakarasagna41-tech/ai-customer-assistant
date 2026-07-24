import React, { useState } from 'react';
import { Copy, Check, Info, AlertTriangle, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';

interface RichTextViewerProps {
  content: string;
}

export const RichTextViewer: React.FC<RichTextViewerProps> = ({ content }) => {
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);

  // Helper to handle copying code snippets
  const handleCopyCode = (codeText: string, blockId: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedBlock(blockId);
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopiedBlock(null), 2000);
  };

  return (
    <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed space-y-4 font-sans">
      {/* Simple HTML / Markdown parser emulation for rich rendering */}
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        className="space-y-4 [&_h1]:text-lg [&_h1]:sm:text-xl [&_h1]:font-extrabold [&_h1]:text-slate-900 [&_h1]:dark:text-slate-100 [&_h1]:mt-6 [&_h1]:mb-3 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:dark:text-slate-100 [&_h2]:mt-5 [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-slate-800 [&_h3]:dark:text-slate-200 [&_h3]:mt-4 [&_p]:text-slate-700 [&_p]:dark:text-slate-300 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_li]:text-slate-700 [&_li]:dark:text-slate-300 [&_pre]:bg-slate-900 [&_pre]:text-slate-100 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:font-mono [&_pre]:text-xs [&_code]:font-mono [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:bg-slate-100 [&_code]:dark:bg-slate-800 [&_code]:text-indigo-600 [&_code]:dark:text-indigo-400 [&_code]:font-semibold [&_blockquote]:border-l-4 [&_blockquote]:border-indigo-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_blockquote]:dark:text-slate-400"
      />
    </div>
  );
};
