const jwt = require('jsonwebtoken');
const Customer = require('../models/customer.model');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : null);

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || process.env.jwt_secret || 'shopkart_secret_key_12345');
    const customerId = decoded.id || decoded.userId;

    const customer = await Customer.findById(customerId).select('-password');
    if (!customer) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    req.user = customer;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

module.exports = authMiddleware;
module.exports.authMiddleware = authMiddleware;
module.exports.protect = authMiddleware;
module.exports.isAuthenticated = authMiddleware;
