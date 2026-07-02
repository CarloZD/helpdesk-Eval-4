const express = require("express");
const router = express.Router();

const verificarToken = require("../middleware/auth.middleware");
const verificarRol = require("../middleware/role.middleware");

router.get(
    "/admin",
    verificarToken,
    verificarRol("ADMIN"),
    (req, res) => {

        res.json({
            mensaje: "Bienvenido administrador",
            usuario: req.usuario
        });

    }
);

module.exports = router;