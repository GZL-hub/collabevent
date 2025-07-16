import React from 'react';
import { Activity } from '../types';
import { Activity as ActivityIcon, TrendingUp } from 'lucide-react';
import ActivityFeed from '../ActivityFeed';

interface AllActivitySectionProps {
  activities: Activity[];
  onLike: (activityId: string) => void;
  onPin: (activityId: string) => void;
  onReply: (activityId: string, content: string) => void;
}

const AllActivitySection: React.FC<AllActivitySectionProps> = ({
  activities,
  onLike,
  onPin,
  onReply
}) => {
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null);
  const [replyContent, setReplyContent] = React.useState('');

  const activityStats = {
    comments: activities.filter(a => a.type === 'comment').length,
    events: activities.filter(a => ['event_created', 'event_updated'].includes(a.type)).length,
    mentions: activities.filter(a => a.type === 'mention').length,
    files: activities.filter(a => a.type === 'file_uploaded').length,
    tasks: activities.filter(a => a.type === 'task_completed').length,
    total: activities.length
  };

  return (
    <div className="space-y-6">
      {/* Activity Feed */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-gray-800">Recent Activity</h4>
          <div className="flex items-center text-sm text-gray-500">
            <TrendingUp size={16} className="mr-1" />
            Live updates
          </div>
        </div>
        
        <ActivityFeed
          activities={activities}
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

export default AllActivitySection;