const router = require('express').Router();
const { getEvents, getEvent, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const uploadEvent = require('../middleware/uploadEventMiddleware');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const eventImages = uploadEvent.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'speakerPhoto', maxCount: 1 },
]);

router.get('/',       getEvents);
router.get('/:id',    getEvent);
router.post('/',      protect, restrictTo('admin', 'editor'), eventImages, createEvent);
router.put('/:id',    protect, restrictTo('admin', 'editor'), eventImages, updateEvent);
router.delete('/:id', protect, restrictTo('admin'), deleteEvent);

module.exports = router;
