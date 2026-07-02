const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");

const verificarToken = require("../middleware/auth.middleware");
const verificarRol = require("../middleware/role.middleware");

router.get(
    "/",
    verificarToken,
    verificarRol("ADMIN"),
    userController.listarUsuarios
);

router.get(
    "/:id",
    verificarToken,
    verificarRol("ADMIN"),
    userController.obtenerUsuario
);

router.put(
    "/:id",
    verificarToken,
    verificarRol("ADMIN"),
    userController.actualizarUsuario
);

router.delete(
    "/:id",
    verificarToken,
    verificarRol("ADMIN"),
    userController.eliminarUsuario
);

module.exports = router;