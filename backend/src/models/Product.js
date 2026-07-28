const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        category: {
            type: String,
            required: true,
        },

        brand: {
            type: String,
            required: true,
        },

        sku: {
            type: String,
            unique: true,
        },

        description: {
            type: String,
            default: "",
        },

        shortDescription: {
            type: String,
            default: "",
        },

        price: {
            type: Number,
            required: true,
        },

        oldPrice: {
            type: Number,
            default: null,
        },

        stock: {
            type: Number,
            default: 0,
        },

        images: {
            type: [String],
            default: [],
        },

        specifications: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },

        rating: {
            type: Number,
            default: 0,
        },

        reviewCount: {
            type: Number,
            default: 0,
        },

        featured: {
            type: Boolean,
            default: false,
        },

        bestSeller: {
            type: Boolean,
            default: false,
        },

        isNew: {
            type: Boolean,
            default: false,
        },

        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("Product", productSchema);
