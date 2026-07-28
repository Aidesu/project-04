const express = require("express");
const cors = require("cors");

const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "API Online",
    });
});

app.use("/api/categories", categoryRoutes);
app.use("api/products", productRoutes);

module.exports = app;
