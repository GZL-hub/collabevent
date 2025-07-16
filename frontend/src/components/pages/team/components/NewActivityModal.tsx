import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  AtSign, 
  MessageCircle, 
  Search,
  ChevronDown,
  User,
  Tag,
  Send
} from 'lucide-react';

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
}

interface NewActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (activity: {
    type: 'comment' | 'event_updated' | 'mention';
    content: string;
    eventId?: string;
    eventName?: string;
    mentions?: string[];
    tags?: string[];
  }) => void;
  teamMembers: TeamMember[];
}

const NewActivityModal: React.FC<NewActivityModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  teamMembers
}) => {
  const [content, setContent] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [mentions, setMentions] = useState<TeamMember[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [activityType, setActivityType] = useState<'comment' | 'event_updated' | 'mention'>('comment');
  
  // Dropdown states
  const [showEventDropdown, setShowEventDropdown] = useState(false);
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [eventSearchTerm, setEventSearchTerm] = useState('');
  const [mentionSearchTerm, setMentionSearchTerm] = useState('');
  const [currentTag, setCurrentTag] = useState('');

  // Mock events data
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Mock events - replace with API call
    setEvents([
      {
        id: '1',
        name: 'Product Launch',
        date: '2025-07-20T10:00:00Z',
        status: 'upcoming',
        description: 'Launch event for our new product line'
      },
      {
        id: '2',
        name: 'Customer Webinar',
        date: '2025-07-18T14:00:00Z',
        status: 'ongoing',
        description: 'Monthly customer engagement webinar'
      },
      {
        id: '3',
        name: 'Team Building',
        date: '2025-07-25T09:00:00Z',
        status: 'upcoming',
        description: 'Quarterly team building activities'
      },
      {
        id: '4',
        name: 'Annual Conference',
        date: '2025-07-10T08:00:00Z',
        status: 'completed',
        description: 'Annual company conference'
      }
    ]);
  }, []);

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(eventSearchTerm.toLowerCase())
  );

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(mentionSearchTerm.toLowerCase()) &&
    !mentions.find(m => m.id === member.id)
  );

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setShowEventDropdown(false);
    setEventSearchTerm('');
    
    // Auto-set activity type based on selection
    if (activityType === 'comment') {
      setActivityType('event_updated');
    }
  };

  const handleMentionSelect = (member: TeamMember) => {
    setMentions(prev => [...prev, member]);
    setShowMentionDropdown(false);
    setMentionSearchTerm('');
    
    // Auto-add mention to content
    const mentionText = `@${member.name} `;
    setContent(prev => prev + mentionText);
    
    // Auto-set activity type to mention if not already set
    if (activityType === 'comment' && !selectedEvent) {
      setActivityType('mention');
    }
  };

  const handleRemoveMention = (memberId: string) => {
    const member = mentions.find(m => m.id === memberId);
    if (member) {
      setMentions(prev => prev.filter(m => m.id !== memberId));
      // Remove mention from content
      setContent(prev => prev.replace(`@${member.name} `, ''));
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags(prev => [...prev, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    if (!content.trim()) return;

    const activityData = {
      type: activityType,
      content: content.trim(),
      eventId: selectedEvent?.id,
      eventName: selectedEvent?.name,
      mentions: mentions.map(m => m.id),
      tags: tags.length > 0 ? tags : undefined
    };

    onSubmit(activityData);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setContent('');
    setSelectedEvent(null);
    setMentions([]);
    setTags([]);
    setActivityType('comment');
    setEventSearchTerm('');
    setMentionSearchTerm('');
    setCurrentTag('');
    setShowEventDropdown(false);
    setShowMentionDropdown(false);
  };

  const getEventStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-lg backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <MessageCircle size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Create New Activity</h3>
                <p className="text-sm text-gray-600">Share an update with your team</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[calc(90vh-140px)] overflow-y-auto">
          <div className="space-y-6">
            {/* Activity Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Activity Type</label>
              <div className="flex space-x-3">
                <button
                  onClick={() => setActivityType('comment')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activityType === 'comment' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  💬 General Comment
                </button>
                <button
                  onClick={() => setActivityType('event_updated')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activityType === 'event_updated' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📅 Event Update
                </button>
                <button
                  onClick={() => setActivityType('mention')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activityType === 'mention' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  @️ Mention
                </button>
              </div>
            </div>

            {/* Event Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Event (Optional)
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowEventDropdown(!showEventDropdown)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-left flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span className={selectedEvent ? 'text-gray-800' : 'text-gray-500'}>
                      {selectedEvent ? selectedEvent.name : 'Choose an event...'}
                    </span>
                  </div>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>

                {showEventDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    <div className="p-3 border-b border-gray-200">
                      <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search events..."
                          value={eventSearchTerm}
                          onChange={(e) => setEventSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {filteredEvents.map(event => (
                        <button
                          key={event.id}
                          onClick={() => handleEventSelect(event)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between group"
                        >
                          <div>
                            <div className="font-medium text-gray-800 group-hover:text-blue-600">
                              {event.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(event.date).toLocaleDateString()}
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventStatusColor(event.status)}`}>
                            {event.status}
                          </span>
                        </button>
                      ))}
                      {filteredEvents.length === 0 && (
                        <div className="px-4 py-3 text-gray-500 text-sm">No events found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {selectedEvent && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-blue-800">{selectedEvent.name}</div>
                      <div className="text-sm text-blue-600">
                        {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mentions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mention Team Members
              </label>
              
              {mentions.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {mentions.map(member => (
                    <div key={member.id} className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-full px-3 py-1">
                      <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {getInitials(member.name)}
                      </div>
                      <span className="text-sm text-red-800">{member.name}</span>
                      <button
                        onClick={() => handleRemoveMention(member.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="relative">
                <button
                  onClick={() => setShowMentionDropdown(!showMentionDropdown)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-left flex items-center space-x-2 text-gray-500"
                >
                  <AtSign size={16} />
                  <span>Add team members...</span>
                </button>

                {showMentionDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    <div className="p-3 border-b border-gray-200">
                      <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search team members..."
                          value={mentionSearchTerm}
                          onChange={(e) => setMentionSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {filteredMembers.map(member => (
                        <button
                          key={member.id}
                          onClick={() => handleMentionSelect(member)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {getInitials(member.name)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{member.name}</div>
                            <div className="text-sm text-gray-500">{member.role}</div>
                          </div>
                        </button>
                      ))}
                      {filteredMembers.length === 0 && (
                        <div className="px-4 py-3 text-gray-500 text-sm">No team members found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (Optional)
              </label>
              
              {tags.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <div key={tag} className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1">
                      <Tag size={12} className="text-gray-600" />
                      <span className="text-sm text-gray-700">#{tag}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="Add a tag..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddTag}
                  disabled={!currentTag.trim()}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Message *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  selectedEvent 
                    ? `Share an update about ${selectedEvent.name}...`
                    : mentions.length > 0
                    ? `What would you like to tell ${mentions.map(m => m.name).join(', ')}?`
                    : "What's on your mind?"
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4}
              />
              <div className="mt-2 text-sm text-gray-500">
                {content.length}/500 characters
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedEvent && `Posting to: ${selectedEvent.name}`}
              {mentions.length > 0 && ` • ${mentions.length} mention${mentions.length > 1 ? 's' : ''}`}
              {tags.length > 0 && ` • ${tags.length} tag${tags.length > 1 ? 's' : ''}`}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!content.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <Send size={16} />
                <span>Post Activity</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewActivityModal;