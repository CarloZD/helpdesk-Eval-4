const { Sequelize } = require("sequelize");
const path = require("path");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.join(__dirname, "../../database/helpdesk.sqlite"),
    logging: false
});

async function conectarDB() {
    try {
        await sequelize.authenticate();
        console.log("✅ Base de datos SQLite conectada.");
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

conectarDB();

module.exports = sequelize;