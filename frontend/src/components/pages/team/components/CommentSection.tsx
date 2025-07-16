import React, { useState } from 'react';
import { Activity } from '../types';
import { MessageCircle, Heart, Reply } from 'lucide-react';
import ActivityFeed from '../ActivityFeed';

interface CommentSectionProps {
  activities: Activity[];
  onLike: (activityId: string) => void;
  onPin: (activityId: string) => void;
  onReply: (activityId: string, content: string) => void;
  onAddComment: (content: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  activities,
  onLike,
  onPin,
  onReply,
  onAddComment
}) => {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const commentActivities = activities.filter(activity => activity.type === 'comment');

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    onAddComment(newComment);
    setNewComment('');
  };

  return (
    <div className="space-y-6">
      {/* Comments Feed */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <ActivityFeed
          activities={commentActivities}
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

export default CommentSection;