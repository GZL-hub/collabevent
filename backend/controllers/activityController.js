const Activity = require('../models/activity');
const User = require('../models/user');
const Event = require('../models/event');
const mongoose = require('mongoose');

// Get all activities
exports.getAllActivities = async (req, res) => {
  try {
    const { 
      type, 
      isPinned,
      page = 1, 
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search
    } = req.query;

    // Build filter object
    const filter = {};
    if (type) filter.type = type;
    if (isPinned !== undefined) filter.isPinned = isPinned === 'true';

    // Add text search if provided
    if (search) {
      filter.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination and sorting
    const activities = await Activity.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user.id', 'firstName lastName email avatar')
      .populate('event.id', 'title startDate location')
      .populate('mentions.userId', 'firstName lastName email');

    // Get total count for pagination
    const totalActivities = await Activity.countDocuments(filter);
    const totalPages = Math.ceil(totalActivities / parseInt(limit));

    res.json({
      success: true,
      data: {
        activities,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalActivities,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching activities'
    });
  }
};

// Get single activity by ID
exports.getActivityById = async (req, res) => {
  try {
    const activityId = req.params.id;
    
    const activity = await Activity.findById(activityId)
      .populate('user.id', 'firstName lastName email avatar')
      .populate('event.id', 'title startDate location')
      .populate('mentions.userId', 'firstName lastName email');
    
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }
    
    res.json({
      success: true,
      data: activity
    });
    
  } catch (error) {
    console.error('Error fetching activity:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid activity ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching activity'
    });
  }
};

// Create new activity
exports.createActivity = async (req, res) => {
  try {
    const { type, message, userId, eventId, mentions, tags } = req.body;
    
    // Validate required fields
    if (!type || !message || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Type, message, and userId are required'
      });
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Helper function to get user initials
    const getInitials = (firstName, lastName) => {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    // Helper function to get avatar color
    const getAvatarColor = (name) => {
      const colors = ['indigo', 'blue', 'purple', 'green', 'pink', 'yellow', 'red', 'orange', 'teal'];
      const index = name.length % colors.length;
      return colors[index];
    };

    // Build activity data
    const activityData = {
      type,
      message: message.trim(),
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        avatar: user.avatar || '',
        initials: getInitials(user.firstName, user.lastName),
        avatarColor: getAvatarColor(`${user.firstName} ${user.lastName}`)
      },
      tags: tags || [],
      mentions: []
    };

    // Handle event reference if activity type is 'event'
    if (type === 'event') {
      if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({
          success: false,
          message: 'Valid eventId is required for event activities'
        });
      }
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }
      activityData.event = {
        id: event._id,
        title: event.title,
        date: event.startDate
      };
    }

    // Handle mentions if provided
    if (mentions && Array.isArray(mentions) && mentions.length > 0) {
      const mentionedUsers = await User.find({ _id: { $in: mentions } });
      activityData.mentions = mentionedUsers.map(mentionedUser => ({
        userId: mentionedUser._id,
        name: `${mentionedUser.firstName} ${mentionedUser.lastName}`
      }));
    }

    // Create new activity
    const newActivity = new Activity(activityData);
    const savedActivity = await newActivity.save();
    
    // Populate the saved activity for response
    const populatedActivity = await Activity.findById(savedActivity._id)
      .populate('user.id', 'firstName lastName email avatar')
      .populate('event.id', 'title startDate location')
      .populate('mentions.userId', 'firstName lastName email');
    
    res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      data: populatedActivity
    });

  } catch (error) {
    console.error('Error creating activity:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating activity'
    });
  }
};

// Update activity
exports.updateActivity = async (req, res) => {
  try {
    const activityId = req.params.id;
    const updates = req.body;
    
    // Only allow specific fields to be updated
    const allowedUpdates = ['message', 'tags', 'isPinned'];
    const updateData = {};
    
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updateData[key] = updates[key];
      }
    });
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }
    
    const updatedActivity = await Activity.findByIdAndUpdate(
      activityId,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!updatedActivity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Activity updated successfully',
      data: updatedActivity
    });
    
  } catch (error) {
    console.error('Error updating activity:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid activity ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating activity'
    });
  }
};

// Delete activity
exports.deleteActivity = async (req, res) => {
  try {
    const activityId = req.params.id;
    
    const deletedActivity = await Activity.findByIdAndDelete(activityId);
    
    if (!deletedActivity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Activity deleted successfully',
      data: deletedActivity
    });
    
  } catch (error) {
    console.error('Error deleting activity:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid activity ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while deleting activity'
    });
  }
};

