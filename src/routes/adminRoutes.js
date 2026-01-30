const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const analyticsController = require('../controllers/analytics.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.post('/orders', protect, orderController.createOrder); 
router.get('/orders/my', protect, orderController.getMyOrders);

router.get('/admin/stats', protect, adminOnly, analyticsController.getCategoryStats);

module.exports = router;