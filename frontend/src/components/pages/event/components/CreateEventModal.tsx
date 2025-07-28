import React, { useState, useEffect } from 'react';
import { X, Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
import { Event } from '../types/event';
import { UserService, User as UserType } from '../service/userService';
import EventBasicInfoStep from './steps/EventBasicInforStep';
import EventAssigneeStep from './steps/EventAssigneeStep';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: Omit<Event, '_id' | 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: {
    title: string;
    eventDate: string;
    startTime: string;
    endTime: string;
    location: string;
    attendeeType: Event['attendeeType'];
    status: Event['status'];
    assigneeName: string;
    assigneeId: string;
    assigneeInitials?: string;
    assigneeAvatarColor?: string;
  };
  mode?: 'create' | 'edit';
}

export interface FormData {
  title: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
  attendeeType: Event['attendeeType'];
  status: Event['status'];
  assigneeName: string;
  assigneeId: string;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData,
  mode = 'create'
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    location: '',
    attendeeType: 'RSVP' as Event['attendeeType'],
    status: 'Upcoming' as Event['status'],
    assigneeName: '',
    assigneeId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // New state for dropdown
  
  // User selection state
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userFetchError, setUserFetchError] = useState<string | null>(null);

  // Fetch users from database
  const fetchUsers = async () => {
    setLoadingUsers(true);
    setUserFetchError(null);
    
    try {
      const userData = await UserService.getUsers();
      setUsers(Array.isArray(userData) ? userData : []);
      
      // If we have a selected user (edit mode), try to find the full user data
      if (selectedUser && selectedUser.id) {
        const fullUser = userData.find(user => user.id === selectedUser.id);
        if (fullUser) {
          setSelectedUser(fullUser);
        }
      }
    } catch (error) {
      console.error('Error in fetchUsers:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
      setUserFetchError(errorMessage);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Initialize form data when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      fetchUsers();

      if (initialData) {
        // Edit mode - populate with existing data
        setFormData({
          title: initialData.title,
          eventDate: initialData.eventDate,
          startTime: initialData.startTime,
          endTime: initialData.endTime,
          location: initialData.location,
          attendeeType: initialData.attendeeType,
          status: initialData.status,
          assigneeName: initialData.assigneeName,
          assigneeId: initialData.assigneeId,
        });

        // Set selected user for edit mode
        const user: UserType = {
          id: initialData.assigneeId,
          name: initialData.assigneeName,
          firstName: initialData.assigneeName.split(' ')[0] || '',
          lastName: initialData.assigneeName.split(' ').slice(1).join(' ') || '',
          email: '',
          role: '',
          department: '',
          avatar: '',
          status: 'Active',
        };
        setSelectedUser(user);
      } else {
        // Create mode - reset to default values
        setFormData({
          title: '',
          eventDate: '',
          startTime: '',
          endTime: '',
          location: '',
          attendeeType: 'RSVP',
          status: 'Upcoming',
          assigneeName: '',
          assigneeId: '',
        });
        setSelectedUser(null);
      }
      
      // Reset state
      setCurrentStep(1);
      setErrors({});
      setUserFetchError(null);
      setIsDropdownOpen(false);
    }
  }, [isOpen, initialData]);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';

    // Validate that end time is after start time
    if (formData.startTime && formData.endTime) {
      if (formData.endTime <= formData.startTime) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.assigneeName.trim() || !formData.assigneeId) {
      newErrors.assigneeName = 'Assignee is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = ['indigo', 'blue', 'purple', 'green', 'pink', 'yellow', 'red', 'orange', 'teal'];
    const index = name.length % colors.length;
    return colors[index];
  };

