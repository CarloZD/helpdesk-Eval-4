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