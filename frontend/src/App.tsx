import React, { useState, useEffect } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Login from './components/pages/login/Login';

// Importing page components
import DashboardContent from './components/pages/dashboard/DashboardContent';
import EventsContent from './components/pages/event/EventsContent';
import CalendarContent from './components/Pages/CalendarContent';
import NotificationsContent from './components/Pages/NotificationsContent';
import TeamActivityContent from './components/pages/team/TeamActivity';
import SettingsContent from './components/pages/settings/SettingsContent';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  department?: string;
  bio?: string;
  phone?: string;
  avatar?: string;
}

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Check for existing user session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    console.log('User logged in:', user);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentPage('dashboard');
    localStorage.removeItem('user');
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
        return <SettingsContent currentUser={currentUser} />;
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
          currentUser={currentUser}
        />

        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;