import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export function useGeminiKey() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Compute hasApiKey based on current user state
  const hasApiKey = !!(user?.geminiApiKey && user.geminiApiKey.trim() !== '');

  // Debug logging
  console.log('[useGeminiKey] Current state:', {
    isAuthenticated,
    hasUser: !!user,
    hasApiKey,
    apiKeyLength: user?.geminiApiKey?.length || 0,
  });

  const getApiKey = (): string | null => {
    if (!isAuthenticated) {
      toast.error('Please login to use AI features');
      return null;
    }

    const apiKey = user?.geminiApiKey?.trim();
    if (!apiKey) {
      console.log('[useGeminiKey] No API key found, redirecting to settings');
      toast.error('Please add your Gemini API key in Settings', {
        duration: 5000,
        icon: '🔑',
      });
      setTimeout(() => navigate('/settings'), 1500);
      return null;
    }

    console.log('[useGeminiKey] API key found, length:', apiKey.length);
    return apiKey;
  };

  const handleGeminiError = (error: any) => {
    if (error.message === 'GEMINI_KEY_MISSING') {
      toast.error('Gemini API key is missing. Please add it in Settings.', {
        duration: 5000,
        icon: '🔑',
      });
      setTimeout(() => navigate('/settings'), 1500);
      return true;
    }

    if (error.message === 'GEMINI_KEY_INVALID') {
      toast.error('Your Gemini API key is invalid or expired. Please update it in Settings.', {
        duration: 5000,
        icon: '⚠️',
      });
      setTimeout(() => navigate('/settings'), 1500);
      return true;
    }

    return false;
  };

  return {
    apiKey: user?.geminiApiKey || null,
    hasApiKey,
    getApiKey,
    handleGeminiError,
  };
}
