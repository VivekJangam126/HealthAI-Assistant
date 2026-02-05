import { create } from 'zustand';
import { historyApi, History, HistoryListItem, PaginationInfo } from '../api/historyApi';
import toast from 'react-hot-toast';

interface HistoryState {
  conversations: HistoryListItem[];
  currentConversation: History | null;
  loadedConversation: History | null; // For loading into features
  pagination: PaginationInfo | null;
  isLoading: boolean;
  error: string | null;
  isSidebarOpen: boolean;

  // Actions
  fetchHistory: (params?: {
    page?: number;
    feature?: string;
    bookmarked?: boolean;
    search?: string;
  }) => Promise<void>;
  fetchConversationById: (id: string) => Promise<History | null>;
  createConversation: (data: {
    feature: string;
    title?: string;
    messages: any[];
    tags?: string[];
  }) => Promise<History | null>;
  updateConversation: (id: string, data: any) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  toggleBookmark: (id: string) => Promise<void>;
  setCurrentConversation: (conversation: History | null) => void;
  setLoadedConversation: (conversation: History | null) => void;
  clearLoadedConversation: () => void;
  toggleSidebar: () => void;
  clearError: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  loadedConversation: null,
  pagination: null,
  isLoading: false,
  error: null,
  isSidebarOpen: true, // Open by default for desktop

  fetchHistory: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await historyApi.getAll(params);
      set({
        conversations: response.history,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch history';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  fetchConversationById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await historyApi.getById(id);
      set({
        currentConversation: response.history,
        isLoading: false,
      });
      return response.history;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch conversation';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  createConversation: async (data) => {
    try {
      const response = await historyApi.create(data);
      
      // Add to conversations list
      set((state) => ({
        conversations: [response.history as any, ...state.conversations],
      }));
      
      toast.success('Conversation saved');
      return response.history;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to save conversation';
      toast.error(errorMessage);
      return null;
    }
  },

  updateConversation: async (id, data) => {
    try {
      const response = await historyApi.update(id, data);
      
      // Update in list
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv._id === id ? { ...conv, ...data } : conv
        ),
        currentConversation:
          state.currentConversation?._id === id
            ? response.history
            : state.currentConversation,
      }));
      
      toast.success('Conversation updated');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update conversation';
      toast.error(errorMessage);
    }
  },

  deleteConversation: async (id) => {
    try {
      await historyApi.delete(id);
      
      // Remove from list
      set((state) => ({
        conversations: state.conversations.filter((conv) => conv._id !== id),
        currentConversation:
          state.currentConversation?._id === id ? null : state.currentConversation,
      }));
      
      toast.success('Conversation deleted');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete conversation';
      toast.error(errorMessage);
    }
  },

  toggleBookmark: async (id) => {
    try {
      const response = await historyApi.toggleBookmark(id);
      
      // Update in list
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv._id === id ? { ...conv, bookmarked: response.bookmarked } : conv
        ),
      }));
      
      toast.success(response.message);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to toggle bookmark';
      toast.error(errorMessage);
    }
  },

  setCurrentConversation: (conversation) => {
    set({ currentConversation: conversation });
  },

  setLoadedConversation: (conversation) => {
    set({ loadedConversation: conversation });
  },

  clearLoadedConversation: () => {
    set({ loadedConversation: null });
  },

  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },

  clearError: () => set({ error: null }),
}));
