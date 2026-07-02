const { Ticket } = require("../models");

exports.dashboardAdmin = async (req, res) => {
    try {

        const totalTickets = await Ticket.count();

        const pendientes = await Ticket.count({
            where: { estado: "PENDIENTE" }
        });

        const enProceso = await Ticket.count({
            where: { estado: "EN_PROCESO" }
        });

        const resueltos = await Ticket.count({
            where: { estado: "RESUELTO" }
        });

        const cerrados = await Ticket.count({
            where: { estado: "CERRADO" }
        });

        res.json({
            totalTickets,
            pendientes,
            enProceso,
            resueltos,
            cerrados
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error interno del servidor"
        });
    }
};

exports.dashboardSoporte = async (req, res) => {
    try {

        const totalTickets = await Ticket.count({
            where: { soporte_id: req.usuario.id }
        });

        const pendientes = await Ticket.count({
            where: {
                soporte_id: req.usuario.id,
                estado: "PENDIENTE"
            }
        });

        const enProceso = await Ticket.count({
            where: {
                soporte_id: req.usuario.id,
                estado: "EN_PROCESO"
            }
        });

        const resueltos = await Ticket.count({
            where: {
                soporte_id: req.usuario.id,
                estado: "RESUELTO"
            }
        });

        res.json({
            totalTickets,
            pendientes,
            enProceso,
            resueltos
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error interno del servidor"
        });
    }
};

exports.dashboardCliente = async (req, res) => {
    try {

        const totalTickets = await Ticket.count({
            where: { cliente_id: req.usuario.id }
        });

        const pendientes = await Ticket.count({
            where: {
                cliente_id: req.usuario.id,
                estado: "PENDIENTE"
            }
        });

        const enProceso = await Ticket.count({
            where: {
                cliente_id: req.usuario.id,
                estado: "EN_PROCESO"
            }
        });

        const resueltos = await Ticket.count({
            where: {
                cliente_id: req.usuario.id,
                estado: "RESUELTO"
            }
        });

        res.json({
            totalTickets,
            pendientes,
            enProceso,
            resueltos
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error interno del servidor"
        });
    }
};