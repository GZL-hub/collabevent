import React, { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Login from './components/pages/login/Login';

// Importing page components
import DashboardContent from './components/pages/dashboard/DashboardContent';
import EventsContent from './components/Pages/EventsContent';
import CalendarContent from './components/Pages/CalendarContent';
import NotificationsContent from './components/Pages/NotificationsContent';
import TeamActivityContent from './components/pages/TeamActivity';
import SettingsContent from './components/pages/settings/SettingsContent';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('dashboard'); // Reset to dashboard when logging out
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardContent />;
      case 'events':
        return <EventsContent />;
      case 'calendar':
        return <CalendarContent />;
      case 'notifications':
        return <NotificationsContent />;
      case 'team':
        return <TeamActivityContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Show main application if authenticated
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        isSidebarOpen={isSidebarOpen}
        currentPage={currentPage}
        toggleSidebar={toggleSidebar}
        setCurrentPage={setCurrentPage}
      />

      <div className="flex-1 overflow-auto">
        <Header 
          currentPage={currentPage}
          toggleSidebar={toggleSidebar}
          onLogout={handleLogout}
        />

        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;