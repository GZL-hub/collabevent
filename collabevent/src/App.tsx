import React, { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';

// Importing page components
import DashboardContent from './components/Pages/DashboardContent';
import EventsContent from './components/Pages/EventsContent';
import CalendarContent from './components/Pages/CalendarContent';
import NotificationsContent from './components/Pages/NotificationsContent';
import TeamActivityContent from './components/pages/TeamActivity';
import SettingsContent from './components/Pages/SettingsContent';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
        />

        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;