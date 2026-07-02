const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Estado = sequelize.define("Estado", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Estado;