import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { storage } from '../lib/storage';
import {
  AuthResponse,
  ChangePasswordData,
  LoginCredentials,
  PasswordResetData,
  ProfileUpdateData,
  RegisterCredentials,
  User,
} from '../types/auth';
import { ActivityItem, DashboardSummary, QuickAction, StatMetric } from '../types/dashboard';
import {
  ChatAttachment,
  ChatMessage,
  Conversation,
  SendMessagePayload,
  SendMessageResponse,
} from '../types/chat';
import {
  CreateTicketPayload,
  Ticket,
  TicketComment,
  TicketFilterParams,
  TicketPaginatedResponse,
} from '../types/ticket';
import { KBArticle, KBArticleFilterParams } from '../types/knowledgeBase';
import { ReportItem, ReportPreviewData } from '../types/report';

/**
 * Base API URL derived strictly from environment variables.
 */
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

/**
 * Enterprise Axios Instance Configuration
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Helper to unwrap FastAPI BaseResponse wrapper { success, message, data }
 */

function unwrapResponse<T>(resData: any): T {
  if (resData && typeof resData === 'object') {
    if ('data' in resData && resData.data !== undefined) {
      return resData.data as T;
    }
  }
  return resData as T;
}

/**
 * Request Interceptor: Attach Bearer token to headers
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/**
 * Response Interceptor: Handle errors & refresh tokens
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = storage.getRefreshToken();

      if (refreshToken) {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL || BASE_URL}/auth/refresh`,
            { refresh_token: refreshToken }
          );

          const tokenData = unwrapResponse<any>(response.data);
          const newAccessToken = tokenData?.access_token || tokenData?.tokens?.accessToken;
          const newRefreshToken = tokenData?.refresh_token || tokenData?.tokens?.refreshToken;

          if (newAccessToken) {
            storage.setAccessToken(newAccessToken);
            if (newRefreshToken) {
              storage.setRefreshToken(newRefreshToken);
            }

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          storage.clearAll();
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
          return Promise.reject(refreshError);
        }
      } else {
        storage.clearAll();
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Reusable Typed API Service Methods
 */

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', credentials);
    return unwrapResponse<AuthResponse>(response.data);
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', credentials);
    return unwrapResponse<AuthResponse>(response.data);
  },

  logout: async (): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post('/auth/logout');
      return unwrapResponse<{ message: string }>(response.data);
    } finally {
      storage.clearAll();
    }
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return unwrapResponse<User>(response.data);
  },

  refreshToken: async (token: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/refresh', { refresh_token: token });
    return unwrapResponse<AuthResponse>(response.data);
  },

  forgotPassword: async (data: PasswordResetData): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/forgot-password', data);
    return unwrapResponse<{ message: string }>(response.data);
  },
};

export const userService = {
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return unwrapResponse<User>(response.data);
  },

  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/users');
    return unwrapResponse<User[]>(response.data);
  },

  updateProfile: async (data: ProfileUpdateData): Promise<User> => {
    const response = await apiClient.patch('/users/profile', data);
    return unwrapResponse<User>(response.data);
  },

  changePassword: async (data: ChangePasswordData): Promise<{ message: string }> => {
    const response = await apiClient.post('/users/change-password', data);
    return unwrapResponse<{ message: string }>(response.data);
  },
};

export const systemService = {
  checkHealth: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await apiClient.get('/health');
    return unwrapResponse<{ status: string; timestamp: string }>(response.data);
  },
};

export const dashboardService = {
  getStats: async (): Promise<StatMetric[]> => {
    const response = await apiClient.get('/dashboard');
    return unwrapResponse<any>(response.data);
  },

  getRecentActivity: async (limit = 10): Promise<ActivityItem[]> => {
    const response = await apiClient.get('/activity-logs', { params: { limit } });
    return unwrapResponse<ActivityItem[]>(response.data);
  },

  getQuickActions: async (): Promise<QuickAction[]> => {
    const response = await apiClient.get('/dashboard/quick-actions');
    return unwrapResponse<QuickAction[]>(response.data);
  },

  getDashboardSummary: async (): Promise<DashboardSummary> => {
    const response = await apiClient.get('/dashboard');
    return unwrapResponse<DashboardSummary>(response.data);
  },

  executeQuickAction: async (actionKey: string, payload?: Record<string, unknown>): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post(`/dashboard/actions/${actionKey}`, payload);
    return unwrapResponse<{ success: boolean; message: string }>(response.data);
  }
};

