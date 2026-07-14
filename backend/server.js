require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => {
    console.log(`Server listen http://localhost:${PORT}`);
});
