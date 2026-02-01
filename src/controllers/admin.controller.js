const Order = require('../models/order');

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'fullName email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        );
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Error updating order status", error: error.message });
    }
};

exports.getCategoryStats = async (req, res) => {
    try {
        const stats = await Order.aggregate([
            { $unwind: "$items" },
            
            {
                $lookup: {
                    from: "products",
                    localField: "items.productId",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            
            { $unwind: "$productDetails" },
            
            {
                $group: {
                    _id: "$productDetails.categoryId",
                    totalRevenue: { $sum: "$items.lineTotal" },
                    totalUnitsSold: { $sum: "$items.qty" }
                }
            },
            
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "categoryInfo"
                }
            },
            
            { $sort: { totalRevenue: -1 } }
        ]);

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: "Aggregation failed", error: error.message });
    }
};