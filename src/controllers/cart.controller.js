const Cart = require('../models/cart');
const Product = require('../models/product');

exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
        
        if (!cart) {
            cart = new Cart({ userId: req.user.id, items: [] });
            await cart.save();
        }
        
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart", error });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { productId, sku, qty } = req.body;
        const userId = req.user.id;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const cart = await Cart.findOne({ userId });
        const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId && p.sku === sku);

        if (itemIndex > -1) {
            cart.items[itemIndex].qty += qty;
        } else {
            cart.items.push({
                productId,
                sku,
                qty,
                priceSnapshot: product.price 
            });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Error adding to cart", error });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const itemId = req.params.itemId;

        const cart = await Cart.findOneAndUpdate(
            { userId },
            { $pull: { items: { _id: itemId } } },
            { new: true }
        );

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Error removing item", error });
    }
};