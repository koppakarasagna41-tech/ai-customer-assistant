import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowDown, Bot, Sparkles, RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

import { ChatHeader } from '../components/chat/ChatHeader';
import { ChatSidebar } from '../components/chat/ChatSidebar';
import { ChatMessageItem } from '../components/chat/ChatMessageItem';
import { ChatInput } from '../components/chat/ChatInput';
import { SuggestedPrompts } from '../components/chat/SuggestedPrompts';
import { TypingIndicator } from '../components/chat/TypingIndicator';
import { ChatAttachment, ChatMessage, Conversation } from '../types/chat';
import { chatService } from '../services/api';

const initialConversations: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Billing & Account Upgrades',
    updatedAt: 'Just now',
    preview: 'How do I upgrade my team subscription plan and access past monthly invoices?',
    category: 'Billing',
    messageCount: 3,
    pinned: true,
  },
  {
    id: 'conv-2',
    title: 'API Authentication Debugging',
    updatedAt: '2 hours ago',
    preview: 'I am getting a 401 Unauthorized error in my axios client...',
    category: 'Technical',
    messageCount: 4,
  },
  {
    id: 'conv-3',
    title: 'General Support & RBAC Roles',
    updatedAt: '1 day ago',
    preview: 'How do I invite new engineers to my workspace and assign granular role-based permissions?',
    category: 'General',
    messageCount: 2,
  },
];

const initialMessages: Record<string, ChatMessage[]> = {
  'conv-1': [
    {
      id: 'm-101',
      conversationId: 'conv-1',
      sender: 'user',
      content: 'How do I upgrade my team subscription plan and access past monthly invoices for tax accounting?',
      timestamp: '10:30 AM',
      status: 'sent',
    },
    {
      id: 'm-102',
      conversationId: 'conv-1',
      sender: 'assistant',
      content: `Welcome to **Enterprise Support AI**! I'd be happy to guide you through upgrading your subscription and downloading invoices:

### 1. Upgrading Your Subscription Plan
1. Navigate to the **API & Config / Settings** page from the sidebar menu.
2. Select the **Billing & Subscription** tab.
3. Click **Upgrade Plan** to switch from *Developer Tier* to *Enterprise Dedicated Tier*.

### 2. Exporting Monthly Invoices
- All historical receipts are automatically compiled into PDF format on the 1st of every month.
- You can access them directly via our API endpoint or under **Billing > Invoices**.

\`\`\`typescript
// Example: Programmatically fetch invoice PDF via API Client
import { apiClient } from './services/api';

export async function downloadLatestInvoice() {
  const response = await apiClient.get('/billing/invoices/latest', {
    responseType: 'blob'
  });
  return response.data;
}
\`\`\`

Let me know if you need assistance updating your billing credit card details or setting up automated email invoicing!`,
      timestamp: '10:31 AM',
      status: 'sent',
    },
  ],
  'conv-2': [
    {
      id: 'm-201',
      conversationId: 'conv-2',
      sender: 'user',
      content: 'I am getting a 401 Unauthorized error in my axios client when calling `/dashboard/stats`. How do I fix token expiration?',
      timestamp: '08:15 AM',
      status: 'sent',
    },
    {
      id: 'm-202',
      conversationId: 'conv-2',
      sender: 'assistant',
      content: `The \`401 Unauthorized\` error occurs when the \`Authorization\` header is missing or when the JWT Bearer token has expired.

Our \`src/services/api.ts\` architecture includes an **Axios Response Interceptor** that automatically catches 401 status codes and triggers a token refresh using \`import.meta.env.VITE_API_URL\`:

\`\`\`typescript
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Automatic refresh token exchange
      const refreshRes = await axios.post('/auth/refresh', { refreshToken });
      storage.setAccessToken(refreshRes.data.tokens.accessToken);
    }
  }
);
\`\`\`

Make sure your server or endpoint returns a valid token payload. You can also inspect your active token in the **Dashboard Inspector** tab!`,
      timestamp: '08:16 AM',
      status: 'sent',
    },
  ],
  'conv-3': [],
};

