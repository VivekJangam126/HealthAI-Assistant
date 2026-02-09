import { useEffect, useState } from 'react';
import { 
  PanelLeftClose, 
  Search, 
  History as HistoryIcon, 
  Loader2, 
  Download, 
  LogIn, 
  UserPlus,
  User,
  LogOut,
  Settings
} from 'lucide-react';
import { useHistoryStore } from '../../store/historyStore';
import { useAuthStore } from '../../store/authStore';
import { useNavigationContext } from '../../context/NavigationContext';
import HistoryItem from './HistoryItem';
import { exportConversationToPDF, exportAllConversationsToPDF } from '../../utils/pdfExport';
import LoginModal from '../auth/LoginModal';
import SignupModal from '../auth/SignupModal';
import toast from 'react-hot-toast';

export default function HistorySidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFeature, setFilterFeature] = useState<string>('');
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const {
    conversations,
    isLoading,
    isSidebarOpen,
    toggleSidebar,
    fetchHistory,
    deleteConversation,
    toggleBookmark,
    fetchConversationById,
    setCurrentConversation,
  } = useHistoryStore();

  const { isAuthenticated, user, logout } = useAuthStore();
  const { setActiveTab } = useNavigationContext();

  useEffect(() => {
    if (isAuthenticated) {
      fetchHistory({
        search: searchQuery || undefined,
        feature: filterFeature || undefined,
        bookmarked: showBookmarked || undefined,
      });
    }
  }, [isAuthenticated, searchQuery, filterFeature, showBookmarked]);

  const handleSelectConversation = async (id: string) => {
    const conversation = await fetchConversationById(id);
    if (conversation) {
      // Navigate to the appropriate feature and load the conversation
      loadConversationIntoFeature(conversation);
    }
  };

  const loadConversationIntoFeature = (conversation: any) => {
    // Get the feature from the conversation
    const feature = conversation.feature;
    
    // Map feature names to navigation IDs (must match navigation.ts)
    const featureTabs: Record<string, string> = {
      'symptoms': 'symptoms',
      'drugs': 'drugs',
      'terms': 'terms',
      'reports': 'reports',
      'chat': 'chat',
      'medical-image': 'medical-image',
      'medicine': 'medicine',
      'policy': 'policy',
    };
    
    // Navigate to the feature
    const tabId = featureTabs[feature];
    if (tabId) {
      // Store the conversation to be loaded
      setCurrentConversation(conversation);
      
      // Navigate to the feature
      setActiveTab(tabId);
      
      // Close sidebar on mobile
      if (window.innerWidth < 1024) {
        toggleSidebar();
      }
      
      toast.success('Conversation loaded');
    }
  };

  const handleExportAll = async () => {
    if (conversations.length === 0) {
      toast.error('No conversations to export');
      return;
    }

    try {
      // Fetch full conversations with messages
      const fullConversations = await Promise.all(
        conversations.map(async (conv) => {
          const response = await fetchConversationById(conv._id);
          return response;
        })
      );

      const validConversations = fullConversations.filter(Boolean);
      
      if (validConversations.length > 0) {
        // @ts-ignore - We know these are full History objects
        exportAllConversationsToPDF(validConversations, user?.displayName || 'User');
        toast.success('Conversations exported successfully!');
      }
    } catch (error) {
      toast.error('Failed to export conversations');
    }
  };

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    toast.success('Logged out successfully');
  };

  return (
    <>
      {/* Overlay for mobile - full screen */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar - Full screen on mobile, fixed width on desktop */}
      <div 
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 flex flex-col transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          w-full sm:w-96 lg:w-80 lg:top-16 lg:h-[calc(100vh-4rem)]
        `}
      >
        {/* Header - Mobile optimized */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 min-h-[64px] lg:min-h-0">
          <div className="flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg lg:text-base font-semibold text-gray-900 dark:text-white">
              History
            </h2>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors touch-manipulation"
            title="Close sidebar"
            aria-label="Close sidebar"
          >
            <PanelLeftClose className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Search and Filters - Only show when authenticated */}
        {isAuthenticated && (
          <div className="p-4 lg:p-3 space-y-3 lg:space-y-2 border-b border-gray-200 dark:border-gray-700">
            {/* New Chat Button */}
            <button
              onClick={() => {
                setActiveTab('chat');
                if (window.innerWidth < 1024) toggleSidebar();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 lg:px-3 lg:py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg transition-colors text-base lg:text-sm font-medium shadow-sm touch-manipulation"
            >
              <svg className="w-5 h-5 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Chat
            </button>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 lg:left-2.5 top-1/2 transform -translate-y-1/2 w-4 lg:w-3.5 h-4 lg:h-3.5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 lg:pl-8 pr-3 py-3 lg:py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg lg:rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-base lg:text-xs touch-manipulation"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 lg:gap-1.5">
              <select
                value={filterFeature}
                onChange={(e) => setFilterFeature(e.target.value)}
                className="flex-1 px-3 lg:px-2 py-3 lg:py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg lg:rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-base lg:text-xs touch-manipulation"
              >
                <option value="">All Features</option>
                <option value="symptoms">Symptoms</option>
                <option value="drugs">Drugs</option>
                <option value="terms">Terms</option>
                <option value="reports">Reports</option>
                <option value="chat">Chat</option>
              </select>

              <button
                onClick={() => setShowBookmarked(!showBookmarked)}
                className={`px-4 lg:px-2 py-3 lg:py-1.5 rounded-lg lg:rounded-md text-base lg:text-xs font-medium transition-colors touch-manipulation min-w-[48px] ${
                  showBookmarked
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
                title="Bookmarked"
                aria-label="Filter bookmarked conversations"
              >
                ⭐
              </button>
            </div>
          </div>
        )}

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-3 lg:p-2 space-y-2 lg:space-y-1">
          {!isAuthenticated ? (
            <div className="text-center py-16 lg:py-12 px-6 lg:px-4">
              <HistoryIcon className="w-12 h-12 lg:w-10 lg:h-10 text-gray-400 mx-auto mb-4 lg:mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-base lg:text-sm mb-3 lg:mb-2">
                Sign in to view your conversation history
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm lg:text-xs">
                Your conversations will be saved and synced
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-16 lg:py-12">
              <Loader2 className="w-8 h-8 lg:w-6 lg:h-6 text-blue-600 animate-spin" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-16 lg:py-12 px-6 lg:px-4">
              <HistoryIcon className="w-12 h-12 lg:w-10 lg:h-10 text-gray-400 mx-auto mb-4 lg:mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-base lg:text-sm">
                {searchQuery || filterFeature || showBookmarked
                  ? 'No conversations found'
                  : 'No conversations yet'}
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm lg:text-xs mt-2 lg:mt-1">
                Start a conversation to see it here
              </p>
            </div>
          ) : (
            <>
              {conversations.map((item) => (
                <HistoryItem
                  key={item._id}
                  item={item}
                  onSelect={handleSelectConversation}
                  onDelete={deleteConversation}
                  onToggleBookmark={toggleBookmark}
                />
              ))}
            </>
          )}
        </div>

        {/* Footer - Auth Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          {/* Export button - only show when authenticated and has conversations */}
          {isAuthenticated && conversations.length > 0 && (
            <div className="p-3 lg:p-2">
              <button
                onClick={handleExportAll}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 lg:px-3 lg:py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg lg:rounded-md transition-colors text-base lg:text-xs font-medium touch-manipulation"
              >
                <Download className="w-4 h-4 lg:w-3.5 lg:h-3.5" />
                Export All
              </button>
            </div>
          )}

          {/* Auth Section */}
          <div className="p-3 lg:p-2">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-full flex items-center gap-3 px-3 py-3 lg:py-2 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 rounded-lg lg:rounded-md transition-colors touch-manipulation"
                >
                  <div className="w-10 h-10 lg:w-8 lg:h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-base lg:text-sm font-medium flex-shrink-0">
                    {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 text-left overflow-hidden min-w-0">
                    <p className="text-base lg:text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user?.displayName || 'User'}
                    </p>
                    <p className="text-sm lg:text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                </button>

                {/* Profile Menu Dropdown */}
                {showProfileMenu && (
                  <div className="absolute bottom-full left-2 right-2 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setActiveTab('settings');
                        if (window.innerWidth < 1024) toggleSidebar();
                      }}
                      className="w-full flex items-center gap-3 lg:gap-2 px-4 py-3 lg:px-3 lg:py-2 text-base lg:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 transition-colors touch-manipulation"
                    >
                      <Settings className="w-5 h-5 lg:w-4 lg:h-4" />
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 lg:gap-2 px-4 py-3 lg:px-3 lg:py-2 text-base lg:text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 transition-colors touch-manipulation"
                    >
                      <LogOut className="w-5 h-5 lg:w-4 lg:h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 lg:space-y-2">
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 lg:px-3 lg:py-2 text-base lg:text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600 rounded-lg lg:rounded-md transition-colors touch-manipulation"
                >
                  <LogIn className="w-5 h-5 lg:w-4 lg:h-4" />
                  Login
                </button>
                <button
                  onClick={() => setIsSignupOpen(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 lg:px-3 lg:py-2 text-base lg:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg lg:rounded-md transition-colors touch-manipulation"
                >
                  <UserPlus className="w-5 h-5 lg:w-4 lg:h-4" />
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Auth Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToSignup={() => {
          setIsLoginOpen(false);
          setIsSignupOpen(true);
        }}
      />

      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onSwitchToLogin={() => {
          setIsSignupOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </>
  );
}
