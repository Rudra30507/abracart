const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {
  createPaymentOrder,
  verifyPayment,
  getUserOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/order.controller');

// All order routes are protected by authMiddleware
router.use(authMiddleware);

// Create payment order with stock & price verification
router.post('/create-payment-order', createPaymentOrder);

// Verify payment signature and confirm order & clear cart
router.post('/verify-payment', verifyPayment);

// Get all orders of authenticated user
router.get('/', getUserOrders);

// Get single order details with ownership verification
router.get('/:id', getOrderById);

// Update order status progression
router.patch('/:id/status', updateOrderStatus);

module.exports = router;
