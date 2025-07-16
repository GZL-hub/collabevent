import React from 'react';
import { Activity } from '../types';
import { Activity as ActivityIcon, TrendingUp } from 'lucide-react';
import ActivityFeed from '../ActivityFeed';

interface AllActivitySectionProps {
  activities: Activity[];
  onLike: (activityId: string) => void;
  onPin: (activityId: string) => void;
  onReply: (activityId: string, content: string) => void;
  onDeleteReply?: (activityId: string, replyId: string) => void;
  currentUserId?: string;
}

const AllActivitySection: React.FC<AllActivitySectionProps> = ({
  activities,
  onLike,
  onPin,
  onReply,
  onDeleteReply,
  currentUserId
}) => {
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null);
  const [replyContent, setReplyContent] = React.useState('');

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

export default AllActivitySection;