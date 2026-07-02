const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboard.controller");

const verificarToken = require("../middleware/auth.middleware");
const verificarRol = require("../middleware/role.middleware");

router.get(
    "/admin",
    verificarToken,
    verificarRol("ADMIN"),
    dashboardController.dashboardAdmin
);

router.get(
    "/soporte",
    verificarToken,
    verificarRol("SOPORTE"),
    dashboardController.dashboardSoporte
);

router.get(
    "/cliente",
    verificarToken,
    verificarRol("CLIENTE"),
    dashboardController.dashboardCliente
);

module.exports = router;