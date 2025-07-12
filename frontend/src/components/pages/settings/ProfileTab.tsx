import React, { useState, useEffect } from 'react';
import { Camera, Save } from 'lucide-react';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  department?: string;
  bio?: string;
  phone?: string;
  avatar?: string;
}

interface ProfileTabProps {
  currentUser: User | null;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ currentUser }) => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    bio: '',
    avatar: ''
  });

  // Load current user data when component mounts or currentUser changes
  useEffect(() => {
    if (currentUser) {
      setProfile({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        department: currentUser.department || '',
        bio: currentUser.bio || '',
        avatar: currentUser.avatar || ''
      });
    }
  }, [currentUser]);

  const handleSave = () => {
    // TODO: Implement API call to update user profile
    console.log('Saving profile:', profile);
    alert('Profile updated successfully!');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!profile.firstName && !profile.lastName) return 'U';
    const firstInitial = profile.firstName?.[0] || '';
    const lastInitial = profile.lastName?.[0] || '';
    return (firstInitial + lastInitial).toUpperCase() || 'U';
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture Section */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              getUserInitials()
            )}
          </div>
          <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
            <Camera size={16} />
          </button>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Profile Picture</h3>
          <p className="text-sm text-gray-600 mb-2">Upload a new profile picture</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Upload Photo
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            value={profile.firstName}
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            value={profile.lastName}
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
          <input
            type="text"
            value={currentUser?.role || 'User'}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
          />
          <p className="text-xs text-gray-500 mt-1">Role is managed by administrators</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
          <input
            type="text"
            value={profile.department}
            onChange={(e) => setProfile({ ...profile, department: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
        <textarea
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Tell us about yourself..."
        />
      </div>

      {/* User Status Display */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 mb-2">Account Status</h4>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            currentUser?.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className={`text-sm font-medium ${
            currentUser?.status === 'Active' ? 'text-green-600' : 'text-red-600'
          }`}>
            {currentUser?.status || 'Unknown'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;