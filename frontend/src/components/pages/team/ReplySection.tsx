import React from 'react';
import { Trash2, Send } from 'lucide-react';
import { Activity } from './types';

interface ReplySectionProps {
  activity: Activity;
  replyingTo: string | null;
  setReplyingTo: (id: string | null) => void;
  replyContent: string;
  setReplyContent: (content: string) => void;
  onReply: (activityId: string, content: string) => void;
  onDeleteReply?: (activityId: string, replyId: string) => void;
  currentUserId?: string;
}

const ReplySection: React.FC<ReplySectionProps> = ({
  activity,
  replyingTo,
  setReplyingTo,
  replyContent,
  setReplyContent,
  onReply,
  onDeleteReply,
  currentUserId
}) => {
  const activityId = activity._id || activity.id || '';
  
  const handleReply = () => {
    if (!replyContent.trim()) return;
    
    onReply(activityId, replyContent.trim());
    setReplyContent('');
    setReplyingTo(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleReply();
    }
  };

  // THIS IS THE MISSING DELETE FUNCTION IMPLEMENTATION
  const handleDeleteReply = async (replyId: string) => {
    if (!onDeleteReply) {
      console.log('Delete function not available');
      return;
    }
    
    const confirmed = window.confirm('Are you sure you want to delete this reply?');
    if (!confirmed) return;
    
    try {
      await onDeleteReply(activityId, replyId);
      console.log('Reply deleted successfully');
    } catch (err) {
      console.error('Error deleting reply:', err);
      alert('Failed to delete reply. Please try again.');
    }
  };

  return (
    <>
      {/* Existing Replies */}
      {activity.replies && activity.replies.length > 0 && (
        <div className="mt-4 space-y-3 border-l-2 border-gray-100 pl-4">
          {activity.replies.map((reply) => {
            const replyId = reply._id || reply.id || `reply-${Date.now()}`;
            const isOwnReply = currentUserId && reply.userId === currentUserId;
            
            return (
              <div key={replyId} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                {/* User Avatar */}
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-purple-600">
                    {reply.userName?.split(' ').map(n => n[0]).join('') || 'U'}
                  </span>
                </div>
                
                {/* Reply Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {reply.userName || 'Unknown User'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(reply.timestamp).toLocaleString()}
                      </span>
                      {isOwnReply && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                          You
                        </span>
                      )}
                    </div>
                    
                    {/* THIS IS THE ACTUAL DELETE BUTTON IMPLEMENTATION */}
                    {isOwnReply && onDeleteReply && (
                      <button
                        onClick={() => handleDeleteReply(replyId)}
                        className="flex items-center justify-center w-6 h-6 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete your reply"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mt-1">
                    {reply.message || reply.content || 'No message'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Reply Input */}
      {replyingTo === activityId ? (
        <div className="mt-3 flex space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-medium text-blue-600">You</span>
          </div>
          <div className="flex-1">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Write a reply..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => setReplyingTo(null)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReply}
                disabled={!replyContent.trim()}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors flex items-center space-x-1"
              >
                <Send size={14} />
                <span>Reply</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setReplyingTo(activityId)}
          className="mt-3 text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          💬 Reply to this activity
        </button>
      )}
    </>
  );
};

export default ReplySection;