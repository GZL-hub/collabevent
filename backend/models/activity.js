const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['comment', 'event', 'mention'],
    index: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      default: ''
    },
    initials: {
      type: String,
      required: true
    },
    avatarColor: {
      type: String,
      required: true
    }
  },
  event: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      default: null
    },
    title: {
      type: String,
      default: ''
    },
    date: {
      type: Date,
      default: null
    }
  },
  mentions: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId()
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  isPinned: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true
});

// Indexes for performance
activitySchema.index({ type: 1, createdAt: -1 });
activitySchema.index({ 'user.id': 1, createdAt: -1 });
activitySchema.index({ 'event.id': 1 });
activitySchema.index({ 'mentions.userId': 1 });
activitySchema.index({ tags: 1 });
activitySchema.index({ isPinned: 1, createdAt: -1 });

// Text search index
activitySchema.index({ 
  message: 'text', 
  tags: 'text',
  'event.title': 'text' 
});

module.exports = mongoose.model('Activity', activitySchema, 'activities');