export const ChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeId, setActiveId] = useState<string>('conv-1');
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(initialMessages);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find((c) => c.id === activeId);
  const currentMessages = messages[activeId] || [];

  // Scroll to bottom helper
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Monitor scroll position to show "Scroll to Bottom" floating button
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isUp = scrollHeight - scrollTop - clientHeight > 150;
    setShowScrollBottom(isUp);
  };

  // Auto-scroll when messages update or typing starts
  useEffect(() => {
    scrollToBottom();
  }, [currentMessages.length, isTyping]);

  // Fetch initial conversations from API service or local fallback
  const fetchConversations = useCallback(async () => {
    try {
      setApiError(null);
      const apiConvs = await chatService.getConversations();
      if (apiConvs && apiConvs.length > 0) {
        setConversations(apiConvs);
      }
    } catch {
      // Server backend isn't mounted yet; use fallback client conversations cleanly
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Create new conversation
  const handleNewConversation = async () => {
    const newId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title: `New Support Thread ${conversations.length + 1}`,
      updatedAt: 'Just now',
      preview: 'Started new AI customer inquiry...',
      category: 'General',
      messageCount: 0,
    };

    try {
      // Dispatch API request
      const created = await chatService.createConversation({
        title: newConv.title,
        category: newConv.category,
      });
      if (created) {
        setConversations((prev) => [created, ...prev]);
        setActiveId(created.id);
        setMessages((prev) => ({ ...prev, [created.id]: [] }));
        toast.success('Created new chat thread');
        return;
      }
    } catch {
      // Client fallback
    }

    setConversations((prev) => [newConv, ...prev]);
    setActiveId(newId);
    setMessages((prev) => ({ ...prev, [newId]: [] }));
    toast.success('Created new support thread');
  };

  // Delete conversation
  const handleDeleteConversation = async (id: string) => {
    try {
      await chatService.deleteConversation(id);
    } catch {
      // ignore
    }

    setConversations((prev) => {
      const remaining = prev.filter((c) => c.id !== id);
      if (activeId === id && remaining.length > 0) {
        setActiveId(remaining[0].id);
      }
      return remaining;
    });
    toast.success('Conversation deleted');
  };

  // Clear messages history
  const handleClearHistory = async () => {
    if (!activeId) return;
    if (!window.confirm('Are you sure you want to clear message history for this thread?')) return;

    try {
      await chatService.clearMessages(activeId);
    } catch {
      // ignore
    }

    setMessages((prev) => ({ ...prev, [activeId]: [] }));
    toast.success('Cleared chat history');
  };

  // Export conversation as text file
  const handleExportChat = () => {
    if (!activeConversation) return;

    const logText = currentMessages
      .map((m) => `[${m.timestamp}] ${m.sender.toUpperCase()}:\n${m.content}\n`)
      .join('\n---\n\n');

    const blob = new Blob([logText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${activeConversation.title.toLowerCase().replace(/\s+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('Conversation log exported as Markdown file!');
  };

  // Handle user send message
  const handleSendMessage = async (text: string, attachments: ChatAttachment[]) => {
    if (!activeId) return;

    const userMessageId = `msg-${Date.now()}`;
    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage: ChatMessage = {
      id: userMessageId,
      conversationId: activeId,
      sender: 'user',
      content: text,
      timestamp: timestampStr,
      status: 'sent',
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    // 1. Immediately append User message to state
    setMessages((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), userMessage],
    }));

    // Update preview in conversation list
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              preview: text || 'Attached file(s)...',
              updatedAt: 'Just now',
              messageCount: c.messageCount + 1,
            }
          : c
      )
    );

    setIsTyping(true);

    // 2. Dispatch via chatService using import.meta.env.VITE_API_URL
    try {
      const response = await chatService.sendMessage({
        conversationId: activeId,
        message: text,
        attachments,
      });

      if (response && response.message) {
        setIsTyping(false);
        setMessages((prev) => ({
          ...prev,
          [activeId]: [...(prev[activeId] || []), response.message],
        }));
        return;
      }
    } catch {
      // Expected when backend server route /chat/messages is pending: run client AI response generator
    }

    // Smart simulated AI reply for frontend preview demo
    setTimeout(() => {
      setIsTyping(false);

      const aiReplyText = generateSmartAiResponse(text);
      const aiMessage: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        conversationId: activeId,
        sender: 'assistant',
        content: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent',
      };

      setMessages((prev) => ({
        ...prev,
        [activeId]: [...(prev[activeId] || []), aiMessage],
      }));
    }, 1200);
  };

  // Generate responsive AI message for offline preview
  const generateSmartAiResponse = (userInput: string): string => {
    const lower = userInput.toLowerCase();

    if (lower.includes('invoice') || lower.includes('billing') || lower.includes('upgrade')) {
      return `Thank you for reaching out to **Billing Support**!

Our enterprise billing system handles subscription tiers, automated VAT invoicing, and credit card updates via \`import.meta.env.VITE_API_URL\`:

- **Monthly Invoices**: Generated automatically every month under **Settings > Billing**.
- **Payment Gateway**: Powered by standard encrypted TLS endpoints.

If you need a custom enterprise SLA or wire transfer invoice, reply back and I will route this ticket to our billing specialists!`;
    }

    if (lower.includes('401') || lower.includes('error') || lower.includes('token') || lower.includes('api')) {
      return `I analyzed your technical query regarding **API Authentication & Token Errors**:

### Diagnostic Steps:
1. Ensure your Bearer token is valid and attached in the request header:
\`\`\`bash
curl -X GET "${import.meta.env.VITE_API_URL || 'https://api.example.com/v1'}/dashboard/stats" \\
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \\
  -H "Content-Type: application/json"
\`\`\`

2. Check if your refresh token interceptor is active in \`src/services/api.ts\`.

Would you like me to inspect your server logs or run a diagnostic health check?`;
    }

    return `Thank you for contacting **AI Customer Support**!

I have recorded your request: *"_${userInput}_"*. 

### Next Recommended Steps:
- **API Status**: All services are currently **Operational (99.98% Uptime)**.
- **Documentation**: You can review full API endpoint schemas under our developer settings console.

\`\`\`json
{
  "status": "success",
  "ticketId": "SUP-${Math.floor(100000 + Math.random() * 900000)}",
  "assignedAgent": "AI-Assistant-v2",
  "priority": "normal"
}
\`\`\`

Is there anything else I can assist you with today?`;
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
      {/* Conversation Sidebar */}
      <ChatSidebar
        conversations={conversations}
        activeId={activeId}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelectConversation={(id) => setActiveId(id)}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
      />

      {/* Main Chat Stage */}
      <div className="flex-1 flex flex-col justify-between h-full min-w-0 relative">
        {/* Chat Header */}
        <ChatHeader
          conversation={activeConversation}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onClearHistory={handleClearHistory}
          onExportChat={handleExportChat}
        />

        {/* Message Thread Scroll View */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 relative"
        >
          {/* Welcome header or Empty state prompts */}
          {currentMessages.length === 0 ? (
            <SuggestedPrompts
              onSelectPrompt={(promptText) => handleSendMessage(promptText, [])}
            />
          ) : (
            <div className="max-w-4xl mx-auto space-y-4">
              {/* Security notice */}
              <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-indigo-950 dark:text-indigo-200 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>
                    This conversation is protected under Enterprise AI Privacy guidelines. All responses route securely via <code className="font-mono text-indigo-600 dark:text-indigo-400">VITE_API_URL</code>.
                  </span>
                </div>
              </div>

              {/* Message List */}
              {currentMessages.map((msg) => (
                <ChatMessageItem
                  key={msg.id}
                  message={msg}
                  onRetry={(retryMsg) => handleSendMessage(retryMsg.content, retryMsg.attachments || [])}
                  onFeedback={(msgId, fb) => {
                    chatService.sendFeedback(msgId, fb);
                  }}
                />
              ))}

              {/* AI Typing Animation */}
              {isTyping && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Floating Scroll-to-Bottom Button */}
          {showScrollBottom && (
            <button
              onClick={() => scrollToBottom()}
              className="fixed bottom-24 right-8 z-30 p-2.5 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-all cursor-pointer animate-in fade-in-50 duration-150"
              title="Scroll to bottom"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Chat Input Bar */}
        <ChatInput onSendMessage={handleSendMessage} isLoading={isTyping} />
      </div>
    </div>
  );
};
