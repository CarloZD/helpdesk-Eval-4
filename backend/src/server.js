require("dotenv").config();

const app = require("./app");
const sincronizarBD = require("./config/sync");

const PORT = process.env.PORT || 3001;

async function iniciarServidor() {
    await sincronizarBD();

    app.listen(PORT, () => {
        console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
    });
}

iniciarServidor();