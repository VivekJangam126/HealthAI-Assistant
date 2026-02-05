import axiosInstance from './axiosConfig';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: string[];
}

export interface History {
  _id: string;
  userId: string;
  feature: 'symptoms' | 'drugs' | 'terms' | 'reports' | 'chat' | 'medical-image' | 'medicine' | 'policy';
  title: string;
  messages: Message[];
  tags: string[];
  bookmarked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HistoryListItem extends Omit<History, 'messages'> {}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export const historyApi = {
  // Create new conversation
  create: async (data: {
    feature: string;
    title?: string;
    messages: Message[];
    tags?: string[];
  }): Promise<{ success: boolean; history: History }> => {
    const response = await axiosInstance.post('/history', data);
    return response.data;
  },

  // Get all conversations
  getAll: async (params?: {
    page?: number;
    limit?: number;
    feature?: string;
    bookmarked?: boolean;
    search?: string;
  }): Promise<{
    success: boolean;
    history: HistoryListItem[];
    pagination: PaginationInfo;
  }> => {
    const response = await axiosInstance.get('/history', { params });
    return response.data;
  },

  // Get single conversation
  getById: async (id: string): Promise<{ success: boolean; history: History }> => {
    const response = await axiosInstance.get(`/history/${id}`);
    return response.data;
  },

  // Update conversation
  update: async (
    id: string,
    data: {
      messages?: Message[];
      title?: string;
      tags?: string[];
    }
  ): Promise<{ success: boolean; history: History }> => {
    const response = await axiosInstance.put(`/history/${id}`, data);
    return response.data;
  },

  // Delete conversation
  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.delete(`/history/${id}`);
    return response.data;
  },

  // Toggle bookmark
  toggleBookmark: async (
    id: string
  ): Promise<{ success: boolean; message: string; bookmarked: boolean }> => {
    const response = await axiosInstance.post(`/history/${id}/bookmark`);
    return response.data;
  },

  // Get by feature type
  getByFeature: async (
    feature: string
  ): Promise<{ success: boolean; history: HistoryListItem[]; count: number }> => {
    const response = await axiosInstance.get(`/history/feature/${feature}`);
    return response.data;
  },
};
