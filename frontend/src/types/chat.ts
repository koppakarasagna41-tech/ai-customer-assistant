export type SenderRole = 'user' | 'assistant' | 'system';

export interface ChatAttachment {
  id: string;
  name: string;
  size: number; // in bytes
  type: string; // mime or extension e.g. 'image/png', 'application/pdf', 'text/plain'
  url?: string;
  previewUrl?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: SenderRole;
  content: string;
  timestamp: string;
  status?: 'sending' | 'sent' | 'error';
  attachments?: ChatAttachment[];
  feedback?: 'like' | 'dislike';
  errorDetails?: string;
}

export interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
  preview: string;
  category: 'General' | 'Billing' | 'Technical' | 'Account';
  messageCount: number;
  pinned?: boolean;
}

export interface SuggestedPrompt {
  id: string;
  category: string;
  title: string;
  prompt: string;
  description: string;
  iconName?: string;
}

export interface SendMessagePayload {
  conversationId: string;
  message: string;
  attachments?: ChatAttachment[];
  model?: string;
}

export interface SendMessageResponse {
  message: ChatMessage;
  conversationId: string;
}
