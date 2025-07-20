import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
  type: NotificationType;
  title: string;
  message?: string;
  isVisible: boolean;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({
  type,
  title,
  message,
  isVisible,
  onClose,
  autoClose = true,
  duration = 4000
}) => {
  // ✅ Add debugging
  console.log('🔔 Notification render:', { type, title, message, isVisible });

  useEffect(() => {
    if (isVisible && autoClose) {
      console.log('⏰ Setting auto-close timer for', duration, 'ms');
      const timer = setTimeout(() => {
        console.log('⏰ Auto-closing notification');
        onClose();
      }, duration);

      return () => {
        console.log('⏰ Clearing timer');
        clearTimeout(timer);
      };
    }
  }, [isVisible, autoClose, duration, onClose]);

  // ✅ Add debugging for early return
  if (!isVisible) {
    console.log('👻 Notification not visible, returning null');
    return null;
  }

  console.log('✅ Notification is visible, rendering UI');

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-blue-800';
    }
  };

  return (
    <div 
      className="fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out"
      style={{ 
        zIndex: 9999,
        transform: 'translateX(0)',
        opacity: 1
      }}
    >
      <div className={`max-w-md w-full border rounded-lg shadow-lg p-4 ${getBackgroundColor()}`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-semibold ${getTextColor()}`}>
              {title}
            </h4>
            {message && (
              <p className={`mt-1 text-sm ${getTextColor()} opacity-90`}>
                {message}
              </p>
            )}
          </div>
          
          <button
            onClick={() => {
              console.log('❌ Close button clicked');
              onClose();
            }}
            className={`flex-shrink-0 ${getTextColor()} hover:opacity-70 transition-opacity`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;