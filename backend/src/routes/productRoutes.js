const express = require("express");

const router = express.Router();

const productController = require("../controllers/productController");

// GET /api/products
router.get("/", productController.getProducts);

// GET /api/products/:slug
router.get("/:slug", productController.getProduct);

// POST /api/products
router.post("/", productController.createProduct);

// PUT /api/products/:slug
router.put("/:slug", productController.updateProduct);

// DELETE /api/products/:slug
router.delete("/:slug", productController.deleteProduct);

module.exports = router;
