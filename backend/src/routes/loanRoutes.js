const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const loanController = require('../controllers/loanController');

router.get('/', authenticate, loanController.list);
router.get('/:id', authenticate, loanController.getById);
router.post('/', authenticate, loanController.request);
router.patch('/:id/approve', authenticate, authorize('admin'), loanController.approve);
router.patch('/:id/reject', authenticate, authorize('admin'), loanController.reject);
router.patch('/:id/return', authenticate, loanController.returnBook);
router.patch('/:id/extend', authenticate, loanController.extend);

module.exports = router;