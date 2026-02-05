import { Toaster } from 'react-hot-toast';
import { NavigationProvider, useNavigationContext } from './context/NavigationContext';
import { ThemeProvider } from './context/ThemeContext';
import AppContent from './components/AppContent';
import HistorySidebar from './components/history/HistorySidebar';
import { useHistoryStore } from './store/historyStore';
import { ChevronRight } from 'lucide-react';

function AppWithSidebar() {
  const { isSidebarOpen, toggleSidebar } = useHistoryStore();
  const { activeTab } = useNavigationContext();
  
  // Pages that don't need sidebar
  const pagesWithoutSidebar = ['home', 'about', 'emergency'];
  const shouldShowSidebar = !pagesWithoutSidebar.includes(activeTab);
  
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      {/* Floating toggle button - only show on pages that need sidebar */}
      {shouldShowSidebar && !isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-40 p-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-r-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:pr-4 group"
          title="Open history sidebar"
        >
          <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
        </button>
      )}
      
      <AppContent />
      {shouldShowSidebar && <HistorySidebar />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <NavigationProvider>
        <AppWithSidebar />
      </NavigationProvider>
    </ThemeProvider>
  );
}

export default App;