
const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  frequency: {
    type: String,
    enum: ['monthly', 'bi-monthly', 'quarterly'],
    default: 'monthly'
  },
  preferences: [{
    type: String
  }],
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      default: 1
    }
  }],
  status: {
    type: String,
    enum: ['active', 'paused', 'cancelled'],
    default: 'active'
  },
  nextDeliveryDate: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', SubscriptionSchema);
