const sequelize = require("../config/database");

const Usuario = require("./Usuario");
const Ticket = require("./Ticket");
const HistorialTicket = require("./HistorialTicket");

// Relaciones
Usuario.hasMany(Ticket, { foreignKey: "cliente_id", as: "ticketsCliente" });
Usuario.hasMany(Ticket, { foreignKey: "soporte_id", as: "ticketsSoporte" });

Ticket.belongsTo(Usuario, { foreignKey: "cliente_id", as: "cliente" });
Ticket.belongsTo(Usuario, { foreignKey: "soporte_id", as: "soporte" });

Ticket.hasMany(HistorialTicket, { foreignKey: "ticket_id" });
HistorialTicket.belongsTo(Ticket, { foreignKey: "ticket_id" });

Usuario.hasMany(HistorialTicket, { foreignKey: "usuario_id" });
HistorialTicket.belongsTo(Usuario, { foreignKey: "usuario_id" });

module.exports = {
    sequelize,
    Usuario,
    Ticket,
    HistorialTicket
};