import React from 'react';
import { FileText, Image as ImageIcon, FileCode, X, Paperclip } from 'lucide-react';
import { ChatAttachment } from '../../types/chat';

interface FileUploadPreviewProps {
  attachments: ChatAttachment[];
  onRemove: (id: string) => void;
}

export const FileUploadPreview: React.FC<FileUploadPreviewProps> = ({ attachments, onRemove }) => {
  if (attachments.length === 0) return null;

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-4 h-4 text-emerald-500" />;
    if (type.includes('json') || type.includes('javascript') || type.includes('typescript') || type.includes('code')) {
      return <FileCode className="w-4 h-4 text-indigo-500" />;
    }
    return <FileText className="w-4 h-4 text-cyan-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 rounded-t-xl animate-in slide-in-from-bottom-2 duration-150">
      <div className="flex items-center gap-1.5 px-2 text-[11px] font-bold text-slate-400">
        <Paperclip className="w-3.5 h-3.5" />
        <span>Attached ({attachments.length}):</span>
      </div>

      {attachments.map((file) => (
        <div
          key={file.id}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs text-xs font-medium text-slate-700 dark:text-slate-200"
        >
          {file.previewUrl ? (
            <img src={file.previewUrl} alt={file.name} className="w-5 h-5 rounded object-cover" />
          ) : (
            getFileIcon(file.type)
          )}

          <div className="flex flex-col">
            <span className="max-w-[120px] truncate font-semibold text-[11px]">{file.name}</span>
            <span className="text-[9px] text-slate-400">{formatFileSize(file.size)}</span>
          </div>

          <button
            type="button"
            onClick={() => onRemove(file.id)}
            className="p-1 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
            title="Remove attachment"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
