const Product = require("../models/Product");

exports.getProducts = async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { category: category } : {};
        const products = await Product.find(filter);

        res.json(products);
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug });

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        res.json(product);
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

// PUT /api/products/:slug
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate(
            { slug: req.params.slug },
            req.body,
            { new: true },
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        res.json(product);
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({
            slug: req.params.slug,
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        res.json({
            message: "Product deleted",
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};
