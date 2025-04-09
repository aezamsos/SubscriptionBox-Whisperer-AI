
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Subscription = require('../models/Subscription');
const Product = require('../models/Product');

// @route   POST api/subscriptions
// @desc    Create a subscription
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, description, frequency, preferences, products } = req.body;

  try {
    // Ensure all product IDs exist in database
    for (const item of products) {
      const productId = item.product;
      const productExists = await Product.findById(productId);
      
      // If product doesn't exist, create a placeholder product
      if (!productExists) {
        console.log(`Product ${productId} not found, creating placeholder product`);
        const newProduct = new Product({
          _id: productId,
          name: `Product ${productId}`,
          description: "Automatically created placeholder product",
          image: "https://source.unsplash.com/random/300x300/?product",
          price: 19.99,
          category: "other"
        });
        await newProduct.save();
      }
    }
    
    // Create new subscription
    const subscription = new Subscription({
      user: req.user.id,
      name,
      description,
      frequency,
      preferences,
      products,
      nextDeliveryDate: calculateNextDeliveryDate(frequency)
    });

    // Save subscription to database
    const savedSubscription = await subscription.save();
    
    // Populate product details
    await savedSubscription.populate('products.product');
    
    res.json(savedSubscription);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/subscriptions
// @desc    Get all subscriptions for current user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user.id })
      .populate('products.product')
      .sort({ createdAt: -1 });
    
    res.json(subscriptions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/subscriptions/:id
// @desc    Get subscription by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id)
      .populate('products.product');

    // Check subscription exists
    if (!subscription) {
      return res.status(404).json({ msg: 'Subscription not found' });
    }

    // Check subscription belongs to user
    if (subscription.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(subscription);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Subscription not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/subscriptions/:id
// @desc    Update subscription
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, description, frequency, preferences, products, status } = req.body;

  try {
    let subscription = await Subscription.findById(req.params.id);

    // Check subscription exists
    if (!subscription) {
      return res.status(404).json({ msg: 'Subscription not found' });
    }

    // Check subscription belongs to user
    if (subscription.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Update fields
    if (name) subscription.name = name;
    if (description) subscription.description = description;
    if (frequency) {
      subscription.frequency = frequency;
      subscription.nextDeliveryDate = calculateNextDeliveryDate(frequency);
    }
    if (preferences) subscription.preferences = preferences;
    if (products) subscription.products = products;
    if (status) subscription.status = status;

    // Save updated subscription
    await subscription.save();
    
    // Populate product details
    await subscription.populate('products.product');
    
    res.json(subscription);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Subscription not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/subscriptions/:id
// @desc    Delete subscription
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    // Check subscription exists
    if (!subscription) {
      return res.status(404).json({ msg: 'Subscription not found' });
    }

    // Check subscription belongs to user
    if (subscription.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Remove subscription
    await subscription.deleteOne();

    res.json({ msg: 'Subscription removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Subscription not found' });
    }
    res.status(500).send('Server Error');
  }
});

// Helper function to calculate next delivery date
function calculateNextDeliveryDate(frequency) {
  const now = new Date();
  let nextDate = new Date(now);
  
  switch (frequency) {
    case 'monthly':
      nextDate.setMonth(now.getMonth() + 1);
      break;
    case 'bi-monthly':
      nextDate.setMonth(now.getMonth() + 2);
      break;
    case 'quarterly':
      nextDate.setMonth(now.getMonth() + 3);
      break;
    default:
      nextDate.setMonth(now.getMonth() + 1);
  }
  
  return nextDate;
}

module.exports = router;
