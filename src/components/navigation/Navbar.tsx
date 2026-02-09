import { useState, useEffect } from 'react';
import { Menu, PanelLeft, LogIn, UserPlus, LogOut, Settings } from 'lucide-react';
import { NavLogo } from './NavLogo';
import { MobileMenu } from './MobileMenu';
import { navigationItems } from '../../config/navigation';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { useNavigationContext } from '../../context/NavigationContext';
import { useAuthStore } from '../../store/authStore';
import { useHistoryStore } from '../../store/historyStore';
import LoginModal from '../auth/LoginModal';
import SignupModal from '../auth/SignupModal';
import toast from 'react-hot-toast';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { activeTab, setActiveTab } = useNavigationContext();
  const { isAuthenticated, user, loadUser, logout } = useAuthStore();
  const { toggleSidebar } = useHistoryStore();

  // Pages that don't have sidebar (should show auth in navbar)
  const pagesWithoutSidebar = ['home', 'about', 'emergency'];
  const shouldShowAuthInNavbar = pagesWithoutSidebar.includes(activeTab);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    toast.success('Logged out successfully');
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Mobile sidebar toggle - only show on pages with sidebar */}
          {!shouldShowAuthInNavbar && (
            <button
              onClick={toggleSidebar}
              className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
            >
              <PanelLeft className="w-5 h-5" />
            </button>
          )}

          <NavLogo />

          <nav className="hidden lg:flex lg:items-center lg:space-x-2">
            {navigationItems.map((item) => (
              <NavigationMenu key={item.id}>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    {item.dropdown ? (
                      <>
                        <NavigationMenuTrigger 
                          className={cn(
                            "bg-transparent",
                            (activeTab === item.id || item.dropdown?.some(subItem => subItem.id === activeTab))
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-700 dark:text-gray-300"
                          )}
                        >
                          <item.icon className="mr-1.5 h-5 w-5" />
                          {item.name}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="!left-0">
                          <ul className="grid w-[240px] gap-1 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                            {item.dropdown.map((subItem) => (
                              <li key={subItem.id}>
                                <button
                                  onClick={() => setActiveTab(subItem.id)}
                                  className={cn(
                                    "flex w-full items-center rounded-md p-3 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer",
                                    activeTab === subItem.id
                                      ? "bg-blue-50 text-blue-700 dark:bg-gray-700 dark:text-blue-400"
                                      : "text-gray-700 dark:text-gray-300"
                                  )}
                                >
                                  <subItem.icon className="mr-2 h-5 w-5" />
                                  <span className="font-medium">{subItem.name}</span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <button
                        onClick={() => setActiveTab(item.id)}
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "bg-transparent cursor-pointer",
                          activeTab === item.id
                            ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-800"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                      >
                        <item.icon className="mr-1.5 h-5 w-5" />
                        {item.name}
                      </button>
                    )}
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <AnimatedThemeToggler className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800 transition-colors duration-200" />

            {/* Auth buttons - only show on pages without sidebar */}
            {shouldShowAuthInNavbar && (
              <div className="hidden lg:flex items-center gap-2">
                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="flex items-center gap-2 min-h-[44px] px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors touch-manipulation"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                        {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.displayName || 'User'}
                      </span>
                    </button>

                    {showProfileMenu && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-50">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setActiveTab('settings');
                      }}
                      className="w-full flex items-center gap-2 min-h-[44px] px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors touch-manipulation"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 min-h-[44px] px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors touch-manipulation"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setIsLoginOpen(true)}
                      className="flex items-center gap-2 min-h-[44px] px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors touch-manipulation"
                    >
                      <LogIn className="w-4 h-4" />
                      Login
                    </button>
                    <button
                      onClick={() => setIsSignupOpen(true)}
                      className="flex items-center gap-2 min-h-[44px] px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors touch-manipulation"
                    >
                      <UserPlus className="w-4 h-4" />
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 touch-manipulation"
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="block h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

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
