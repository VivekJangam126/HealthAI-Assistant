import { create } from 'zustand';
import { authApi, User, RegisterData, LoginData } from '../api/authApi';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  register: (data: RegisterData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Initialize from localStorage
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('token');
  
  let initialUser: User | null = null;
  if (storedUser) {
    try {
      initialUser = JSON.parse(storedUser);
      console.log('[AuthStore] Initialized from localStorage:', {
        hasUser: !!initialUser,
        hasGeminiApiKey: !!initialUser?.geminiApiKey,
        geminiApiKeyLength: initialUser?.geminiApiKey?.length || 0,
      });
    } catch (error) {
      console.error('[AuthStore] Failed to parse stored user:', error);
    }
  }

  return {
    user: initialUser,
    token: storedToken,
    isAuthenticated: !!storedToken,
    isLoading: false,
    error: null,

    register: async (data: RegisterData) => {
      set({ isLoading: true, error: null });
      try {
        const response = await authApi.register(data);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
          isLoading: false,
        });
        toast.success('Registration successful!');
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Registration failed';
        set({ error: errorMessage, isLoading: false });
        toast.error(errorMessage);
        throw error;
      }
    },

    login: async (data: LoginData) => {
      set({ isLoading: true, error: null });
      try {
        const response = await authApi.login(data);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
          isLoading: false,
        });
        toast.success('Login successful!');
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Login failed';
        set({ error: errorMessage, isLoading: false });
        toast.error(errorMessage);
        throw error;
      }
    },

    logout: async () => {
      try {
        await authApi.logout();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
        toast.success('Logged out successfully');
      } catch (error: any) {
        console.error('Logout error:', error);
        // Clear local state anyway
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      }
    },

    updateProfile: async (data: Partial<User>) => {
      set({ isLoading: true, error: null });
      try {
        console.log('[AuthStore] Updating profile with data:', { ...data, geminiApiKey: data.geminiApiKey ? '***' : undefined });
        
        const response = await authApi.updateProfile(data);
        console.log('[AuthStore] RAW BACKEND RESPONSE:', JSON.stringify(response, null, 2));
        
        const updatedUser = response.user;
        
        console.log('[AuthStore] Profile update response received:', { 
          hasGeminiApiKey: !!updatedUser.geminiApiKey,
          geminiApiKeyLength: updatedUser.geminiApiKey?.length || 0,
          geminiApiKeyPreview: updatedUser.geminiApiKey ? updatedUser.geminiApiKey.substring(0, 10) + '...' : 'EMPTY/UNDEFINED'
        });
        
        // Update localStorage with the new user data
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Update store state - this will trigger re-renders in all components using this state
        set({
          user: updatedUser,
          isLoading: false,
        });
        
        console.log('[AuthStore] Store state updated successfully');
        
        toast.success('Profile updated successfully!');
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Update failed';
        console.error('[AuthStore] Profile update failed:', errorMessage);
        set({ error: errorMessage, isLoading: false });
        toast.error(errorMessage);
        throw error;
      }
    },

    loadUser: async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        set({ isAuthenticated: false, isLoading: false });
        return;
      }

      set({ isLoading: true });
      try {
        const response = await authApi.getCurrentUser();
        set({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    },

    clearError: () => set({ error: null }),
  };
});
