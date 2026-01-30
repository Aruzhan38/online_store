const Order = require('../models/order');

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