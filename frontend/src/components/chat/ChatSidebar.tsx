import React, { useState } from 'react';
import {
  Plus,
  Search,
  MessageSquare,
  Trash2,
  X,
  Pin,
  Bot,
  Sparkles,
} from 'lucide-react';
import { Conversation } from '../../types/chat';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  activeId,
  isOpen,
  onClose,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.preview.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || c.category.toLowerCase() === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out flex flex-col justify-between shrink-0',
          !isOpen && '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Top Header & Search */}
        <div className="p-4 space-y-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                Support History
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 lg:hidden rounded-md cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Chat Button */}
          <Button
            onClick={() => {
              onNewConversation();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat Thread</span>
          </Button>

          {/* Search Input */}
          <Input
            placeholder="Search threads..."
            leftIcon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs"
          />

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] font-semibold">
            {['all', 'general', 'billing', 'technical'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-0.5 rounded-lg capitalize transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {filteredConversations.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl my-4">
              No chat threads found. Click "New Chat Thread" to start.
            </div>
          ) : (
            filteredConversations.map((item) => {
              const isActive = item.id === activeId;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectConversation(item.id);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={cn(
                    'group relative p-3 rounded-xl transition-all duration-150 cursor-pointer flex flex-col space-y-1',
                    isActive
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 shadow-2xs'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {item.pinned && <Pin className="w-3 h-3 text-indigo-500 shrink-0 fill-indigo-500" />}
                      <MessageSquare
                        className={cn(
                          'w-3.5 h-3.5 shrink-0',
                          isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                        )}
                      />
                      <span
                        className={cn(
                          'text-xs font-bold truncate',
                          isActive
                            ? 'text-indigo-950 dark:text-indigo-100'
                            : 'text-slate-800 dark:text-slate-200'
                        )}
                      >
                        {item.title}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(item.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-all cursor-pointer"
                      title="Delete conversation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 pl-5">
                    {item.preview}
                  </p>

                  <div className="flex items-center justify-between pt-1 pl-5 text-[10px] text-slate-400">
                    <span className="font-medium text-indigo-600/80 dark:text-indigo-400/80">{item.category}</span>
                    <span>{item.updatedAt}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info box */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Support Assistant</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Conversations sync via <code className="text-indigo-600 font-mono">services/api.ts</code> using <code className="text-indigo-600 font-mono">VITE_API_URL</code>.
          </p>
        </div>
      </aside>
    </>
  );
};
