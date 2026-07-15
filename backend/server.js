require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const cpuPath = path.join(__dirname, "data", "cpuData.json");
const gpuPath = path.join(__dirname, "data", "gpuData.json");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server listen http://localhost:${PORT}`);
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Success"))
    .catch((err) => console.error("MongoDB Error TnT", err));

app.get("/", (req, res) => {
    res.json({ message: "Hello World !" });
});

app.get("/api/status", (req, res) => {
    res.json({
        status: "API online",
        db_state: mongoose.connection.readyState === 1 ? "Yes" : "No",
    });
});

app.get("/api/cpu", (req, res) => {
    const data = JSON.parse(fs.readFileSync(cpuPath, "utf8"));
    res.json(data);
});

app.get("/api/gpu", (req, res) => {
    const data = JSON.parse(fs.readFileSync(gpuPath, "utf-8"));
    res.json(data);
});
