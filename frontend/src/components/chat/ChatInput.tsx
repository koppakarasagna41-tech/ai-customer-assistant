import React, { useRef, useState, KeyboardEvent, ChangeEvent, DragEvent } from 'react';
import { Send, Paperclip, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { ChatAttachment } from '../../types/chat';
import { FileUploadPreview } from './FileUploadPreview';
import { toast } from 'sonner';

interface ChatInputProps {
  onSendMessage: (message: string, attachments: ChatAttachment[]) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading = false,
  disabled = false,
}) => {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if ((!trimmed && attachments.length === 0) || isLoading || disabled) return;

    onSendMessage(trimmed, attachments);
    setText('');
    setAttachments([]);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Auto grow height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  };

  const processFiles = (files: FileList | File[]) => {
    const newAttachments: ChatAttachment[] = Array.from(files).map((file) => {
      const isImage = file.type.startsWith('image/');
      return {
        id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        previewUrl: isImage ? URL.createObjectURL(file) : undefined,
      };
    });

    setAttachments((prev) => [...prev, ...newAttachments]);
    toast.success(`Attached ${files.length} file(s)`);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors ${
        isDragging ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/20' : ''
      }`}
    >
      <div className="max-w-4xl mx-auto space-y-2">
        {/* Drag and Drop notice */}
        {isDragging && (
          <div className="p-2 text-center text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100/50 dark:bg-indigo-900/40 rounded-xl border border-dashed border-indigo-400">
            Drop files here to attach to support thread
          </div>
        )}

        {/* Attached Files Preview */}
        <FileUploadPreview attachments={attachments} onRemove={handleRemoveAttachment} />

        {/* Input Controls Bar */}
        <div className="relative flex items-end gap-2 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
          {/* File Attachment Trigger */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-200/80 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
            title="Attach documents or screenshots"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Multiline Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI support assistant... (Press Enter to send, Shift+Enter for new line)"
            disabled={disabled || isLoading}
            className="flex-1 bg-transparent text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none resize-none min-h-[38px] max-h-40 py-2 leading-relaxed"
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={(!text.trim() && attachments.length === 0) || isLoading || disabled}
            className="p-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 transition-all cursor-pointer disabled:cursor-not-allowed shrink-0 shadow-xs"
            title="Send Message"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Footer Shortcut Tips */}
        <div className="flex items-center justify-between px-2 text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>AI powered by Gemini Support Model</span>
          </span>
          <span className="hidden sm:inline">Press <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[9px] border">Enter ↵</kbd> to send</span>
        </div>
      </div>
    </div>
  );
};
