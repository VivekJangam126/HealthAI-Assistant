import React from 'react';
import HealthcareLogo from '../HealthcareLogo';
import { useNavigationContext } from '../../context/NavigationContext';

export function NavLogo() {
  const { setActiveTab } = useNavigationContext();

  return (
    <div 
      className="flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-200" 
      onClick={() => setActiveTab('home')}
    >
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500">
          <HealthcareLogo className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
      </div>
      <div className="ml-2 sm:ml-3">
        <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-gray-200 leading-tight">
          AyuMitra
        </h1>
        <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-tight hidden sm:block">
          Your Personal Health Analysis Tool
        </p>
        <p className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight sm:hidden">
          Health Analysis Tool
        </p>
      </div>
    </div>
  );
}