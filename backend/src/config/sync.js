const { sequelize } = require("../models");

async function sincronizarBD() {
    try {
        await sequelize.sync({
            alter: true
        });

        console.log("✅ Base de datos sincronizada.");
    } catch (error) {
        console.error(error);
    }
}

module.exports = sincronizarBD;