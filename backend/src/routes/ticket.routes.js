const express = require("express");
const router = express.Router();

const ticketController = require("../controllers/ticket.controller");

const verificarToken = require("../middleware/auth.middleware");

const verificarRol = require("../middleware/role.middleware");

// Crear ticket
router.post(
    "/",
    verificarToken,
    ticketController.crearTicket
);

// Listar tickets
router.get(
    "/",
    verificarToken,
    ticketController.listarTickets
);

// Obtener ticket por ID
router.get(
    "/:id",
    verificarToken,
    ticketController.obtenerTicketPorId
);

router.put(
    "/:id/estado",
    verificarToken,
    verificarRol("ADMIN", "SOPORTE"),
    ticketController.cambiarEstado
);

module.exports = router;