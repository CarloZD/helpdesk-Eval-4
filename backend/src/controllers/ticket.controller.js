const { Ticket, Usuario } = require("../models");

// =====================
// Crear Ticket
// =====================
exports.crearTicket = async (req, res) => {

    try {

        const { titulo, descripcion } = req.body;

        if (!titulo || !descripcion) {
            return res.status(400).json({
                mensaje: "Todos los campos son obligatorios."
            });
        }

        const ticket = await Ticket.create({
            titulo,
            descripcion,
            cliente_id: req.usuario.id
        });

        res.status(201).json(ticket);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error interno del servidor."
        });

    }

};

// =====================
// Listar Tickets
// =====================
exports.listarTickets = async (req, res) => {

    try {

        const tickets = await Ticket.findAll({
            include: [
                {
                    model: Usuario,
                    as: "cliente",
                    attributes: ["id", "nombre", "correo"]
                },
                {
                    model: Usuario,
                    as: "soporte",
                    attributes: ["id", "nombre", "correo"]
                }
            ]
        });

        res.json(tickets);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error interno del servidor."
        });

    }

};
// =====================
// Obtener Ticket por ID
// =====================
exports.obtenerTicketPorId = async (req, res) => {

    try {

        const { id } = req.params;

        const ticket = await Ticket.findByPk(id, {
            include: [
                {
                    model: Usuario,
                    as: "cliente",
                    attributes: ["id", "nombre", "correo"]
                },
                {
                    model: Usuario,
                    as: "soporte",
                    attributes: ["id", "nombre", "correo"]
                }
            ]
        });

        if (!ticket) {
            return res.status(404).json({
                mensaje: "Ticket no encontrado."
            });
        }

        res.status(200).json(ticket);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error interno del servidor."
        });

    }

};
// =====================
// Cambiar Estado
// =====================
exports.cambiarEstado = async (req, res) => {

    try {

        const { id } = req.params;
        const { estado } = req.body;

        const estadosValidos = [
            "PENDIENTE",
            "EN_PROCESO",
            "RESUELTO",
            "CERRADO"
        ];

        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({
                mensaje: "Estado inválido."
            });
        }

        const ticket = await Ticket.findByPk(id);

        if (!ticket) {
            return res.status(404).json({
                mensaje: "Ticket no encontrado."
            });
        }

        ticket.estado = estado;

        await ticket.save();

        res.json({
            mensaje: "Estado actualizado correctamente.",
            ticket
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error interno del servidor."
        });

    }

};