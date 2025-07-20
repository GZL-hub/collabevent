import React, { useState, useCallback } from 'react';
import { Activity } from './types';
import { MessageCircle } from 'lucide-react';
import ActivityItem from './ActivityItem';
import Notification, {NotificationType} from './components/Notifications';

interface ActivityFeedProps {
  activities: Activity[];
  onLike: (activityId: string) => void;
  onPin: (activityId: string) => void;
  onReply: (activityId: string, content: string) => void;
  onDelete?: (activityId: string) => Promise<void>;
  onDeleteReply?: (activityId: string, replyId: string) => void;
  currentUserId?: string;
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
  onDelete,
  replyingTo,
  setReplyingTo,
  replyContent,
  onDeleteReply,
  currentUserId,
  setReplyContent
}) => {
  const [notification, setNotification] = useState<{
    type: NotificationType;
    title: string;
    message?: string;
    isVisible: boolean;
  }>({
    type: 'info',
    title: '',
    message: '',
    isVisible: false
  });

  const showNotification = useCallback((type: NotificationType, title: string, message?: string) => {
    setNotification({
      type,
      title,
      message,
      isVisible: true
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  }, []);

  const handleDeleteWithNotification = useCallback(async (activityId: string) => {
    if (!onDelete) {
      return;
    }
    
    try {
      await onDelete(activityId);
      showNotification('success', 'Post Deleted', 'The post has been successfully deleted.');
    } catch (error) {
      console.error('Error deleting activity:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete the post. Please try again.';
      showNotification('error', 'Delete Failed', errorMessage);
    }
  }, [onDelete, showNotification]);

  const handleLikeWithNotification = useCallback((activityId: string) => {
    try {
      onLike(activityId);
    } catch (error) {
      showNotification('error', 'Action Failed', 'Failed to update like status.');
    }
  }, [onLike, showNotification]);

  const handlePinWithNotification = useCallback((activityId: string) => {
    try {
      onPin(activityId);
    } catch (error) {
      showNotification('error', 'Action Failed', 'Failed to update pin status.');
    }
  }, [onPin, showNotification]);

  const handleReplyWithNotification = useCallback((activityId: string, content: string) => {
    try {
      onReply(activityId, content);
      showNotification('success', 'Reply Added', 'Your reply has been posted successfully.');
    } catch (error) {
      showNotification('error', 'Reply Failed', 'Failed to post your reply. Please try again.');
    }
  }, [onReply, showNotification]);

  if (activities.length === 0) {
    return (
      <>
        <div className="text-center py-8">
          <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
          <p className="text-gray-500">Start by posting your first update or comment!</p>
        </div>

        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          isVisible={notification.isVisible}
          onClose={hideNotification}
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {activities.map(activity => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            onLike={handleLikeWithNotification}
            onPin={handlePinWithNotification}
            onReply={handleReplyWithNotification}
            onDelete={handleDeleteWithNotification}
            onDeleteReply={onDeleteReply}
            currentUserId={currentUserId}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
            replyContent={replyContent}
            setReplyContent={setReplyContent}
          />
        ))}
      </div>

      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </>
  );
};

export default ActivityFeed;