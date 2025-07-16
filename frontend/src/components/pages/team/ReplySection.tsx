import React from 'react';
import { Activity } from './types';
import { getInitials, formatTimestamp } from './utils';

interface ReplySectionProps {
  activity: Activity;
  replyingTo: string | null;
  setReplyingTo: (id: string | null) => void;
  replyContent: string;
  setReplyContent: (content: string) => void;
  onReply: (activityId: string, content: string) => void;
}

const ReplySection: React.FC<ReplySectionProps> = ({
  activity,
  replyingTo,
  setReplyingTo,
  replyContent,
  setReplyContent,
  onReply
}) => {
  const handleReply = () => {
    onReply(activity.id, replyContent);
  };

  return (
    <>
      {/* Existing Replies */}
      {activity.replies.length > 0 && (
        <div className="mt-4 space-y-3 border-l-2 border-gray-100 pl-4">
          {activity.replies.map(reply => (
            <div key={reply.id} className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs font-medium">
                {getInitials(reply.userName)}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-gray-700">{reply.userName}</span>
                  <span className="text-xs text-gray-500">{formatTimestamp(reply.timestamp)}</span>
                </div>
                <p className="text-xs text-gray-800 mt-1">{reply.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Reply Input */}
      {replyingTo === activity.id && (
        <div className="mt-3 flex space-x-2">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
            CU
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleReply()}
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => setReplyingTo(null)}
                className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleReply}
                disabled={!replyContent.trim()}
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:bg-gray-300"
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReplySection;