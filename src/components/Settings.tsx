import { useState, useEffect } from 'react';
import { Save, Key, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';

export default function Settings() {
  const { user, updateProfile, loadUser } = useAuthStore();
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    if (user) {
      setGeminiApiKey(user.geminiApiKey || '');
      setDisplayName(user.displayName || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!geminiApiKey.trim()) {
      toast.error('Please enter a valid Gemini API key');
      return;
    }

    console.log('[Settings] Saving API key, length:', geminiApiKey.trim().length);
    
    setIsLoading(true);
    try {
      await updateProfile({
        displayName,
        geminiApiKey: geminiApiKey.trim(),
      });
      
      // Log the updated user state
      console.log('[Settings] Profile updated, checking localStorage...');
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log('[Settings] localStorage user:', {
          hasGeminiApiKey: !!parsedUser.geminiApiKey,
          geminiApiKeyLength: parsedUser.geminiApiKey?.length || 0,
        });
      }
      
      // Success toast is shown by the store
    } catch (error: any) {
      console.error('[Settings] Error updating profile:', error);
      // Error toast is shown by the store
    } finally {
      setIsLoading(false);
    }
  };

  const hasApiKey = user?.geminiApiKey && user.geminiApiKey.length > 0;

  // Debug function to check current state
  const debugState = () => {
    console.log('=== DEBUG STATE ===');
    console.log('1. Component state - geminiApiKey length:', geminiApiKey.length);
    console.log('2. Zustand user state:', {
      hasUser: !!user,
      email: user?.email,
      hasGeminiApiKey: !!user?.geminiApiKey,
      geminiApiKeyLength: user?.geminiApiKey?.length || 0,
    });
    console.log('3. localStorage:');
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      console.log('   - hasGeminiApiKey:', !!parsed.geminiApiKey);
      console.log('   - geminiApiKeyLength:', parsed.geminiApiKey?.length || 0);
      console.log('   - First 10 chars:', parsed.geminiApiKey?.substring(0, 10));
    } else {
      console.log('   - No user in localStorage');
    }
    console.log('==================');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Key className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Settings
            </h1>
          </div>

          {/* API Key Status Banner */}
          {hasApiKey ? (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-300">
                  Gemini API Key Configured
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  Your AI features are active and ready to use.
                </p>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                  Gemini API Key Required
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  Please add your Gemini API key to use AI features.
                </p>
              </div>
            </div>
          )}

          {/* Display Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Your name"
            />
          </div>

          {/* Gemini API Key */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pr-20"
                placeholder="Enter your Gemini API key"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Get your API key from{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" />
            {isLoading ? 'Saving...' : 'Save Settings'}
          </button>

          {/* Debug Button - Remove in production */}
          <button
            onClick={debugState}
            className="w-full mt-2 flex items-center justify-center gap-2 px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            🐛 Debug State (Check Console)
          </button>

          {/* Info Section */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
              Why do I need a Gemini API key?
            </h3>
            <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
              <li>• Your API key is stored securely in your profile</li>
              <li>• Each user manages their own key (no shared limits)</li>
              <li>• Update anytime without redeploying the app</li>
              <li>• Free tier available at Google AI Studio</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
