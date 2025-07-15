const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  attendeeType: {
    type: String,
    required: true,
    enum: ['RSVP', 'Ticket', 'Open', 'Invitation', 'Waitlist'],
    default: 'RSVP'
  },
  status: {
    type: String,
    required: true,
    enum: ['Upcoming', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  },
  assignee: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
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
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better performance
eventSchema.index({ startDate: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ 'assignee.id': 1 });
eventSchema.index({ createdBy: 1 });

// Specify the exact collection name
module.exports = mongoose.model('Event', eventSchema, 'events');