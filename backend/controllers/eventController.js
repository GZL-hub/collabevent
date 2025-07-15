const Event = require('../models/event');

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const { 
      status, 
      attendeeType, 
      startDate, 
      endDate, 
      page = 1, 
      limit = 10,
      sortBy = 'startDate',
      sortOrder = 'asc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (status) filter.status = status;
    if (attendeeType) filter.attendeeType = attendeeType;
    
    // Date range filtering
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination and sorting
    const events = await Event.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalEvents = await Event.countDocuments(filter);
    const totalPages = Math.ceil(totalEvents / parseInt(limit));

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalEvents,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching events'
    });
  }
};

// Get single event by ID
exports.getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.json({
      success: true,
      data: event
    });
    
  } catch (error) {
    console.error('Error fetching event:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching event'
    });
  }
};

// Create new event
exports.createEvent = async (req, res) => {
  try {
    const eventData = req.body;
    
    // Validate required fields
    const requiredFields = ['title', 'startDate', 'endDate', 'location', 'assignee'];
    for (const field of requiredFields) {
      if (!eventData[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
    }

    // Validate assignee object
    if (!eventData.assignee.name || !eventData.assignee.initials) {
      return res.status(400).json({
        success: false,
        message: 'Assignee name and initials are required'
      });
    }

    // Validate date logic
    const startDate = new Date(eventData.startDate);
    const endDate = new Date(eventData.endDate);
    
    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    // Create new event
    const newEvent = new Event({
      ...eventData,
      startDate,
      endDate,
      createdBy: eventData.createdBy || null // Optional: link to user who created it
    });

    // Save to database
    const savedEvent = await newEvent.save();
    
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: savedEvent
    });

  } catch (error) {
    console.error('Error creating event:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating event'
    });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const updates = req.body;
    
    // Validate date logic if dates are being updated
    if (updates.startDate || updates.endDate) {
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }
      
      const startDate = new Date(updates.startDate || event.startDate);
      const endDate = new Date(updates.endDate || event.endDate);
      
      if (endDate <= startDate) {
        return res.status(400).json({
          success: false,
          message: 'End date must be after start date'
        });
      }
    }

    // Update the event
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent
    });
    
  } catch (error) {
    console.error('Error updating event:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating event'
    });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    
    const deletedEvent = await Event.findByIdAndDelete(eventId);
    
    if (!deletedEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Event deleted successfully',
      data: deletedEvent
    });
    
  } catch (error) {
    console.error('Error deleting event:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while deleting event'
    });
  }
};

// Get events by assignee
exports.getEventsByAssignee = async (req, res) => {
  try {
    const assigneeId = req.params.assigneeId;
    
    const events = await Event.find({ 'assignee.id': assigneeId })
      .sort({ startDate: 1 });
    
    res.json({
      success: true,
      data: events
    });
    
  } catch (error) {
    console.error('Error fetching events by assignee:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching events'
    });
  }
};

// Get upcoming events
exports.getUpcomingEvents = async (req, res) => {
  try {
    const now = new Date();
    const limit = parseInt(req.query.limit) || 10;
    
    const events = await Event.find({
      startDate: { $gte: now },
      status: 'Upcoming'
    })
      .sort({ startDate: 1 })
      .limit(limit);
    
    res.json({
      success: true,
      data: events
    });
    
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching upcoming events'
    });
  }
};

// Get event statistics
exports.getEventStats = async (req, res) => {
  try {
    const stats = await Event.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const attendeeTypeStats = await Event.aggregate([
      {
        $group: {
          _id: '$attendeeType',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({ 
      status: 'Upcoming',
      startDate: { $gte: new Date() }
    });
    
    res.json({
      success: true,
      data: {
        totalEvents,
        upcomingEvents,
        statusBreakdown: stats,
        attendeeTypeBreakdown: attendeeTypeStats
      }
    });
    
  } catch (error) {
    console.error('Error fetching event statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
};