import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Calendar, AtSign, Send, Plus, Tag, Users, AlertCircle } from 'lucide-react';
import { useActivities } from '../hook/activityHook';
import { UserService } from '../../event/service/userService';
import { EventService } from '../../event/service/eventService';

interface Event {
  id: string;
  name: string;
  date: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  description?: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  email?: string;
}

interface NewActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (activity: any) => void;
  teamMembers?: TeamMember[];
  currentUserId: string;
}

const NewActivityModal: React.FC<NewActivityModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  teamMembers = [],
  currentUserId
}) => {
  const { createActivity, loading, error } = useActivities();
  
  // Form state
  const [activityType, setActivityType] = useState<'comment' | 'event' | 'mention'>('comment');
  const [message, setMessage] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedMentions, setSelectedMentions] = useState<TeamMember[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  
  // Data state
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<TeamMember[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  // Fetch events and users when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchEventsAndUsers();
    }
  }, [isOpen]);

  const fetchEventsAndUsers = async () => {
    setLoadingData(true);
    setDataError(null);
    
    try {
      // Fetch events using the correct method name
      const eventsResponse = await EventService.getAllEvents();
      
      // Handle different response structures for events
      if (eventsResponse.success && Array.isArray(eventsResponse.data)) {
        const formattedEvents = eventsResponse.data.map((event: any) => ({
          id: event._id,
          name: event.title,
          date: new Date(event.startDate).toLocaleDateString(),
          status: event.status?.toLowerCase() as 'upcoming' | 'ongoing' | 'completed' || 'upcoming',
          description: event.description
        }));
        setEvents(formattedEvents);
      } else if (Array.isArray(eventsResponse)) {
        // Handle case where response is directly an array
        const formattedEvents = eventsResponse.map((event: any) => ({
          id: event._id,
          name: event.title,
          date: new Date(event.startDate).toLocaleDateString(),
          status: event.status?.toLowerCase() as 'upcoming' | 'ongoing' | 'completed' || 'upcoming',
          description: event.description
        }));
        setEvents(formattedEvents);
      }

      // Fix: UserService.getUsers() returns User[] directly, not wrapped in response object
      const usersResponse = await UserService.getUsers();
      
      // Handle users response - it's directly an array
      if (Array.isArray(usersResponse)) {
        const formattedUsers = usersResponse.map((user: any) => ({
          id: user._id || user.id,
          name: `${user.firstName} ${user.lastName}`.trim(),
          role: user.role || 'Member',
          avatar: user.avatar,
          email: user.email
        }));
        setUsers(formattedUsers);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setDataError('Failed to load events and users. Please try again.');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;

    try {
      const activityData = {
        type: activityType,
        message: message.trim(),
        userId: currentUserId,
        eventId: selectedEvent?.id,
        mentions: selectedMentions.map(m => m.id),
        tags: tags.filter(tag => tag.trim() !== '')
      };

      const newActivity = await createActivity(activityData);
      
      if (onSubmit) {
        onSubmit(newActivity);
      }
      
      handleClose();
    } catch (err) {
      console.error('Error creating activity:', err);
      // Error is handled by the hook and displayed in the UI
    }
  };

  const handleClose = () => {
    setActivityType('comment');
    setMessage('');
    setSelectedEvent(null);
    setSelectedMentions([]);
    setTags([]);
    setNewTag('');
    setDataError(null);
    onClose();
  };

  const handleMentionToggle = (member: TeamMember) => {
    setSelectedMentions(prev => {
      const isSelected = prev.some(m => m.id === member.id);
      if (isSelected) {
        return prev.filter(m => m.id !== member.id);
      } else {
        return [...prev, member];
      }
    });
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (e.currentTarget.id === 'tag-input') {
        addTag();
      } else {
        handleSubmit(e);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageCircle size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">New Activity</h2>
              <p className="text-sm text-gray-600">Share updates with your team</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Data Loading Error */}
          {dataError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle size={16} className="text-red-600" />
                <div className="text-sm text-red-600">{dataError}</div>
              </div>
              <button
                type="button"
                onClick={fetchEventsAndUsers}
                className="mt-2 text-sm text-red-600 underline hover:text-red-800"
              >
                Try again
              </button>
            </div>
          )}

          {/* Activity Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Activity Type</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { type: 'comment' as const, icon: MessageCircle, label: 'Comment', color: 'blue' },
                { type: 'event' as const, icon: Calendar, label: 'Event Update', color: 'green' },
                { type: 'mention' as const, icon: AtSign, label: 'Mention', color: 'purple' }
              ].map(({ type, icon: Icon, label, color }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setActivityType(type)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    activityType === type
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon size={24} className={`mx-auto mb-2 ${
                    activityType === type ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <div className={`text-sm font-medium ${
                    activityType === type ? 'text-blue-700' : 'text-gray-600'
                  }`}>
                    {label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Event Selection (if event type) */}
          {activityType === 'event' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Event
              </label>
              <select
                value={selectedEvent?.id || ''}
                onChange={(e) => {
                  const event = events.find(ev => ev.id === e.target.value);
                  setSelectedEvent(event || null);
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loadingData}
              >
                <option value="">Select an event...</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>
                    {event.name} - {event.date}
                  </option>
                ))}
              </select>
              {loadingData && (
                <div className="text-xs text-gray-500 mt-1">Loading events...</div>
              )}
              {events.length === 0 && !loadingData && (
                <div className="text-xs text-gray-500 mt-1">No events available</div>
              )}
            </div>
          )}

          {/* Team Members for Mentions */}
          {(activityType === 'mention' || selectedMentions.length > 0) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Mention Team Members
              </label>
              {users.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {users.filter(user => user.id !== currentUserId).map(member => (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => handleMentionToggle(member)}
                        className={`p-2 rounded-lg text-left transition-colors ${
                          selectedMentions.some(m => m.id === member.id)
                            ? 'bg-purple-100 border border-purple-300'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <Users size={14} className="text-purple-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{member.name}</div>
                            <div className="text-xs text-gray-500">{member.role}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {selectedMentions.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-600 mb-1">Selected members:</div>
                      <div className="flex flex-wrap gap-1">
                        {selectedMentions.map(member => (
                          <span
                            key={member.id}
                            className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                          >
                            {member.name}
                            <button
                              type="button"
                              onClick={() => handleMentionToggle(member)}
                              className="ml-1 text-purple-600 hover:text-purple-800"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-sm text-gray-500 py-4 text-center border border-gray-200 rounded-lg">
                  {loadingData ? 'Loading team members...' : 'No team members available'}
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="flex space-x-2 mb-2">
              <input
                id="tag-input"
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                type="button"
                onClick={addTag}
                disabled={!newTag.trim() || tags.includes(newTag.trim())}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <Plus size={16} />
              </button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    <Tag size={10} className="mr-1" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What's happening with your team?"
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle size={16} className="text-red-600" />
                <div className="text-sm text-red-600">{error}</div>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={!message.trim() || loading || loadingData}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={16} />
            )}
            <span>{loading ? 'Posting...' : 'Post Activity'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewActivityModal;