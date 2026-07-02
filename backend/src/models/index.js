const sequelize = require("../config/database");

const Usuario = require("./Usuario");
const Ticket = require("./Ticket");
const HistorialTicket = require("./HistorialTicket");

// =====================
// Relaciones
// =====================

// Un cliente crea muchos tickets
Usuario.hasMany(Ticket, {
    foreignKey: "cliente_id",
    as: "ticketsCliente"
});

Ticket.belongsTo(Usuario, {
    foreignKey: "cliente_id",
    as: "cliente"
});

// Un soporte atiende muchos tickets
Usuario.hasMany(Ticket, {
    foreignKey: "soporte_id",
    as: "ticketsSoporte"
});

Ticket.belongsTo(Usuario, {
    foreignKey: "soporte_id",
    as: "soporte"
});

// Un ticket tiene muchos comentarios
Ticket.hasMany(HistorialTicket, {
    foreignKey: "ticket_id",
    as: "historial"
});

HistorialTicket.belongsTo(Ticket, {
    foreignKey: "ticket_id"
});

// Un usuario puede escribir muchos comentarios
Usuario.hasMany(HistorialTicket, {
    foreignKey: "usuario_id"
});

HistorialTicket.belongsTo(Usuario, {
    foreignKey: "usuario_id"
});

module.exports = {
    sequelize,
    Usuario,
    Ticket,
    HistorialTicket
};