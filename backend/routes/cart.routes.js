const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart
} = require('../controllers/cart.controller');

// All cart endpoints require an authenticated user session/JWT
router.use(authMiddleware);

// Add product to cart
router.post('/:productId', addToCart);

// Get current user cart
router.get('/', getCart);

// Update item quantity
router.patch('/:productId', updateCartQuantity);

// Remove item from cart
router.delete('/:productId', removeFromCart);

module.exports = router;
