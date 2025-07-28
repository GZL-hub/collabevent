import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Login from './components/pages/login/components/Login';

// Importing page components
import DashboardContent from './components/pages/dashboard/DashboardContent';
import EventsContent from './components/pages/event/EventsContent';
import CalendarContent from './components/pages/calendar/CalendarContent';
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

// Create a wrapper component to use router hooks
const AppContent = ({ 
  currentUser, 
  isAuthenticated, 
  isSidebarOpen, 
  toggleSidebar, 
  handleLogout,
  currentPage,
  setCurrentPage
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Update currentPage based on URL
  useEffect(() => {
    const path = location.pathname.slice(1) || 'dashboard';
    if (path !== currentPage) {
      setCurrentPage(path);
    }
  }, [location.pathname, currentPage, setCurrentPage]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        isSidebarOpen={isSidebarOpen}
        currentPage={currentPage}
        toggleSidebar={toggleSidebar}
        setCurrentPage={(page) => {
          setCurrentPage(page);
          navigate(`/${page}`);
        }}
      />

      <div className="flex-1 overflow-auto">
        <Header 
          currentPage={currentPage}
          toggleSidebar={toggleSidebar}
          onLogout={handleLogout}
          currentUser={currentUser}
        />

        <main className="p-6">
          <Routes>
            <Route path="/dashboard" element={<DashboardContent />} />
            <Route path="/events" element={<EventsContent />} />
            <Route path="/calendar" element={<CalendarContent />} />
            <Route path="/notifications" element={<NotificationsContent />} />
            <Route path="/team" element={<TeamActivityContent />} />
            <Route path="/settings" element={<SettingsContent currentUser={currentUser} />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [authLoading, setAuthLoading] = useState(true);

  // Check for existing user session on app load
  useEffect(() => {
    // Try sessionStorage first, then localStorage
    const savedUser = sessionStorage.getItem('user') || localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        sessionStorage.removeItem('user');
        localStorage.removeItem('user');
      }
    }
    setAuthLoading(false);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogin = (user: User, rememberMe = false) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    // Store in localStorage if rememberMe, else sessionStorage
    if (rememberMe) {
      localStorage.setItem('user', JSON.stringify(user));
      sessionStorage.removeItem('user');
    } else {
      sessionStorage.setItem('user', JSON.stringify(user));
      localStorage.removeItem('user');
    }
    console.log('User logged in:', user);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentPage('dashboard');
    // Remove user from both storages
    localStorage.removeItem('user');
    sessionStorage.removeItem('user')
  };

  // Show nothing which checking auth state
  if (authLoading) {
    return null;
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <Router>
        <Login onLogin={handleLogin} />
      </Router>
    );
  }

  // Show main application if authenticated
  return (
    <Router>
      <AppContent
        currentUser={currentUser}
        isAuthenticated={isAuthenticated}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        handleLogout={handleLogout}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </Router>
  );
};

export default App;