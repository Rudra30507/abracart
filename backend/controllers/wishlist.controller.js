const mongoose = require('mongoose');
const Customer = require('../models/customer.model');
const Product = require('../models/product.model');

const addToWishlist = async (req, res) => {
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

    const user = await Customer.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isAlreadyInWishlist = user.wishlist.some(
      (id) => id.toString() === productId
    );

    if (isAlreadyInWishlist) {
      return res.status(409).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    user.wishlist.push(productId);
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Product added to wishlist'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getWishlist = async (req, res) => {
  try {
    const user = await Customer.findById(req.user._id).populate({
      path: 'wishlist',
      select: 'name price category image stock'
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      count: user.wishlist.length,
      wishlist: user.wishlist
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const removeFromWishlist = async (req, res) => {
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

    const productIndex = user.wishlist.findIndex(
      (id) => id.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not in wishlist'
      });
    }

    user.wishlist.splice(productIndex, 1);
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Product removed from wishlist'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const toggleWishlist = async (req, res) => {
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

    const user = await Customer.findById(req.user._id);
    const productIndex = user.wishlist.findIndex(
      (id) => id.toString() === productId
    );

    if (productIndex !== -1) {
      user.wishlist.splice(productIndex, 1);
      await user.save();
      return res.status(200).json({
        success: true,
        message: 'Product removed from wishlist',
        isWishlisted: false
      });
    } else {
      user.wishlist.push(productId);
      await user.save();
      return res.status(200).json({
        success: true,
        message: 'Product added to wishlist',
        isWishlisted: true
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  toggleWishlist
};