const handleSubmit = async () => {
  if (!validateStep2() || isSubmitting) return;

  setIsSubmitting(true);

  try {
    let initials = '';
    let avatarColor = '';

    if (mode === 'edit' && initialData?.assigneeInitials && initialData?.assigneeAvatarColor) {
      initials = initialData.assigneeInitials;
      avatarColor = initialData.assigneeAvatarColor;
    } else {
      initials = getInitials(formData.assigneeName);
      avatarColor = getAvatarColor(formData.assigneeName);
    }

    // 1. Reconstruct the start and end dates from form data.
    const startDate = new Date(`${formData.eventDate}T${formData.startTime}`);
    const endDate = new Date(`${formData.eventDate}T${formData.endTime}`);

    // 2. Check if the end time is on the next day.
    // If endTime is less than or equal to startTime, it implies the event crosses midnight into the next day.
    if (endDate <= startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }

    const eventData: Omit<Event, '_id' | 'id' | 'createdAt' | 'updatedAt'> = {
      title: formData.title.trim(),
      startDate: startDate, // 3. Use the corrected startDate
      endDate: endDate,     // 4. Use the corrected and potentially advanced endDate
      location: formData.location.trim(),
      attendeeType: formData.attendeeType,
      status: formData.status,
      assignee: {
        id: formData.assigneeId,
        name: formData.assigneeName.trim(),
        initials,
        avatarColor,
      }
    };

      await onSubmit(eventData);
      handleClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      eventDate: '',
      startTime: '',
      endTime: '',
      location: '',
      attendeeType: 'RSVP',
      status: 'Upcoming',
      assigneeName: '',
      assigneeId: '',
    });
    setSelectedUser(null);
    setCurrentStep(1);
    setErrors({});
    setUserFetchError(null);
    setIsSubmitting(false);
    setIsDropdownOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  // Determine modal size based on step and dropdown state - VERTICAL EXPANSION
  const getModalClasses = () => {
    const baseClasses = "bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden";
    
    if (currentStep === 2 && isDropdownOpen) {
      // Expanded modal HEIGHT for step 2 with dropdown open
      return `${baseClasses} h-[95vh] max-h-[95vh]`;
    } else if (currentStep === 2) {
      // Normal height for step 2
      return `${baseClasses} max-h-[85vh]`;
    } else {
      // Compact height for step 1
      return `${baseClasses} max-h-[75vh]`;
    }
  };

  // Dynamic content wrapper classes for scrolling
  const getContentClasses = () => {
    if (currentStep === 2 && isDropdownOpen) {
      return "flex-1 overflow-y-auto";
    }
    return "overflow-y-auto";
  };

  return (
    <div className="fixed inset-0 backdrop-blur-lg backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${getModalClasses()} flex flex-col`}>
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {mode === 'edit' ? 'Edit Event' : 'Create New Event'}
              </h2>
              <p className="text-xs text-gray-600">
                Step {currentStep} of 2: {currentStep === 1 ? 'Basic Information' : 'Assignee & Settings'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar - Fixed */}
        <div className="px-4 pt-3 pb-3 bg-white border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  currentStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  1
                </div>
                <div className="ml-2 text-xs font-medium text-gray-900">Basic Info</div>
              </div>
            </div>
            <div className={`flex-1 h-0.5 rounded ${currentStep >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
            <div className="flex-1">
              <div className="flex items-center justify-end">
                <div className="mr-2 text-xs font-medium text-gray-900">Assignee</div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  currentStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  2
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step Content - Scrollable */}
        <div className={`p-4 ${getContentClasses()}`}>
          {currentStep === 1 ? (
            <EventBasicInfoStep
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              isSubmitting={isSubmitting}
            />
          ) : (
            <EventAssigneeStep
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              users={users}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              loadingUsers={loadingUsers}
              userFetchError={userFetchError}
              fetchUsers={fetchUsers}
              isSubmitting={isSubmitting}
              onDropdownToggle={setIsDropdownOpen} // Pass dropdown state handler
            />
          )}
        </div>

        {/* Footer - Fixed */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            type="button"
            onClick={currentStep === 1 ? handleClose : handlePrevStep}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center text-sm"
            disabled={isSubmitting}
          >
            {currentStep === 1 ? (
              <>
                <X className="w-3 h-3 mr-1" />
                Cancel
              </>
            ) : (
              <>
                <ArrowLeft className="w-3 h-3 mr-1" />
                Previous
              </>
            )}
          </button>

          <button
            type="button"
            onClick={currentStep === 1 ? handleNextStep : handleSubmit}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {mode === 'edit' ? 'Updating...' : 'Creating...'}
              </>
            ) : currentStep === 1 ? (
              <>
                Next
                <ArrowRight className="w-3 h-3 ml-1" />
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4 mr-1" />
                {mode === 'edit' ? 'Update Event' : 'Create Event'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;