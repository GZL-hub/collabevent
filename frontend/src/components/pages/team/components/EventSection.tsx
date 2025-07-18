import React from 'react';
import { Activity } from '../types';
import { Calendar, Plus } from 'lucide-react';
import ActivityFeed from '../ActivityFeed';

interface EventSectionProps {
  activities: Activity[];
  onLike: (activityId: string) => void;
  onPin: (activityId: string) => void;
  onReply: (activityId: string, content: string) => void;
  onDeleteReply?: (activityId: string, replyId: string) => void;
  currentUserId?: string;
}

const EventSection: React.FC<EventSectionProps> = ({
  activities,
  onLike,
  onPin,
  onDeleteReply,
  currentUserId,
  onReply
}) => {
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null);
  const [replyContent, setReplyContent] = React.useState('');

  const eventActivities = activities.filter(activity => activity.type === 'event');

  const recentEvents = eventActivities.slice(0, 5);
  // const eventStats = {
  //   created: activities.filter(a => a.type === 'event_created').length,
  //   updated: activities.filter(a => a.type === 'event_updated').length,
  //   total: eventActivities.length
  // };

  return (
    <div className="space-y-6">
      {/* Event Activity Feed */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4">Recent Event Activity</h4>
        <ActivityFeed
          activities={eventActivities}
          onLike={onLike}
          onPin={onPin}
          onReply={onReply}
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

export default EventSection;