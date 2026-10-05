const mongoose = require('mongoose');
const Customer = require('../models/customer.model');
const Product = require('../models/product.model');

/**
 * Task 2: Add Product to Cart
 * POST /cart/:productId
 * - If not in cart: Add with quantity = 1
 * - If already in cart: Increase quantity by 1
 * - Stock limit validation
 */
const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.stock <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Product is out of stock'
      });
    }

    const user = await Customer.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Initialize cart if undefined
    if (!user.cart) {
      user.cart = [];
    }

    const itemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      const currentQty = user.cart[itemIndex].quantity;
      if (currentQty + 1 > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Only ${product.stock} units available in stock.`
        });
      }
      user.cart[itemIndex].quantity += 1;
    } else {
      user.cart.push({ product: productId, quantity: 1 });
    }

    await user.save();

    const populatedUser = await Customer.findById(user._id).populate({
      path: 'cart.product',
      select: 'name price image stock category'
    });

    return res.status(200).json({
      success: true,
      message: 'Cart updated',
      cart: populatedUser.cart
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Task 3: Get Current User Cart
 * GET /cart
 * - Populates each cart item's product
 */
const getCart = async (req, res) => {
  try {
    const user = await Customer.findById(req.user._id).populate({
      path: 'cart.product',
      select: 'name price image stock category'
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Filter out items whose product document might have been removed
    const validCart = (user.cart || []).filter((item) => item.product != null);

    return res.status(200).json({
      success: true,
      cart: validCart
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Task 4: Update Product Quantity
 * PATCH /cart/:productId
 * Body: { quantity: Number }
 * - Validates quantity >= 1
 * - Validates quantity <= stock
 * - Product must exist in cart
 */
const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }

    const numQty = Number(quantity);
    if (!numQty || isNaN(numQty) || numQty < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a valid number of at least 1'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (numQty > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Quantity requested (${numQty}) exceeds available stock (${product.stock})`
      });
    }

    const user = await Customer.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.cart) {
      user.cart = [];
    }

    const itemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not in cart'
      });
    }

    user.cart[itemIndex].quantity = numQty;
    await user.save();

    const populatedUser = await Customer.findById(user._id).populate({
      path: 'cart.product',
      select: 'name price image stock category'
    });

    return res.status(200).json({
      success: true,
      message: 'Quantity updated',
      cart: populatedUser.cart
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Task 5: Remove Product from Cart
 * DELETE /cart/:productId
 */
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }

    const user = await Customer.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.cart) {
      user.cart = [];
    }

    const initialLength = user.cart.length;
    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );

    if (user.cart.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Product not in cart'
      });
    }

    await user.save();

    const populatedUser = await Customer.findById(user._id).populate({
      path: 'cart.product',
      select: 'name price image stock category'
    });

    return res.status(200).json({
      success: true,
      message: 'Product removed from cart',
      cart: populatedUser.cart
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart
};