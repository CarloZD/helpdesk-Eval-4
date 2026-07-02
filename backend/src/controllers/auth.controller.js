const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { Usuario } = require("../models");

// ======================
// REGISTRO
// ======================
exports.register = async (req, res) => {
    try {

        const { nombre, correo, password, rol } = req.body || {};

        if (!nombre || !correo || !password || !rol) {
            return res.status(400).json({
                mensaje: "Todos los campos son obligatorios."
            });
        }

        const existeUsuario = await Usuario.findOne({
            where: { correo }
        });

        if (existeUsuario) {
            return res.status(400).json({
                mensaje: "El correo ya está registrado."
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const usuario = await Usuario.create({
            nombre,
            correo,
            password: passwordHash,
            rol
        });

        res.status(201).json({
            mensaje: "Usuario registrado correctamente.",
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error interno del servidor."
        });
    }
};

// ======================
// LOGIN
// ======================
exports.login = async (req, res) => {
    try {

        const { correo, password } = req.body || {};

        if (!correo || !password) {
            return res.status(400).json({
                mensaje: "Correo y contraseña son obligatorios."
            });
        }

        const usuario = await Usuario.findOne({
            where: { correo }
        });

        if (!usuario) {
            return res.status(401).json({
                mensaje: "Credenciales inválidas."
            });
        }

        const passwordValida = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!passwordValida) {
            return res.status(401).json({
                mensaje: "Credenciales inválidas."
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                rol: usuario.rol
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            mensaje: "Login exitoso.",
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error interno del servidor."
        });
    }
};