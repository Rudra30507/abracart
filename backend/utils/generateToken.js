const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  const userId = typeof payload === 'object' && payload !== null ? (payload._id || payload.id || payload.userId) : payload;
  return jwt.sign(
    { id: userId, userId: userId },
    process.env.JWT_SECRET || process.env.jwt_secret || 'shopkart_secret_key_12345',
    { expiresIn: '7d' }
  );
};

module.exports = generateToken;
module.exports.generateToken = generateToken;
