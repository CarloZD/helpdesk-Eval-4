const { sequelize } = require("../models");

async function sincronizarBD() {
    try {
        await sequelize.sync();

        console.log("✅ Base de datos sincronizada.");
    } catch (error) {
        console.error(error);
    }
}

module.exports = sincronizarBD;