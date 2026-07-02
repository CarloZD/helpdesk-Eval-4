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

router.post(
    "/:id/comentarios",
    verificarToken,
    ticketController.agregarComentario
);

router.get(
    "/:id/comentarios",
    verificarToken,
    ticketController.obtenerHistorial
);

router.put(
    "/:id/asignar",
    verificarToken,
    verificarRol("ADMIN"),
    ticketController.asignarSoporte
);

router.delete(
    "/:id",
    verificarToken,
    verificarRol("ADMIN"),
    ticketController.eliminarTicket
);

module.exports = router;