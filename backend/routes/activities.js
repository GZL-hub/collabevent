const express = require('express');
const router = express.Router();
const {
  getAllActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
  likeActivity,
  pinActivity,
  addReply,
  getActivityStats,
  deleteReply
} = require('../controllers/activityController');

// @route   GET /api/activities
// @desc    Get all activities with filtering and pagination
// @query   ?type=comment&isPinned=true&page=1&limit=20&search=cloud
router.get('/', getAllActivities);

// @route   GET /api/activities/stats
// @desc    Get activity statistics
router.get('/stats', getActivityStats);

// @route   GET /api/activities/:id
// @desc    Get single activity by ID
router.get('/:id', getActivityById);

// @route   POST /api/activities
// @desc    Create new activity
router.post('/', createActivity);

// @route   PUT /api/activities/:id
// @desc    Update activity
router.put('/:id', updateActivity);

// @route   DELETE /api/activities/:id
// @desc    Delete activity
router.delete('/:id', deleteActivity);

// @route   POST /api/activities/:id/like
// @desc    Like activity
router.post('/:id/like', likeActivity);

// @route   PUT /api/activities/:id/pin
// @desc    Pin/Unpin activity
router.put('/:id/pin', pinActivity);

// @route   POST /api/activities/:id/reply
// @desc    Add reply to activity
router.post('/:id/reply', addReply);

// @route   DELETE /api/activities/:id/reply/:replyId
// @desc    Delete reply from activity
router.delete('/:id/reply/:replyId', deleteReply);

module.exports = router;