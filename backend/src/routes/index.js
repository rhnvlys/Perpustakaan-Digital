const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const bookController = require('../controllers/bookController');
const loanController = require('../controllers/loanController');
const dashboardController = require('../controllers/dashboardController');
const notificationController = require('../controllers/notificationController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const { success } = require('../utils/response');

// Health Check
router.get('/health', (req, res) => {
    success(res, { service: "Perpustakaan Digital API" }, "API is running");
});

// Auth
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Books
router.get('/books', bookController.getBooks);
router.get('/books/:id', bookController.getBookById);
router.post('/books', verifyToken, isAdmin, bookController.createBook);
router.put('/books/:id', verifyToken, isAdmin, bookController.updateBook);
router.delete('/books/:id', verifyToken, isAdmin, bookController.deleteBook);
router.get('/categories', bookController.getCategories);

// Loans
router.get('/loans', verifyToken, loanController.getLoans);
router.get('/loans/:id', verifyToken, loanController.getLoanById);
router.post('/loans', verifyToken, loanController.requestLoan);
router.patch('/loans/:id/approve', verifyToken, isAdmin, loanController.approveLoan);
router.patch('/loans/:id/reject', verifyToken, isAdmin, loanController.rejectLoan);
router.patch('/loans/:id/return', verifyToken, loanController.returnBook);
router.patch('/loans/:id/extend', verifyToken, loanController.extendLoan);

// Dashboard & Notifications
router.get('/dashboard', verifyToken, dashboardController.getDashboard);
router.get('/notifications', verifyToken, notificationController.getNotifications);

module.exports = router;