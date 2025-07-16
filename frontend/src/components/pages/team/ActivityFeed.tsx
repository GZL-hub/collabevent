import React from 'react';
import { Activity, Reply } from './types';
import { MessageCircle } from 'lucide-react';
import ActivityItem from './ActivityItem';

interface ActivityFeedProps {
  activities: Activity[];
  onLike: (activityId: string) => void;
  onPin: (activityId: string) => void;
  onReply: (activityId: string, content: string) => void;
  replyingTo: string | null;
  setReplyingTo: (id: string | null) => void;
  replyContent: string;
  setReplyContent: (content: string) => void;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  onLike,
  onPin,
  onReply,
  replyingTo,
  setReplyingTo,
  replyContent,
  setReplyContent
}) => {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
        <p className="text-gray-500">Start by posting your first update or comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {activities.map(activity => (
        <ActivityItem
          key={activity.id}
          activity={activity}
          onLike={onLike}
          onPin={onPin}
          onReply={onReply}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          replyContent={replyContent}
          setReplyContent={setReplyContent}
        />
      ))}
    </div>
  );
};

export default ActivityFeed;