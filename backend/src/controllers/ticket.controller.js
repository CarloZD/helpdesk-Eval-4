const { Ticket, Usuario, HistorialTicket } = require("../models");

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
// =====================
// Agregar Comentario
// =====================
exports.agregarComentario = async (req, res) => {

    try {

        const { id } = req.params;
        const { comentario } = req.body;

        if (!comentario) {
            return res.status(400).json({
                mensaje: "El comentario es obligatorio."
            });
        }

        const ticket = await Ticket.findByPk(id);

        if (!ticket) {
            return res.status(404).json({
                mensaje: "Ticket no encontrado."
            });
        }

        const historial = await HistorialTicket.create({
            comentario,
            ticket_id: ticket.id,
            usuario_id: req.usuario.id
        });

        res.status(201).json({
            mensaje: "Comentario agregado correctamente.",
            historial
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error interno del servidor."
        });

    }

};
// =====================
// Listar Historial
// =====================
exports.obtenerHistorial = async (req, res) => {

    try {

        const { id } = req.params;

        const ticket = await Ticket.findByPk(id);

        if (!ticket) {
            return res.status(404).json({
                mensaje: "Ticket no encontrado."
            });
        }

        const historial = await HistorialTicket.findAll({

            where: {
                ticket_id: id
            },

            include: [
                {
                    model: Usuario,
                    attributes: [
                        "id",
                        "nombre",
                        "correo",
                        "rol"
                    ]
                }
            ],

            order: [
                ["createdAt", "ASC"]
            ]

        });

        res.json(historial);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error interno del servidor."
        });

    }

};
// =====================
// Asignar Soporte
// =====================
exports.asignarSoporte = async (req, res) => {

    try {

        const { id } = req.params;
        const { soporte_id } = req.body;

        const ticket = await Ticket.findByPk(id);

        if (!ticket) {
            return res.status(404).json({
                mensaje: "Ticket no encontrado."
            });
        }

        const soporte = await Usuario.findByPk(soporte_id);

        if (!soporte) {
            return res.status(404).json({
                mensaje: "Usuario soporte no encontrado."
            });
        }

        if (soporte.rol !== "SOPORTE") {
            return res.status(400).json({
                mensaje: "El usuario debe tener rol SOPORTE."
            });
        }

        ticket.soporte_id = soporte.id;

        await ticket.save();

        await HistorialTicket.create({
            comentario: `Ticket asignado a ${soporte.nombre}`,
            ticket_id: ticket.id,
            usuario_id: req.usuario.id
        });

        res.json({
            mensaje: "Soporte asignado correctamente.",
            ticket
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error interno del servidor."
        });

    }

};