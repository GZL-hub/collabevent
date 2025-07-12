import React from 'react';
import { Clock, User, DollarSign, Calendar, MapPin } from 'lucide-react';

interface Activity {
  id: number;
  time: string;
  description: string;
  borderColor: string;
  bgColor: string;
  iconColor: string;
  icon: React.ReactNode;
  type: 'update' | 'create' | 'comment' | 'achievement' | 'booking';
}

const RecentActivity: React.FC = () => {
  const activities: Activity[] = [
    {
      id: 1,
      time: "Today, 10:30 AM",
      description: 'Jane updated "Product Launch" event details',
      borderColor: "border-indigo-500",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
      icon: <User size={16} />,
      type: 'update'
    },
    {
      id: 2,
      time: "Yesterday, 2:15 PM",
      description: 'New event "Team Building" created by Mark',
      borderColor: "border-green-500",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      icon: <Calendar size={16} />,
      type: 'create'
    },
    {
      id: 3,
      time: "Yesterday, 11:00 AM",
      description: 'Sarah commented on "Quarterly Meeting"',
      borderColor: "border-blue-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      icon: <User size={16} />,
      type: 'comment'
    },
    {
      id: 4,
      time: "2 days ago, 3:45 PM",
      description: "Revenue target of $50k achieved for Q2",
      borderColor: "border-orange-500",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      icon: <DollarSign size={16} />,
      type: 'achievement'
    },
    {
      id: 5,
      time: "3 days ago, 9:20 AM",
      description: "Conference venue booking confirmed",
      borderColor: "border-purple-500",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      icon: <MapPin size={16} />,
      type: 'booking'
    }
  ];

  const getActivityTypeLabel = (type: string) => {
    const labels = {
      update: 'Updated',
      create: 'Created',
      comment: 'Commented',
      achievement: 'Achievement',
      booking: 'Booking'
    };
    return labels[type as keyof typeof labels] || '';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <Clock size={14} />
          <span>Live updates</span>
        </div>
      </div>
      
      <div className="flex-grow space-y-3">
        {activities.map((activity, index) => (
          <div 
            key={activity.id} 
            className={`relative pl-12 pr-4 py-3 rounded-lg border-l-4 ${activity.borderColor} ${activity.bgColor} hover:shadow-sm transition-shadow duration-200`}
          >
            {/* Icon */}
            <div className={`absolute left-3 top-3 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm ${activity.iconColor}`}>
              {activity.icon}
            </div>
            
            {/* Activity Type Badge */}
            <div className="flex items-center justify-between mb-1">
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${activity.bgColor} ${activity.iconColor} border border-current border-opacity-20`}>
                {getActivityTypeLabel(activity.type)}
              </span>
              <span className="text-xs text-gray-500 flex items-center space-x-1">
                <Clock size={10} />
                <span>{activity.time}</span>
              </span>
            </div>
            
            {/* Description */}
            <p className="text-sm text-gray-700 leading-relaxed">
              {activity.description}
            </p>
            
            {/* Timeline connector line */}
            {index < activities.length - 1 && (
              <div className="absolute left-5 bottom-0 w-0.5 h-3 bg-gray-200 transform translate-y-full"></div>
            )}
          </div>
        ))}
      </div>
      
      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Showing last 5 activities</span>
          <button className="text-indigo-600 hover:text-indigo-800 font-medium">
            View all activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;