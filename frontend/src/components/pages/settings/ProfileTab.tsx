import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import SaveButton from './SaveButton'; // Import the SaveButton component

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
  
  // Replace isLoading with saveStatus to match SaveButton component
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  const handleSave = async () => {
    if (!currentUser?._id) {
      setError('User ID not found. Please log in again.');
      setSaveStatus('error');
      return;
    }

    setSaveStatus('saving');
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`http://localhost:5001/api/users/${currentUser._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          phone: profile.phone,
          department: profile.department,
          bio: profile.bio,
          avatar: profile.avatar
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update localStorage with new user data to keep session in sync
      const currentUserData = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUserData = { ...currentUserData, ...data.user };
      localStorage.setItem('user', JSON.stringify(updatedUserData));

      setSuccessMessage('Profile updated successfully!');
      setSaveStatus('saved');
      
      // Reset to idle after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating profile');
      setSaveStatus('error');
      console.error('Error saving profile:', err);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size exceeds 5MB limit');
        return;
      }
      
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setProfile({
          ...profile,
          avatar: reader.result as string
        });
      };
      
      reader.readAsDataURL(file);
    }
  };

  // Get user initials for avatar placeholder
  const getUserInitials = () => {
    if (!profile.firstName && !profile.lastName) return 'U';
    return `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Success/Error messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Profile Picture Section */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              getUserInitials()
            )}
          </div>
          <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors cursor-pointer">
            <Camera size={16} />
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handlePhotoUpload}
            />
          </label>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Profile Picture</h3>
          <p className="text-sm text-gray-600 mb-2">Upload a new profile picture</p>
          <label className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer inline-block">
            Upload Photo
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handlePhotoUpload}
            />
          </label>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            value={profile.lastName}
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
        <textarea
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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

      {/* Replace the old save button with SaveButton component */}
      <SaveButton 
        onSave={handleSave}
        saveStatus={saveStatus}
      />
    </div>
  );
};

export default ProfileTab;