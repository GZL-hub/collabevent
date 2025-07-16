import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { Activity, TeamMember, FilterType, Reply } from './types';

// Import modular components
import AllActivitySection from './components/AllActivitySection';
import CommentSection from './components/CommentSection';
import EventSection from './components/EventSection';
import MentionSection from './components/MentionSection';
import NewActivityModal from './components/NewActivityModal';

const TeamActivityContent: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewActivityModalOpen, setIsNewActivityModalOpen] = useState(false);

  // Mock data - replace with API calls
  useEffect(() => {
    setTeamMembers([
      { id: '1', name: 'Jane Doe', role: 'Event Manager', status: 'online' },
      { id: '2', name: 'Tom Smith', role: 'Coordinator', status: 'online' },
      { id: '3', name: 'Mark Johnson', role: 'Team Lead', status: 'away' },
      { id: '4', name: 'Sarah Wilson', role: 'Designer', status: 'offline' },
    ]);

    setActivities([
      {
        id: '1',
        type: 'event_updated',
        userId: '1',
        userName: 'Jane Doe',
        content: 'Updated the venue location and added catering requirements',
        eventName: 'Product Launch',
        timestamp: '2025-07-16T10:30:00Z',
        likes: 3,
        replies: [
          {
            id: 'r1',
            userId: '2',
            userName: 'Tom Smith',
            content: 'Great! The new venue looks perfect for our needs.',
            timestamp: '2025-07-16T10:45:00Z'
          }
        ],
        isPinned: true,
        tags: ['venue', 'catering']
      },
      {
        id: '2',
        type: 'comment',
        userId: '2',
        userName: 'Tom Smith',
        content: 'I think we should add a networking session after the main presentation. What does everyone think?',
        eventName: 'Customer Webinar',
        timestamp: '2025-07-16T09:15:00Z',
        likes: 5,
        replies: [],
        tags: ['networking', 'suggestion']
      },
      {
        id: '3',
        type: 'event_created',
        userId: '3',
        userName: 'Mark Johnson',
        content: 'Created a new team building event for next Friday',
        eventName: 'Team Building',
        timestamp: '2025-07-15T14:15:00Z',
        likes: 8,
        replies: []
      },
      {
        id: '4',
        type: 'mention',
        userId: '4',
        userName: 'Sarah Wilson',
        content: '@Jane Doe Could you review the design mockups I shared? Need your feedback by EOD.',
        timestamp: '2025-07-15T11:20:00Z',
        likes: 1,
        replies: []
      }
    ]);
  }, []);

  // Event handlers
  const handleAddComment = (content: string) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      type: 'comment',
      userId: 'current-user',
      userName: 'Current User',
      content,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: []
    };

    setActivities(prev => [newActivity, ...prev]);
  };

  const handleNewActivity = (activityData: {
    type: 'comment' | 'event_updated' | 'mention';
    content: string;
    eventId?: string;
    eventName?: string;
    mentions?: string[];
    tags?: string[];
  }) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      type: activityData.type,
      userId: 'current-user',
      userName: 'Current User',
      content: activityData.content,
      eventName: activityData.eventName,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: [],
      tags: activityData.tags
    };

    setActivities(prev => [newActivity, ...prev]);
  };

  const handleReply = (activityId: string, content: string) => {
    const newReply: Reply = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'Current User',
      content,
      timestamp: new Date().toISOString()
    };

    setActivities(prev =>
      prev.map(activity =>
        activity.id === activityId
          ? { ...activity, replies: [...activity.replies, newReply] }
          : activity
      )
    );
  };

  const handleLike = (activityId: string) => {
    setActivities(prev =>
      prev.map(activity =>
        activity.id === activityId
          ? { 
              ...activity, 
              likes: activity.isLiked ? activity.likes - 1 : activity.likes + 1,
              isLiked: !activity.isLiked 
            }
          : activity
      )
    );
  };

  const handlePin = (activityId: string) => {
    setActivities(prev =>
      prev.map(activity =>
        activity.id === activityId
          ? { ...activity, isPinned: !activity.isPinned }
          : activity
      )
    );
  };

  // Filter activities based on search term
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activity.eventName && activity.eventName.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  // Render appropriate section based on filter
  const renderActivitySection = () => {
    const commonProps = {
      activities: filteredActivities,
      onLike: handleLike,
      onPin: handlePin,
      onReply: handleReply
    };

    switch (filter) {
      case 'comments':
        return <CommentSection {...commonProps} onAddComment={handleAddComment} />;
      case 'events':
        return <EventSection {...commonProps} />;
      case 'mentions':
        return <MentionSection {...commonProps} />;
      default:
        return <AllActivitySection {...commonProps} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Team Activity</h2>
            <p className="text-gray-600 mt-1">Stay connected with your team's latest updates</p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setIsNewActivityModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>New Update</span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Activity
            </button>
            <button
              onClick={() => setFilter('comments')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'comments' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Comments
            </button>
            <button
              onClick={() => setFilter('events')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'events' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setFilter('mentions')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'mentions' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Mentions
            </button>
          </div>
          
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Activity Content - Full Width */}
      <div>
        {renderActivitySection()}
      </div>

      {/* New Activity Modal */}
      <NewActivityModal
        isOpen={isNewActivityModalOpen}
        onClose={() => setIsNewActivityModalOpen(false)}
        onSubmit={handleNewActivity}
        teamMembers={teamMembers}
      />
    </div>
  );
};

export default TeamActivityContent;