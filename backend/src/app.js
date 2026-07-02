const express = require("express");
const cors = require("cors");

require("./config/database");

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({
        mensaje: "API Help Desk funcionando"
    });
});

module.exports = app;