import React from 'react';
import { Activity } from '../types';
import { Bell, AtSign } from 'lucide-react';
import ActivityFeed from '../ActivityFeed';

interface MentionSectionProps {
  activities: Activity[];
  onLike: (activityId: string) => void;
  onPin: (activityId: string) => void;
  onReply: (activityId: string, content: string) => void;
  onDelete: (activityId: string) => void;
  onDeleteReply?: (activityId: string, replyId: string) => void;
  currentUserId?: string;
}

const MentionSection: React.FC<MentionSectionProps> = ({
  activities,
  onLike,
  onPin,
  onDelete,
  onDeleteReply,
  currentUserId,
  onReply
}) => {
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null);
  const [replyContent, setReplyContent] = React.useState('');

  const mentionActivities = activities.filter(activity => activity.type === 'mention');

  return (
    <div className="space-y-6">
      {/* Mentions Feed */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4">All Mentions</h4>
        <ActivityFeed
          activities={mentionActivities} // Fix: Use mentionActivities instead of filtering for comments
          onLike={onLike}
          onPin={onPin}
          onReply={onReply}
          onDelete={onDelete}
          onDeleteReply={onDeleteReply}
          currentUserId={currentUserId}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          replyContent={replyContent}
          setReplyContent={setReplyContent}
        />
      </div>
    </div>
  );
};

export default MentionSection;