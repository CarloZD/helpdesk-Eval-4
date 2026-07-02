const express = require("express");
const cors = require("cors");

require("./config/database");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        mensaje: "API Help Desk funcionando"
    });
});

module.exports = app;