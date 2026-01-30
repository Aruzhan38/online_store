const Product = require('../models/product');

exports.getAllProducts = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, search } = req.query;
        let query = { isActive: true };

        if (category) query.categoryId = category;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (search) query.name = { $regex: search, $options: 'i' }; 

        const products = await Product.find(query).populate('categoryId', 'name');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('categoryId');
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: "Error creating product", error });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error });
    }
};