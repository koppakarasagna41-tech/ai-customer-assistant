import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  User,
  Bot,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RotateCw,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  FileCode,
} from 'lucide-react';
import { ChatMessage, ChatAttachment } from '../../types/chat';
import { CodeBlock } from './CodeBlock';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

interface ChatMessageItemProps {
  message: ChatMessage;
  onRetry?: (message: ChatMessage) => void;
  onFeedback?: (messageId: string, feedback: 'like' | 'dislike') => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  onRetry,
  onFeedback,
}) => {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'like' | 'dislike' | undefined>(message.feedback);

  const isUser = message.sender === 'user';
  const isSystem = message.sender === 'system';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success('Message copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedbackClick = (type: 'like' | 'dislike') => {
    const nextValue = feedback === type ? undefined : type;
    setFeedback(nextValue);
    if (onFeedback && nextValue) {
      onFeedback(message.id, nextValue);
      toast.success(type === 'like' ? 'Thanks for your feedback!' : 'Feedback recorded');
    }
  };

  const renderAttachmentIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-4 h-4 text-emerald-500" />;
    if (type.includes('json') || type.includes('code')) return <FileCode className="w-4 h-4 text-indigo-500" />;
    return <FileText className="w-4 h-4 text-cyan-500" />;
  };

  if (isSystem) {
    return (
      <div className="flex items-center justify-center my-4">
        <div className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-500 text-[11px] font-medium border border-slate-200 dark:border-slate-700">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-start gap-3 my-4 group animate-in fade-in-50 duration-200',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-xs border',
          isUser
            ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-700 dark:border-slate-300'
            : 'bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-400 text-white border-indigo-300 dark:border-indigo-700'
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message Bubble Container */}
      <div className={cn('flex flex-col space-y-1.5 max-w-[85%] sm:max-w-2xl', isUser && 'items-end')}>
        {/* Header Sender name & timestamp */}
        <div className="flex items-center gap-2 px-1 text-[11px] text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {isUser ? 'You' : 'AI Assistant'}
          </span>
          <span>•</span>
          <span>{message.timestamp}</span>
        </div>

        {/* Bubble Content */}
        <div
          className={cn(
            'p-4 rounded-2xl shadow-2xs text-xs leading-relaxed transition-all duration-150',
            isUser
              ? 'bg-indigo-600 text-white rounded-tr-xs dark:bg-indigo-600'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs'
          )}
        >
          {/* Attachments rendering */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3 pb-2 border-b border-indigo-500/30 dark:border-slate-800">
              {message.attachments.map((att: ChatAttachment) => (
                <div
                  key={att.id}
                  className={cn(
                    'flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium border',
                    isUser
                      ? 'bg-indigo-700/60 border-indigo-500/50 text-white'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                  )}
                >
                  {renderAttachmentIcon(att.type)}
                  <span className="truncate max-w-[150px] font-semibold">{att.name}</span>
                </div>
              ))}
            </div>
          )}

          {/* Markdown content */}
          {isUser ? (
            <div className="whitespace-pre-wrap break-words">{message.content}</div>
          ) : (
            <div className="markdown-content text-slate-800 dark:text-slate-100 space-y-2">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const isInline = !match && !String(children).includes('\n');

                    if (isInline) {
                      return (
                        <code
                          className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-[11px]"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    }

                    return (
                      <CodeBlock
                        language={match ? match[1] : 'text'}
                        value={String(children).replace(/\n$/, '')}
                      />
                    );
                  },
                  p({ children }) {
                    return <p className="leading-relaxed mb-2 last:mb-0">{children}</p>;
                  },
                  ul({ children }) {
                    return <ul className="list-disc pl-5 my-2 space-y-1">{children}</ul>;
                  },
                  ol({ children }) {
                    return <ol className="list-decimal pl-5 my-2 space-y-1">{children}</ol>;
                  },
                  li({ children }) {
                    return <li className="mb-0.5">{children}</li>;
                  },
                  a({ href, children }) {
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                      >
                        {children}
                      </a>
                    );
                  },
                  blockquote({ children }) {
                    return (
                      <blockquote className="border-l-2 border-indigo-500 pl-3 py-1 my-2 italic text-slate-600 dark:text-slate-400">
                        {children}
                      </blockquote>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}

          {/* Error Message retry */}
          {message.status === 'error' && (
            <div className="mt-3 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{message.errorDetails || 'Failed to dispatch message.'}</span>
              </div>
              {onRetry && (
                <button
                  onClick={() => onRetry(message)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-colors cursor-pointer text-[11px]"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>Retry</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions Bar (Copy & Feedback) */}
        {!isUser && message.status !== 'error' && (
          <div className="flex items-center gap-2 px-1 text-slate-400 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="p-1 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer rounded"
              title="Copy message"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => handleFeedbackClick('like')}
              className={cn(
                'p-1 hover:text-emerald-600 transition-colors cursor-pointer rounded',
                feedback === 'like' && 'text-emerald-600 font-bold'
              )}
              title="Helpful response"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => handleFeedbackClick('dislike')}
              className={cn(
                'p-1 hover:text-rose-600 transition-colors cursor-pointer rounded',
                feedback === 'dislike' && 'text-rose-600 font-bold'
              )}
              title="Not helpful"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
