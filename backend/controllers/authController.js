const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

/**
 * Controlador para el registro de usuarios
 * Valida datos, verifica duplicados y guarda en PostgreSQL
 */
const register = async (req, res) => {
    try {
        const { nombre, email, contraseña } = req.body;
        
        // Validación básica de campos
        if (!nombre || !email || !contraseña) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        // Verificar si el email ya existe
        const usuarioExistente = await Usuario.findByEmail(email);
        if (usuarioExistente) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(contraseña, 10);

        // Crear usuario en la base de datos
        const userId = await Usuario.create({
            nombre,
            email,
            contraseña: hashedPassword
        });

        res.status(201).json({ 
            message: 'Usuario registrado con éxito', 
            userId 
        });

    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ 
            error: 'Error en el servidor',
            detalle: error.message 
        });
    }
};

/**
 * Controlador para el login de usuarios
 * Verifica credenciales y genera JWT
 */
const login = async (req, res) => {
    try {
        const { email, contraseña } = req.body;
        
        // Buscar usuario en la base de datos
        const usuario = await Usuario.findByEmail(email);
        if (!usuario) {
            return res.status(401).json({ error: 'Email no registrado' });
        }

        // Comparar contraseñas hasheadas
        const isMatch = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!isMatch) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Generar token JWT válido por 1 hora
        const token = jwt.sign(
            { 
                id: usuario.id_usuario,
                email: usuario.email,
                nombre: usuario.nombre,
                rol: usuario.rol // Añadir rol al token
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ 
            token,
            user: {
                id: usuario.id_usuario,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol // Añadir rol a la respuesta
            }
        });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ 
            error: 'Error al iniciar sesión',
            detalle: error.message 
        });
    }
};

module.exports = { register, login };