export type TicketStatus = 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TicketCategory =
  | 'Billing'
  | 'Technical'
  | 'Security'
  | 'Feature Request'
  | 'Bug'
  | 'Account';

export interface TicketUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
}

export interface TicketComment {
  id: string;
  ticketId: string;
  author: TicketUser;
  content: string;
  createdAt: string;
  isInternal?: boolean;
  attachments?: string[];
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  assignee?: TicketUser;
  reporter: TicketUser;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  tags: string[];
  commentsCount: number;
}

export interface CreateTicketPayload {
  title: string;
  description: string;
  priority: TicketPriority;
  category: TicketCategory;
  assigneeId?: string;
  dueDate?: string;
  tags?: string[];
}

export interface TicketFilterParams {
  status?: string;
  priority?: string;
  category?: string;
  search?: string;
  assigneeId?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'priority' | 'status' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface TicketPaginatedResponse {
  tickets: Ticket[];
  total: number;
  page: number;
  totalPages: number;
}
