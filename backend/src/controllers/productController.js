const Product = require("../models/Product");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/products?category=&search=&limit=
exports.getProducts = async (req, res) => {
    try {
        const { category, search, limit } = req.query;
        const filter = {};

        if (typeof category === "string" && category) {
            filter.category = category;
        }

        if (typeof search === "string" && search.trim()) {
            const pattern = new RegExp(escapeRegex(search.trim()), "i");
            filter.$or = [{ name: pattern }, { brand: pattern }];
        }

        const query = Product.find(filter).sort({ createdAt: -1 });

        const max = Number.parseInt(limit, 10);
        if (Number.isInteger(max) && max > 0) {
            query.limit(Math.min(max, 100));
        }

        const products = await query;

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
