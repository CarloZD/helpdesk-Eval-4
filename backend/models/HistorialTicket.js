const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const HistorialTicket = sequelize.define("HistorialTicket", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    comentario: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

module.exports = HistorialTicket;