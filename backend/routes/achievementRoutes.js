const router       = require('express').Router();
const { getAll, getOne, create, update, remove } = require('../controllers/achievementController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const createUpload = require('../middleware/uploadMiddleware');

const upload = createUpload('achievements');

router.get('/',      getAll);
router.get('/:id',   getOne);
router.post('/',     protect, restrictTo('admin', 'editor'), upload.single('image'), create);
router.patch('/:id', protect, restrictTo('admin', 'editor'), upload.single('image'), update);
router.delete('/:id', protect, restrictTo('admin'), remove);

module.exports = router;
