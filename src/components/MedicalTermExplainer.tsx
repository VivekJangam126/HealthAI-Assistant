import React, { useState, useEffect } from 'react';
import { BookOpen, Loader, AlertCircle } from 'lucide-react';
import { explainMedicalTerm, validateMedicalTerm } from '../lib/gemini';
import ReactMarkdown from 'react-markdown';
import { useConversationSave } from '../hooks/useConversationSave';
import { useAuthStore } from '../store/authStore';
import { useHistoryStore } from '../store/historyStore';
import toast from 'react-hot-toast';

export default function MedicalTermExplainer() {
  const [term, setTerm] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  const { saveConversation } = useConversationSave();
  const { isAuthenticated } = useAuthStore();
  const { currentConversation, clearLoadedConversation } = useHistoryStore();

  // Load conversation from history
  useEffect(() => {
    if (currentConversation && currentConversation.feature === 'terms') {
      // Extract term from the first user message
      const firstUserMsg = currentConversation.messages.find((msg: any) => msg.role === 'user');
      if (firstUserMsg) {
        const match = firstUserMsg.content.match(/(?:term:|Explain medical term:)\s*(.+)/);
        if (match) {
          setTerm(match[1].trim());
        }
      }
      
      // Set the explanation from last assistant message
      const lastAssistantMsg = currentConversation.messages.filter((msg: any) => msg.role === 'assistant').pop();
      if (lastAssistantMsg) {
        setExplanation(lastAssistantMsg.content);
      }
      
      setConversationId(currentConversation._id);
      clearLoadedConversation();
      toast.success('Medical term explanation loaded!');
    }
  }, [currentConversation, clearLoadedConversation]);

  const handleExplain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!term.trim()) {
      setError('Please enter a medical term to explain.');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      // Validate if the input is a legitimate medical term
      const isValidMedicalTerm = await validateMedicalTerm(term);
      
      if (!isValidMedicalTerm) {
        setError('⚠️ The input you provided is not recognized as a valid medical term. Please enter a valid term or code.');
        setExplanation('');
        return;
      }
      
      const result = await explainMedicalTerm(term);
      setExplanation(result);
      
      // Auto-save conversation if user is authenticated
      if (isAuthenticated) {
        const savedId = await saveConversation({
          feature: 'terms',
          userMessage: `Explain medical term: ${term}`,
          aiResponse: result,
          conversationId: conversationId || undefined,
        });
        
        if (savedId && !conversationId) {
          setConversationId(savedId);
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error explaining term. Please try again.');
      setExplanation('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
        <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200 text-center">Medical Term Explainer</h2>
      </div>

      <form onSubmit={handleExplain} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={term}
            onChange={(e) => {
              setTerm(e.target.value);
              setError('');
            }}
            className="w-full p-3 sm:p-4 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 dark:bg-slate-500 dark:text-white touch-manipulation"
            placeholder="Enter a medical term..."
          />
          {term && (
            <button
              type="button"
              onClick={() => {
                setTerm('');
                setError('');
              }}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 min-w-[44px] min-h-[44px] flex items-center justify-center text-2xl touch-manipulation"
            >
              ×
            </button>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !term.trim()}
          className="w-full min-h-[44px] py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors duration-200 touch-manipulation text-base font-medium"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Explaining...
            </>
          ) : (
            'Explain Term'
          )}
        </button>
      </form>

      {explanation && (
        <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Explanation:</h3>
          <div className="prose prose-blue max-w-none">
            <ReactMarkdown>{explanation}</ReactMarkdown>
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">Pro Tip:</h4>
        <p className="text-sm text-blue-600 dark:text-blue-400">
          You can enter medical terms in multiple languages. The explanation will be provided in the same language as your input.
        </p>
      </div>
    </div>
  );
}