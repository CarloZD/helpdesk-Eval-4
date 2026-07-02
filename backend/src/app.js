const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/user.routes");
const ticketRoutes = require("./routes/ticket.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const authRoutes = require("./routes/auth.routes");

require("./config/database");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
    res.json({
        mensaje: "API Help Desk funcionando"
    });
});

module.exports = app;