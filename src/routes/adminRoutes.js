const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/stats', protect, adminOnly, adminController.getCategoryStats);
router.get('/orders', protect, adminOnly, adminController.getAllOrders); 
router.patch('/orders/:id/status', protect, adminOnly, adminController.updateOrderStatus); 

module.exports = router;