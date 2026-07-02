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
    }
});

module.exports = Ticket;