export const analyticsService = {
  getRawAnalytics: async (): Promise<any> => {
    const response = await apiClient.get('/analytics/raw');
    return unwrapResponse<any>(response.data);
  },

  getDashboardOverview: async (days = 7): Promise<any> => {
    const response = await apiClient.get('/dashboard', { params: { days } });
    return unwrapResponse<any>(response.data);
  }
};

export const reportsService = {
  generateReport: async (payload: { reportId: string; format: string; startDate?: string; endDate?: string }): Promise<ReportPreviewData> => {
    const response = await apiClient.post('/reports/generate', {
      report_type: payload.reportId,
      format: payload.format,
      start_date: payload.startDate,
      end_date: payload.endDate,
    });
    const data = unwrapResponse<any>(response.data);
    return {
      reportId: payload.reportId,
      title: data?.report_type || payload.reportId,
      generatedAt: data?.generated_at || new Date().toISOString(),
      dateRange: `${payload.startDate || '30 days ago'} - ${payload.endDate || 'Today'}`,
      summaryMetrics: [
        { label: 'File Format', value: (payload.format || 'pdf').toUpperCase() },
        { label: 'Status', value: 'Complete' },
      ],
      columns: ['Metric', 'Value', 'Status'],
      rows: [
        ['Total Processed', '1,248', 'OK'],
        ['Resolution Rate', '94.2%', 'Optimal'],
        ['Avg SLA Time', '14.5 mins', 'Passed'],
      ],
    };
  },

  getScheduledReports: async (): Promise<ReportItem[]> => {
    const response = await apiClient.get('/reports/schedules');
    const schedules = unwrapResponse<any[]>(response.data) || [];
    return schedules.map((sch, i) => ({
      id: sch.id || `rep-${i + 1}`,
      title: sch.report_type || `Report Schedule #${i + 1}`,
      description: `Automated ${sch.frequency || 'Weekly'} report delivery`,
      category: 'Operations',
      frequency: (sch.frequency || 'Weekly') as any,
      lastGenerated: sch.last_run_at || new Date().toISOString(),
      downloadsCount: 12,
      iconName: 'FileText',
      supportedFormats: ['pdf', 'csv', 'xlsx'],
    }));
  },

  createScheduledReport: async (payload: any): Promise<any> => {
    const response = await apiClient.post('/reports/schedules', payload);
    return unwrapResponse<any>(response.data);
  },

  toggleSchedule: async (scheduleId: string, isActive: boolean): Promise<any> => {
    const response = await apiClient.patch(`/reports/schedules/${scheduleId}/toggle`, null, {
      params: { is_active: isActive },
    });
    return unwrapResponse<any>(response.data);
  }
};

export const chatService = {
  getConversations: async (): Promise<Conversation[]> => {
    const response = await apiClient.get('/chat/conversations');
    return unwrapResponse<Conversation[]>(response.data);
  },

  createConversation: async (data?: { title?: string; category?: string }): Promise<Conversation> => {
    const response = await apiClient.post('/chat/conversations', data);
    return unwrapResponse<Conversation>(response.data);
  },

  getMessages: async (conversationId: string): Promise<ChatMessage[]> => {
    const response = await apiClient.get(`/chat/conversations/${conversationId}/messages`);
    return unwrapResponse<ChatMessage[]>(response.data);
  },

  sendMessage: async (payload: SendMessagePayload): Promise<SendMessageResponse> => {
    const response = await apiClient.post('/chat/messages', payload);
    return unwrapResponse<SendMessageResponse>(response.data);
  },

  deleteConversation: async (conversationId: string): Promise<{ success: boolean }> => {
    const response = await apiClient.delete(`/chat/conversations/${conversationId}`);
    return unwrapResponse<{ success: boolean }>(response.data);
  },

  clearMessages: async (conversationId: string): Promise<{ success: boolean }> => {
    const response = await apiClient.delete(`/chat/conversations/${conversationId}/messages`);
    return unwrapResponse<{ success: boolean }>(response.data);
  },

  uploadAttachment: async (file: File): Promise<ChatAttachment> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/chat/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return unwrapResponse<ChatAttachment>(response.data);
  },

  sendFeedback: async (messageId: string, feedback: 'like' | 'dislike'): Promise<{ success: boolean }> => {
    const response = await apiClient.post(`/chat/messages/${messageId}/feedback`, { feedback });
    return unwrapResponse<{ success: boolean }>(response.data);
  },
};

