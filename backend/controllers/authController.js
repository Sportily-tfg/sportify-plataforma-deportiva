const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const register = async (req, res) => {
    try {
      console.log("Body recibido:", req.body); // Verifica los datos de entrada
      const { nombre, email, contraseña } = req.body;
      
      if (!nombre || !email || !contraseña) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
      }
  
      const usuarioExistente = await Usuario.findByEmail(email);
      console.log("Usuario existente:", usuarioExistente); // Debug
  
      if (usuarioExistente) {
        return res.status(400).json({ error: 'Email ya registrado' });
      }
  
      const hashedPassword = await bcrypt.hash(contraseña, 10);
      console.log("Contraseña hasheada:", hashedPassword); // Debug
  
      const userId = await Usuario.create({
        nombre,
        email,
        contraseña: hashedPassword
      });
      console.log("Usuario creado con ID:", userId); // Debug
  
      res.status(201).json({ message: 'Usuario registrado', userId });
    } catch (error) {
      console.error("ERROR EN REGISTRO:", {
        message: error.message,
        stack: error.stack,
        fullError: JSON.stringify(error)
      });
      res.status(500).json({ 
        error: 'Error en el servidor',
        detalle: error.message
      });
    }
  };

const login = async (req, res) => {
  try {
    const { email, contraseña } = req.body;
    
    // Buscar usuario
    const usuario = await Usuario.findByEmail(email);
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.id_usuario, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

module.exports = { register, login };