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

// Task 2: POST /cart/:productId
router.post('/:productId', addToCart);

// Task 3: GET /cart
router.get('/', getCart);

// Task 4: PATCH /cart/:productId
router.patch('/:productId', updateCartQuantity);

// Task 5: DELETE /cart/:productId
router.delete('/:productId', removeFromCart);

module.exports = router;