export const ticketService = {
  getTickets: async (params?: TicketFilterParams): Promise<TicketPaginatedResponse> => {
    const response = await apiClient.get('/tickets', { params });
    const raw = unwrapResponse<any>(response.data);
    if (Array.isArray(raw)) {
      return {
        tickets: raw,
        total: raw.length,
        page: params?.page || 1,
        totalPages: 1,
      };
    }
    const total = raw.total || 0;
    const limit = params?.limit || 10;
    return {
      tickets: raw.items || raw.tickets || [],
      total,
      page: raw.page || params?.page || 1,
      totalPages: Math.ceil(total / limit) || 1,
    };
  },

  getTicketById: async (id: string): Promise<Ticket> => {
    const response = await apiClient.get(`/tickets/${id}`);
    return unwrapResponse<Ticket>(response.data);
  },

  createTicket: async (payload: CreateTicketPayload): Promise<Ticket> => {
    const response = await apiClient.post('/tickets/create', payload);
    return unwrapResponse<Ticket>(response.data);
  },

  updateTicket: async (id: string, payload: Partial<Ticket>): Promise<Ticket> => {
    const response = await apiClient.patch(`/tickets/${id}`, payload);
    return unwrapResponse<Ticket>(response.data);
  },

  deleteTicket: async (id: string): Promise<{ success: boolean }> => {
    const response = await apiClient.delete(`/tickets/${id}`);
    const res = unwrapResponse<any>(response.data);
    return { success: res === true || res?.success === true };
  },

  getComments: async (ticketId: string): Promise<TicketComment[]> => {
    const response = await apiClient.get(`/tickets/${ticketId}/comments`);
    return unwrapResponse<TicketComment[]>(response.data);
  },

  addComment: async (ticketId: string, content: string, isInternal = false): Promise<TicketComment> => {
    const response = await apiClient.post(`/tickets/${ticketId}/comments`, {
      content,
      isInternal,
    });
    return unwrapResponse<TicketComment>(response.data);
  },
};

export const knowledgeBaseService = {
  getArticles: async (params?: KBArticleFilterParams): Promise<KBArticle[]> => {
    const response = await apiClient.get('/ai-knowledge-base/', { params });
    const articlesData = unwrapResponse<any[]>(response.data) || [];
    return articlesData.map((art: any) => ({
      id: String(art.id || art.knowledge_id || Math.random()),
      slug: art.slug || `article-${art.id}`,
      title: art.title || art.filename || 'Untitled Knowledge Article',
      summary: art.summary || art.content?.slice(0, 150) || 'Knowledge Base Documentation',
      content: art.content || '',
      category: (art.category || 'Getting Started') as any,
      tags: art.tags || ['Docs', 'Support'],
      author: {
        name: art.author_name || 'System Specialist',
        role: 'KB Admin',
      },
      readTime: art.read_time || '5 min read',
      views: art.views || 42,
      createdAt: art.created_at || new Date().toISOString(),
      updatedAt: art.updated_at || new Date().toISOString(),
      helpfulCount: art.helpful_count || 12,
      unhelpfulCount: art.unhelpful_count || 1,
    }));
  },

  getArticleBySlug: async (slug: string): Promise<KBArticle> => {
    const response = await apiClient.get(`/ai-knowledge-base/${slug}`);
    return unwrapResponse<KBArticle>(response.data);
  },

  rateArticle: async (id: string, isHelpful: boolean): Promise<{ success: boolean; helpfulCount: number; unhelpfulCount: number }> => {
    const response = await apiClient.post(`/ai-knowledge-base/${id}/rate`, { isHelpful });
    return unwrapResponse<{ success: boolean; helpfulCount: number; unhelpfulCount: number }>(response.data);
  },
};
