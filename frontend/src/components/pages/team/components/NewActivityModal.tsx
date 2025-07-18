import React, { useState, useEffect } from 'react';
import { X, Calendar, AtSign, Send, Plus, Tag, Users, AlertCircle, Clock, Paperclip } from 'lucide-react';
import { UserService } from '../../event/service/userService';
import { EventService } from '../../event/service/eventService';

interface Event {
  id: string;
  name: string;
  date: string;
  status: string;
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
  onSubmit: (activity: {
    type: 'comment' | 'event';
    message: string;
    eventId?: string;
    mentions?: string[];
    tags?: string[];
  }) => void;
  currentUserId: string;
  loading: boolean;
  error: string | null;
}

const NewActivityModal: React.FC<NewActivityModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentUserId,
  loading,
  error,
}) => {
  // --- STATE ---
  const [message, setMessage] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedMentions, setSelectedMentions] = useState<TeamMember[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [showEventSelector, setShowEventSelector] = useState(false);
  const [showMentionSelector, setShowMentionSelector] = useState(false);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<TeamMember[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'event' | 'mention' | 'tag' | null>(null);

  // Determine activity type based on selection
  const activityType = selectedEvent ? 'event' : 'comment';

  // --- FETCH DATA ---
  useEffect(() => {
    if (isOpen) fetchEventsAndUsers();
  }, [isOpen]);

  const fetchEventsAndUsers = async () => {
    setLoadingData(true);
    setDataError(null);
    try {
      const eventsResponse = await EventService.getAllEvents();
      const rawEvents = eventsResponse?.data?.events || eventsResponse?.data || eventsResponse || [];
      const formattedEvents: Event[] = rawEvents.map((event: any) => ({
        id: event._id,
        name: event.title,
        date: new Date(event.startDate).toLocaleDateString(),
        status: event.status?.toLowerCase() || 'upcoming',
        description: event.description,
      }));
      setEvents(formattedEvents);

      const usersResponse = await UserService.getUsers();
      const rawUsers = (usersResponse as any)?.data || usersResponse || [];
      const formattedUsers: TeamMember[] = rawUsers.map((user: any) => ({
        id: user._id || user.id,
        name: `${user.firstName} ${user.lastName}`.trim(),
        role: user.role || 'Member',
        avatar: user.avatar,
        email: user.email,
      }));
      setUsers(formattedUsers);
    } catch (err) {
      setDataError('Failed to load events and users. Please try again.');
    } finally {
      setLoadingData(false);
    }
  };

  // --- HANDLERS ---
  const handleClose = () => {
    setMessage('');
    setSelectedEvent(null);
    setSelectedMentions([]);
    setTags([]);
    setNewTag('');
    setDataError(null);
    setActiveTab(null);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Validation for event activities
    if (activityType === 'event' && !selectedEvent?.id) {
      setDataError('Please select an event for event activities');
      return;
    }
    
    const activityData = {
      type: selectedEvent ? 'event' as const : 'comment' as const,
      message: message.trim(),
      eventId: selectedEvent?.id,
      mentions: selectedMentions.map(m => m.id),
      tags: tags.filter(tag => tag.trim() !== ''),
    };
    
    if (onSubmit) onSubmit(activityData);
  };

  const handleMentionToggle = (member: TeamMember) => {
    setSelectedMentions(prev =>
      prev.some(m => m.id === member.id)
        ? prev.filter(m => m.id !== member.id)
        : [...prev, member]
    );
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
  
  const setTab = (tab: 'event' | 'mention' | 'tag' | null) => {
    if (activeTab === tab) {
      setActiveTab(null);
    } else {
      setActiveTab(tab);
    }
  };

  if (!isOpen) return null;

  // --- UI ---
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="relative px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-center text-gray-800">
            {activityType === 'event' ? 'Share Event Update' : 'Create Team Post'}
          </h2>
          <button 
            onClick={handleClose} 
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        <form id="activity-form" onSubmit={handleSubmit}>
          {/* Main content area */}
          <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
            {/* Message input */}
            <div className="mb-4">
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={activityType === 'event' 
                  ? "Share an update about this event..." 
                  : "What's on your mind?"}
                rows={5}
                className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base"
                required
                maxLength={500}
              />
              <div className="mt-1 text-xs text-right text-gray-500">
                {message.length}/500
              </div>
            </div>

          {/* Selected Items Pills */}
          {(selectedEvent || selectedMentions.length > 0 || tags.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedEvent && (
                <span className="flex items-center px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-full">
                  <Calendar size={14} className="mr-1.5" />
                  {selectedEvent.name}
                  <button 
                    type="button" 
                    onClick={() => setSelectedEvent(null)} 
                    className="ml-2 text-emerald-600 hover:text-emerald-800"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
              
              {selectedMentions.map(member => (
                <span key={member.id} className="flex items-center px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded-full">
                  <AtSign size={14} className="mr-1.5" />
                  {member.name}
                  <button 
                    type="button" 
                    onClick={() => handleMentionToggle(member)} 
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
              
              {tags.map((tag, idx) => (
                <span key={idx} className="flex items-center px-3 py-1.5 bg-purple-50 border border-purple-200 text-purple-800 text-sm rounded-full">
                  <Tag size={14} className="mr-1.5" />
                  {tag}
                  <button 
                    type="button" 
                    onClick={() => removeTag(tag)} 
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}

            {/* Error/Loading Messages */}
            {(error || dataError) && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                <div className="flex items-center space-x-2 text-sm text-red-600">
                  <AlertCircle size={16} />
                  <span>{error || dataError}</span>
                </div>
              </div>
            )}
            
            {loadingData && (
              <div className="flex justify-center items-center p-4 text-sm text-gray-500">
                <span className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3" />
                Loading...
              </div>
            )}

            {/* Tab Selector Area */}
            <div className={`rounded-lg border border-gray-200 overflow-hidden ${activeTab ? 'mb-4' : ''}`}>
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => setTab('event')}
                  className={`flex items-center justify-center flex-1 px-4 py-3 text-sm font-medium transition ${
                    activeTab === 'event' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Calendar size={16} className="mr-2" />
                  {selectedEvent ? 'Change Event' : 'Add Event'}
                </button>
                
                <button
                  type="button"
                  onClick={() => setTab('mention')}
                  className={`flex items-center justify-center flex-1 px-4 py-3 text-sm font-medium transition ${
                    activeTab === 'mention' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <AtSign size={16} className="mr-2" />
                  {selectedMentions.length > 0 ? `Mentions (${selectedMentions.length})` : 'Mention'}
                </button>
                
                <button
                  type="button"
                  onClick={() => setTab('tag')}
                  className={`flex items-center justify-center flex-1 px-4 py-3 text-sm font-medium transition ${
                    activeTab === 'tag' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Tag size={16} className="mr-2" />
                  {tags.length > 0 ? `Tags (${tags.length})` : 'Tags'}
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'event' && (
                <div className="p-4 bg-gray-50">
                  <div className="mb-3">
                    <select
                      value={selectedEvent?.id || ''}
                      onChange={e => {
                        const event = events.find(ev => ev.id === e.target.value);
                        setSelectedEvent(event || null);
                      }}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={loadingData}
                    >
                      <option value="">{loadingData ? 'Loading events...' : 'Select an event...'}</option>
                      {events.map(event => (
                        <option key={event.id} value={event.id}>
                          {event.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {events.length > 0 && (
                    <div className="space-y-2 max-h-56 overflow-y-auto">
                      {events.slice(0, 5).map(event => (
                        <button
                          key={event.id}
                          type="button"
                          onClick={() => setSelectedEvent(event)}
                          className={`w-full flex items-start p-3 rounded-lg text-left transition ${
                            selectedEvent?.id === event.id 
                              ? 'bg-emerald-50 border border-emerald-200' 
                              : 'bg-white border border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                            <Calendar size={18} className="text-emerald-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium ${selectedEvent?.id === event.id ? 'text-emerald-800' : 'text-gray-900'}`}>
                              {event.name}
                            </p>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <Clock size={12} className="mr-1" />
                              {event.date}
                            </div>
                            {event.description && (
                              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{event.description}</p>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {events.length === 0 && !loadingData && (
                    <div className="text-center p-4 text-sm text-gray-500">
                      No events available
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'mention' && (
                <div className="p-4 bg-gray-50">
                  <div className="mb-3 relative">
                    <input
                      type="text"
                      placeholder="Search team members..."
                      className="w-full p-2.5 pr-8 bg-white border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Users size={16} className="absolute right-3 top-3 text-gray-400" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-56 overflow-y-auto">
                    {users.filter(u => u.id !== currentUserId).map(member => (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => handleMentionToggle(member)}
                        className={`flex items-center p-2 rounded-lg transition ${
                          selectedMentions.some(m => m.id === member.id)
                            ? 'bg-blue-50 border border-blue-200'
                            : 'hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                          {member.avatar ? (
                            <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full" />
                          ) : (
                            <span className="text-sm font-medium text-blue-600">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${
                            selectedMentions.some(m => m.id === member.id) ? 'text-blue-800' : 'text-gray-900'
                          }`}>
                            {member.name}
                          </p>
                          {member.role && (
                            <p className="text-xs text-gray-500">{member.role}</p>
                          )}
                        </div>
                        {selectedMentions.some(m => m.id === member.id) && (
                          <div className="ml-2 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                            <X size={12} className="text-blue-600" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  
                  {users.length === 0 && !loadingData && (
                    <div className="text-center p-4 text-sm text-gray-500">
                      No team members available
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'tag' && (
                <div className="p-4 bg-gray-50">
                  <div className="flex space-x-2 mb-3">
                    <input
                      id="tag-input"
                      type="text"
                      value={newTag}
                      onChange={e => setNewTag(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); }}}
                      placeholder="Add a tag..."
                      className="flex-1 p-2.5 bg-white border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button 
                      type="button" 
                      onClick={addTag} 
                      disabled={!newTag.trim()}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 transition"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  
                  {tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <div key={index} className="flex items-center px-3 py-1.5 bg-purple-50 border border-purple-200 text-purple-800 rounded-lg">
                          <Tag size={14} className="mr-1.5" />
                          <span>{tag}</span>
                          <button type="button" onClick={() => removeTag(tag)} className="ml-2 text-purple-600 hover:text-purple-800">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-sm text-gray-500 p-2">
                      No tags added yet. Tags help categorize your post.
                    </p>
                  )}
                  
                  {/* Suggested Tags */}
                  <div className="mt-4">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2">Suggested Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {['Announcement', 'Question', 'Update', 'Feedback', 'Help'].map((tag) => (
                        !tags.includes(tag) && (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setTags(prev => [...prev, tag])}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition flex items-center"
                          >
                            <Plus size={12} className="mr-1" />
                            {tag}
                          </button>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => setTab('event')}
                  className={`p-2 rounded-full ${selectedEvent ? 'text-emerald-600 bg-emerald-50' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <Calendar size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => setTab('mention')}
                  className={`p-2 rounded-full ${selectedMentions.length > 0 ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <AtSign size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => setTab('tag')}
                  className={`p-2 rounded-full ${tags.length > 0 ? 'text-purple-600 bg-purple-50' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <Tag size={20} />
                </button>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={
                    !message.trim() ||
                    loading ||
                    loadingData ||
                    (activityType === 'event' && !selectedEvent?.id)
                  }
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Posting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Post</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewActivityModal;