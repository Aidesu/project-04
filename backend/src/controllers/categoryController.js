const Category = require("../models/Category");
const Product = require("../models/Product");

// GET /api/categories : chaque catégorie avec son nombre de produits
// (Product.category contient le slug de la catégorie)
exports.getCategories = async (req, res) => {
    try {
        const [categories, counts] = await Promise.all([
            Category.find().sort({ name: 1 }).lean(),
            Product.aggregate([
                { $group: { _id: "$category", count: { $sum: 1 } } },
            ]),
        ]);

        const countBySlug = new Map(counts.map((c) => [c._id, c.count]));

        res.json(
            categories.map((category) => ({
                ...category,
                itemCount: countBySlug.get(category.slug) || 0,
            })),
        );
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

exports.getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found",
            });
        }

        res.json(category);
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);

        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,

            req.body,

            { new: true },
        );

        res.json(category);
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);

        res.json({
            message: "Category deleted",
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};
