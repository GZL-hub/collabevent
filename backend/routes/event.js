const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsByAssignee,
  getUpcomingEvents,
  getEventStats
} = require('../controllers/eventController');

// @route   GET /api/events
// @desc    Get all events with filtering and pagination
// @query   ?status=Upcoming&attendeeType=RSVP&page=1&limit=10&sortBy=startDate&sortOrder=asc
router.get('/', getAllEvents);

// @route   GET /api/events/stats
// @desc    Get event statistics
router.get('/stats', getEventStats);

// @route   GET /api/events/upcoming
// @desc    Get upcoming events
// @query   ?limit=5
router.get('/upcoming', getUpcomingEvents);

// @route   GET /api/events/assignee/:assigneeId
// @desc    Get events by assignee ID
router.get('/assignee/:assigneeId', getEventsByAssignee);

// @route   GET /api/events/:id
// @desc    Get single event by ID
router.get('/:id', getEventById);

// @route   POST /api/events
// @desc    Create new event
router.post('/', createEvent);

// @route   PUT /api/events/:id
// @desc    Update event
router.put('/:id', updateEvent);

// @route   DELETE /api/events/:id
// @desc    Delete event
router.delete('/:id', deleteEvent);

module.exports = router;