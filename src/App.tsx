import React from 'react';
import { Toaster } from 'react-hot-toast';
import SymptomAnalyzer from './components/SymptomAnalyzer';
import DrugInteraction from './components/DrugInteraction';
import MedicalTermExplainer from './components/MedicalTermExplainer';
import ReportSummarizer from './components/ReportSummarizer';
import About from './components/About';
import Homepage from './components/Homepage';
import HealthcareChat from './components/HealthcareChat';
import Emergency from './components/Emergency';
import { NavigationProvider } from './context/NavigationContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/navigation/Navbar';
import AppContent from './components/AppContent';

function App() {
  return (
    <ThemeProvider>
      <NavigationProvider>
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
        <AppContent />
      </NavigationProvider>
    </ThemeProvider>
  );
}

export default App;