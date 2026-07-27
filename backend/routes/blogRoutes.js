const router       = require('express').Router();
const { getAll, getOne, create, update, remove } = require('../controllers/blogController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const createUpload = require('../middleware/uploadMiddleware');

const upload = createUpload('blogs');

router.get('/',      getAll);
router.get('/:id',   getOne);
router.post('/',     protect, restrictTo('admin', 'editor'), upload.single('thumbnail'), create);
router.patch('/:id', protect, restrictTo('admin', 'editor'), upload.single('thumbnail'), update);
router.delete('/:id', protect, restrictTo('admin'), remove);

module.exports = router;
