const express = require("express");
const router = express.Router();

const ticketController = require("../controllers/ticket.controller");

const verificarToken = require("../middleware/auth.middleware");

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

module.exports = router;