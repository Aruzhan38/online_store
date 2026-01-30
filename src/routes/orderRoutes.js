const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/cart', protect, cartController.getCart);
router.post('/cart/add', protect, cartController.addToCart); 
router.delete('/cart/item/:itemId', protect, cartController.removeFromCart);

module.exports = router;