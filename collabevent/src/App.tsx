import React, { useState } from 'react'
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Bell, 
  Users, 
  Settings, 
  Grid, 
  Clock, 
  LogOut,
  Menu
} from 'lucide-react'

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-indigo-800 text-white transition-all duration-300 ease-in-out`}>
        <div className="flex items-center justify-between p-4 border-b border-indigo-700">
          {isSidebarOpen ? (
            <h1 className="text-xl font-semibold">Event Manager</h1>
          ) : (
            <h1 className="text-xl font-semibold">EM</h1>
          )}
          <button onClick={toggleSidebar} className="p-1 rounded-full hover:bg-indigo-700">
            {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <SidebarItem 
              icon={<Grid size={20} />} 
              text="Dashboard" 
              isOpen={isSidebarOpen} 
              isActive={currentPage === 'dashboard'}
              onClick={() => setCurrentPage('dashboard')} 
            />
            <SidebarItem 
              icon={<Calendar size={20} />} 
              text="Events" 
              isOpen={isSidebarOpen} 
              isActive={currentPage === 'events'}
              onClick={() => setCurrentPage('events')} 
            />
            <SidebarItem 
              icon={<Clock size={20} />} 
              text="Calendar" 
              isOpen={isSidebarOpen} 
              isActive={currentPage === 'calendar'}
              onClick={() => setCurrentPage('calendar')} 
            />
            <SidebarItem 
              icon={<Bell size={20} />} 
              text="Notifications" 
              isOpen={isSidebarOpen} 
              isActive={currentPage === 'notifications'}
              onClick={() => setCurrentPage('notifications')} 
            />
            <SidebarItem 
              icon={<Users size={20} />} 
              text="Team Activity" 
              isOpen={isSidebarOpen} 
              isActive={currentPage === 'team'}
              onClick={() => setCurrentPage('team')} 
            />
            <SidebarItem 
              icon={<Settings size={20} />} 
              text="Settings" 
              isOpen={isSidebarOpen} 
              isActive={currentPage === 'settings'}
              onClick={() => setCurrentPage('settings')} 
            />
          </ul>
          
          <div className="absolute bottom-4 w-full left-0 px-4">
            <SidebarItem 
              icon={<LogOut size={20} />} 
              text="Logout" 
              isOpen={isSidebarOpen} 
              isActive={false}
              onClick={() => console.log('Logout clicked')} 
            />
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <button className="md:hidden p-2" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
          </h1>
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-full hover:bg-gray-100 relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
            </button>
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white">
              U
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {currentPage === 'dashboard' && <DashboardContent />}
          {currentPage === 'events' && <EventsContent />}
          {currentPage === 'calendar' && <CalendarContent />}
          {currentPage === 'notifications' && <NotificationsContent />}
          {currentPage === 'team' && <TeamActivityContent />}
          {currentPage === 'settings' && <SettingsContent />}
        </main>
      </div>
    </div>
  )
}

// Sidebar Item Component
interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  isOpen: boolean;
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, isOpen, isActive, onClick }) => {
  return (
    <li 
      className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors 
      ${isActive ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <span>{icon}</span>
        {isOpen && <span className="ml-3">{text}</span>}
      </div>
    </li>
  );
};

// Dashboard Content (Overview)
const DashboardContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-800">Total Events</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">24</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-800">Upcoming Events</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">8</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-800">Team Members</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">12</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-indigo-500 pl-4 py-2">
            <p className="text-sm text-gray-500">Today, 10:30 AM</p>
            <p className="text-gray-800">Jane updated "Product Launch" event details</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <p className="text-sm text-gray-500">Yesterday, 2:15 PM</p>
            <p className="text-gray-800">New event "Team Building" created by Mark</p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <p className="text-sm text-gray-500">Yesterday, 11:00 AM</p>
            <p className="text-gray-800">Sarah commented on "Quarterly Meeting"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Events Content (CRUD Interface)
const EventsContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">All Events</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          Create New Event
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">Product Launch</td>
              <td className="px-6 py-4 whitespace-nowrap">July 15, 2025 • 10:00 AM</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">JD</div>
                  <span className="ml-2">Jane Doe</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                <button className="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">Team Building</td>
              <td className="px-6 py-4 whitespace-nowrap">July 20, 2025 • 9:00 AM</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-medium">MS</div>
                  <span className="ml-2">Mark Smith</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                <button className="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Placeholder components for other pages
const CalendarContent: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Calendar View</h2>
    <p className="text-gray-600">Calendar implementation will go here.</p>
  </div>
);

const NotificationsContent: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Notifications</h2>
    <div className="space-y-4">
      <div className="p-4 border-l-4 border-indigo-500 bg-indigo-50 rounded-r-lg">
        <p className="font-medium">Event Update</p>
        <p className="text-sm text-gray-600">The "Product Launch" event has been updated</p>
        <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
      </div>
      <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
        <p className="font-medium">New Comment</p>
        <p className="text-sm text-gray-600">Sarah commented on "Quarterly Meeting"</p>
        <p className="text-xs text-gray-500 mt-1">Yesterday</p>
      </div>
    </div>
  </div>
);

const TeamActivityContent: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Team Activity Log</h2>
    <div className="space-y-6">
      <div className="border-b pb-4">
        <p className="text-sm text-gray-500">July 8, 2025</p>
        <div className="mt-2 space-y-3">
          <div className="flex items-start">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium mr-3">JD</div>
            <div>
              <p className="text-gray-800">Jane updated "Product Launch" event details</p>
              <p className="text-xs text-gray-500">10:30 AM</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium mr-3">TS</div>
            <div>
              <p className="text-gray-800">Tom added a comment to "Customer Webinar"</p>
              <p className="text-xs text-gray-500">9:15 AM</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-b pb-4">
        <p className="text-sm text-gray-500">July 7, 2025</p>
        <div className="mt-2 space-y-3">
          <div className="flex items-start">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-medium mr-3">MS</div>
            <div>
              <p className="text-gray-800">Mark created "Team Building" event</p>
              <p className="text-xs text-gray-500">2:15 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SettingsContent: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Settings</h2>
    <p className="text-gray-600">Settings panel will go here.</p>
  </div>
);

export default App