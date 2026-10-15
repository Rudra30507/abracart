const crypto = require('crypto');
const mongoose = require('mongoose');
const Order = require('../models/order.model');
const Customer = require('../models/customer.model');
const Product = require('../models/product.model');
const razorpay = require('../config/razorpay');

/**
 * Create Payment Order
 * POST /orders/create-payment-order
 * Validates stock, recalculates total on server, creates database order & Razorpay order
 */
const createPaymentOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    // Validate shipping address
    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required'
      });
    }

    const { fullName, phone, addressLine1, city, state, pincode } = shippingAddress;

    if (
      !fullName || !fullName.trim() ||
      !phone || !phone.trim() ||
      !addressLine1 || !addressLine1.trim() ||
      !city || !city.trim() ||
      !state || !state.trim() ||
      !pincode || !pincode.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'All shipping address fields are required and cannot be empty'
      });
    }

    // Phone number validation (at least 10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.trim().replace(/\D/g, '')) || phone.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit phone number'
      });
    }

    // Pincode validation (exactly 6 digits)
    const pincodeRegex = /^[0-9]{6}$/;
    if (!pincodeRegex.test(pincode.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Pincode must contain 6 digits'
      });
    }

    // 2. Fetch authenticated user's cart
    const user = await Customer.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty. Add products to cart before checkout.'
      });
    }

    // Verify live stock, recalculate server total and snapshot items
    const orderItems = [];
    let serverTotal = 0;

    for (const item of user.cart) {
      if (!item.product) {
        return res.status(400).json({
          success: false,
          message: 'Cart contains an invalid product'
        });
      }

      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: 'A product in your cart is no longer available'
        });
      }

      // Stock check
      if (item.quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Only ${product.stock} units available.`
        });
      }

      const itemPrice = Number(product.price);
      const itemQty = Number(item.quantity);
      serverTotal += itemPrice * itemQty;

      // Purchase-time snapshot
      orderItems.push({
        product: product._id,
        name: product.name,
        price: itemPrice,
        quantity: itemQty,
        image: product.image
      });
    }

    if (orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid products in cart'
      });
    }

    // 4. Create pending ShopKart order in MongoDB
    const shopKartOrder = new Order({
      user: req.user._id,
      items: orderItems,
      shippingAddress: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        addressLine1: addressLine1.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim()
      },
      totalAmount: serverTotal,
      paymentStatus: 'PENDING',
      status: 'PENDING_PAYMENT'
    });

    await shopKartOrder.save();

    // 5. Create Razorpay Order (amount converted to paise)
    const amountInPaise = Math.round(serverTotal * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: shopKartOrder._id.toString()
    });

    shopKartOrder.razorpayOrderId = razorpayOrder.id;
    await shopKartOrder.save();

    return res.status(201).json({
      success: true,
      shopKartOrderId: shopKartOrder._id,
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Error in createPaymentOrder:', error);
    return res.status(500).json({
      success: false,
      message: error.error?.description || error.message || 'Server error creating order'
    });
  }
};

/**
 * Verify Razorpay Payment Signature and Confirm Order
 * POST /orders/verify-payment
 * Verifies signature, updates status to PAID, decrements stock, and clears user cart
 */
const verifyPayment = async (req, res) => {
  try {
    const { shopKartOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!shopKartOrderId || !razorpay_payment_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification fields'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(shopKartOrderId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID'
      });
    }

    // Ensure order exists and belongs to authenticated user
    const order = await Order.findOne({
      _id: shopKartOrderId,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or unauthorized'
      });
    }

    // Check if order was already confirmed
    if (order.paymentStatus === 'PAID') {
      return res.status(200).json({
        success: true,
        message: 'Order was already verified and confirmed',
        order
      });
    }

    if (!razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment signature is required for verification'
      });
    }

    // Use trusted order.razorpayOrderId from database
    const body = order.razorpayOrderId + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      order.paymentStatus = 'FAILED';
      await order.save();

      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // 1. Mark Order as PAID & PLACED
    order.paymentStatus = 'PAID';
    order.status = 'PLACED';
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    // 2. Decrement product stock in inventory
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear user's cart in database
    const user = await Customer.findById(req.user._id);
    if (user) {
      user.cart = [];
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully and order placed',
      order
    });
  } catch (error) {
    console.error('Error in verifyPayment:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error verifying payment'
    });
  }
};

/**
 * Get All Orders for Current Authenticated User
 * GET /orders
 */
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching orders'
    });
  }
};

/**
 * Get Single Order Details by ID
 * GET /orders/:id
 */
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID'
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Security check: Must belong to req.user._id
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to view this order'
      });
    }

    return res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching order'
    });
  }
};

/**
 * Update Order Status
 * PATCH /orders/:id/status
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING_PAYMENT', 'PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID'
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating order status'
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  getUserOrders,
  getOrderById,
  updateOrderStatus
};
