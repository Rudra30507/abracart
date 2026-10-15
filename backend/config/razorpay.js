const Razorpay = require('razorpay');
const dotenv = require('dotenv');

dotenv.config();

const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
};

// Dynamic proxy so fresh .env keys are always read on every call
const razorpay = new Proxy({}, {
  get(target, prop) {
    const instance = getRazorpayInstance();
    const value = instance[prop];
    return typeof value === 'function' ? value.bind(instance) : value;
  }
});

module.exports = razorpay;
module.exports.getInstance = getRazorpayInstance;
