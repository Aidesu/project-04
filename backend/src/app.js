const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

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

const DB_STATES = ["disconnected", "connected", "connecting", "disconnecting"];

// GET /api/status : santé de l'API et de la connexion MongoDB
app.get("/api/status", (req, res) => {
    const dbState = DB_STATES[mongoose.connection.readyState] || "unknown";

    res.status(dbState === "connected" ? 200 : 503).json({
        status: "online",
        db_state: dbState,
    });
});

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

module.exports = app;
