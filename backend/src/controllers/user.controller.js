const { Usuario } = require("../models");

// =====================
// Listar Usuarios
// =====================
exports.listarUsuarios = async (req, res) => {

    try {

        const usuarios = await Usuario.findAll({
            attributes: {
                exclude: ["password"]
            }
        });

        res.json(usuarios);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error interno del servidor."
        });

    }

};

// =====================
// Obtener Usuario
// =====================
exports.obtenerUsuario = async (req, res) => {

    try {

        const usuario = await Usuario.findByPk(
            req.params.id,
            {
                attributes: {
                    exclude: ["password"]
                }
            }
        );

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado."
            });
        }

        res.json(usuario);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error interno del servidor."
        });

    }

};

// =====================
// Actualizar Usuario
// =====================
exports.actualizarUsuario = async (req, res) => {

    try {

        const usuario = await Usuario.findByPk(req.params.id);

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado."
            });
        }

        const { nombre, correo, rol } = req.body;

        await usuario.update({
            nombre,
            correo,
            rol
        });

        res.json({
            mensaje: "Usuario actualizado correctamente.",
            usuario
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error interno del servidor."
        });

    }

};

// =====================
// Eliminar Usuario
// =====================
exports.eliminarUsuario = async (req, res) => {

    try {

        const usuario = await Usuario.findByPk(req.params.id);

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado."
            });
        }

        await usuario.destroy();

        res.json({
            mensaje: "Usuario eliminado correctamente."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error interno del servidor."
        });

    }

};