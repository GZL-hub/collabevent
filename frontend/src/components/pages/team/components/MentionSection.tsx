import React from 'react';
import { Activity } from '../types';
import { Bell, AtSign } from 'lucide-react';
import ActivityFeed from '../ActivityFeed';
interface MentionSectionProps {
  activities: Activity[];
  onLike: (activityId: string) => void;
  onPin: (activityId: string) => void;
  onReply: (activityId: string, content: string) => void;
}

const MentionSection: React.FC<MentionSectionProps> = ({
  activities,
  onLike,
  onPin,
  onReply
}) => {
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null);
  const [replyContent, setReplyContent] = React.useState('');

  const mentionActivities = activities.filter(activity => activity.type === 'mention');
  const unreadMentions = mentionActivities.filter(activity => !activity.isRead);

  return (
    <div className="space-y-6">
      {/* Mentions Feed */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4">All Mentions</h4>
        <ActivityFeed
          activities={mentionActivities}
          onLike={onLike}
          onPin={onPin}
          onReply={onReply}
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