// Like/Unlike activity
exports.likeActivity = async (req, res) => {
  console.log('=== LIKE ACTIVITY DEBUG ===');
  console.log('Activity ID:', req.params.id);
  console.log('Request body:', req.body);
  
  try {
    const activityId = req.params.id;
    const userId = req.body.userId; // Assuming userId is sent in request body
    
    // Validate inputs
    if (!mongoose.Types.ObjectId.isValid(activityId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid activity ID format'
      });
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid user ID is required'
      });
    }
    
    // Find the activity
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }
    
    console.log('Current likes count:', activity.likes);
    console.log('Current likedBy array:', activity.likedBy || []);
    
    // Initialize likedBy array if it doesn't exist
    if (!activity.likedBy) {
      activity.likedBy = [];
    }
    
    // Check if user has already liked this activity
    const userHasLiked = activity.likedBy.some(id => id.toString() === userId.toString());
    console.log('User has already liked:', userHasLiked);
    
    let updatedActivity;
    
    if (userHasLiked) {
      // User is unliking - remove from likedBy array and decrease count
      console.log('UNLIKING: Removing user from likedBy and decreasing count');
      updatedActivity = await Activity.findByIdAndUpdate(
        activityId,
        {
          $pull: { likedBy: userId }, // Remove user from likedBy array
          $inc: { likes: -1 } // Decrease likes count by 1
        },
        { new: true, runValidators: true }
      ).populate('user', 'name email')
       .populate('replies.userId', 'name email');
    } else {
      // User is liking - add to likedBy array and increase count
      console.log('LIKING: Adding user to likedBy and increasing count');
      updatedActivity = await Activity.findByIdAndUpdate(
        activityId,
        {
          $addToSet: { likedBy: userId }, // Add user to likedBy array (prevents duplicates)
          $inc: { likes: 1 } // Increase likes count by 1
        },
        { new: true, runValidators: true }
      ).populate('user', 'name email')
       .populate('replies.userId', 'name email');
    }
    
    console.log('Updated likes count:', updatedActivity.likes);
    console.log('Updated likedBy array:', updatedActivity.likedBy);
    
    // Make sure likes count doesn't go below 0
    if (updatedActivity.likes < 0) {
      console.log('Likes count went below 0, fixing...');
      updatedActivity.likes = 0;
      await updatedActivity.save();
    }
    
    res.json({
      success: true,
      message: userHasLiked ? 'Activity unliked successfully' : 'Activity liked successfully',
      data: updatedActivity,
      isLiked: !userHasLiked // Return the new like status
    });
    
  } catch (error) {
    console.error('Error liking/unliking activity:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    res.status(500).json({
      success: false,
      message: 'Server error while processing like',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Pin/Unpin activity
exports.pinActivity = async (req, res) => {
  try {
    const activityId = req.params.id;
    const { isPinned } = req.body;
    
    const activity = await Activity.findByIdAndUpdate(
      activityId,
      { isPinned: isPinned },
      { new: true }
    );
    
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }
    
    res.json({
      success: true,
      message: `Activity ${isPinned ? 'pinned' : 'unpinned'} successfully`,
      data: activity
    });
    
  } catch (error) {
    console.error('Error pinning activity:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while pinning activity'
    });
  }
};

// Add reply to activity
exports.addReply = async (req, res) => {
  try {
    const activityId = req.params.id;
    const { userId, message } = req.body;
    
    if (!userId || !message) {
      return res.status(400).json({
        success: false,
        message: 'UserId and message are required'
      });
    }
    
    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const reply = {
      userId: user._id,
      userName: `${user.firstName} ${user.lastName}`,
      message: message.trim(),
      timestamp: new Date()
    };
    
    const activity = await Activity.findByIdAndUpdate(
      activityId,
      { $push: { replies: reply } },
      { new: true }
    );
    
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Reply added successfully',
      data: activity
    });
    
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding reply'
    });
  }
};

// Get activity statistics
exports.getActivityStats = async (req, res) => {
  try {
    const stats = await Activity.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalActivities = await Activity.countDocuments();
    const pinnedActivities = await Activity.countDocuments({ isPinned: true });
    const totalLikes = await Activity.aggregate([
      { $group: { _id: null, totalLikes: { $sum: '$likes' } } }
    ]);
    
    res.json({
      success: true,
      data: {
        totalActivities,
        pinnedActivities,
        totalLikes: totalLikes[0]?.totalLikes || 0,
        typeBreakdown: stats
      }
    });
    
  } catch (error) {
    console.error('Error fetching activity statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
};


// Delete reply from activity
exports.deleteReply = async (req, res) => {
  console.log('=== DELETE REPLY DEBUG ===');
  console.log('Activity ID:', req.params.id);
  console.log('Reply ID:', req.params.replyId);
  console.log('Request body:', req.body); // Add this to see what's being sent
  
  try {
    const activityId = req.params.id;
    const replyId = req.params.replyId;
    const requestUserId = req.body.userId; // Fix: Get directly from request body
    
    console.log('Extracted userId:', requestUserId); // Add debug log
    
    // Validate required data
    if (!requestUserId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required in request body'
      });
    }
    
    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(activityId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid activity ID format'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(replyId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reply ID format'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(requestUserId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }
    
    // Find the activity
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }
    
    console.log('Found activity with replies:', activity.replies.length);
    
    // Find the reply
    const reply = activity.replies.find(r => r._id.toString() === replyId);
    if (!reply) {
      console.log('Reply not found. Available reply IDs:', activity.replies.map(r => r._id.toString()));
      return res.status(404).json({
        success: false,
        message: 'Reply not found'
      });
    }
    
    console.log('Found reply. Reply userId:', reply.userId.toString(), 'Request userId:', requestUserId.toString());
    
    // Check if the user owns the reply
    if (reply.userId.toString() !== requestUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own replies'
      });
    }
    
    // Remove the reply
    const updatedActivity = await Activity.findByIdAndUpdate(
      activityId,
      { $pull: { replies: { _id: replyId } } },
      { new: true, runValidators: true }
    );
    
    if (!updatedActivity) {
      return res.status(404).json({
        success: false,
        message: 'Failed to delete reply'
      });
    }
    
    console.log('Successfully deleted reply. Remaining replies count:', updatedActivity.replies.length);
    
    res.json({
      success: true,
      message: 'Reply deleted successfully',
      data: updatedActivity
    });
    
  } catch (error) {
    console.error('Error deleting reply:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: `Invalid ${error.path} format: ${error.value}`
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while deleting reply',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};