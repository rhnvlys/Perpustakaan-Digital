const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const bookController = require('../controllers/bookController');

router.get('/', bookController.list);
router.get('/categories', bookController.categories);
router.get('/:id', bookController.getById);
router.post('/', authenticate, authorize('admin'), bookController.create);
router.put('/:id', authenticate, authorize('admin'), bookController.update);
router.delete('/:id', authenticate, authorize('admin'), bookController.destroy);

module.exports = router;