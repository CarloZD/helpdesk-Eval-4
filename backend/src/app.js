const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const ticketRoutes = require("./routes/ticket.routes");

require("./config/database");

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);

app.get("/", (req, res) => {
    res.json({
        mensaje: "API Help Desk funcionando"
    });
});

module.exports = app;