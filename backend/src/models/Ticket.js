const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Ticket = sequelize.define("Ticket", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM(
            "PENDIENTE",
            "EN_PROCESO",
            "RESUELTO",
            "CERRADO"
        ),
        defaultValue: "PENDIENTE"
    }
});

module.exports = Ticket;