import { useCallback } from 'react';
import { useHistoryStore } from '../store/historyStore';
import { useAuthStore } from '../store/authStore';

interface SaveConversationParams {
  feature: string;
  userMessage: string;
  aiResponse: string;
  conversationId?: string;
}

export const useConversationSave = () => {
  const { createConversation, updateConversation } = useHistoryStore();
  const { isAuthenticated } = useAuthStore();

  const saveConversation = useCallback(
    async ({ feature, userMessage, aiResponse, conversationId }: SaveConversationParams) => {
      if (!isAuthenticated) return null;

      const messages = [
        {
          role: 'user' as const,
          content: userMessage,
          timestamp: new Date(),
        },
        {
          role: 'assistant' as const,
          content: aiResponse,
          timestamp: new Date(),
        },
      ];

      try {
        if (conversationId) {
          // Update existing conversation
          await updateConversation(conversationId, { messages });
          return conversationId;
        } else {
          // Create new conversation
          const title = userMessage.substring(0, 50) + (userMessage.length > 50 ? '...' : '');
          const result = await createConversation({
            feature,
            title,
            messages,
          });
          return result?._id || null;
        }
      } catch (error) {
        console.error('Failed to save conversation:', error);
        return null;
      }
    },
    [isAuthenticated, createConversation, updateConversation]
  );

  return { saveConversation };
};
