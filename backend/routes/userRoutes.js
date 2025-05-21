const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const pool = require('../config/db');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

// Obtener todos los usuarios (admin)
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.rol !== 'admin') return res.status(403).json({ error: 'No autorizado' });

    const { rows } = await pool.query(
      `SELECT u.id_usuario, u.nombre, u.email, u.rol, u.fecha_registro,
              COALESCE(SUM(g.puntos), 0) AS puntos
       FROM usuarios u
       LEFT JOIN gamificacion g ON u.id_usuario = g.id_usuario
       GROUP BY u.id_usuario`
    );

    res.json(rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// IMPORTANTE: Rutas específicas antes de rutas con parámetros
// Actualizar perfil propio
router.put('/mi-cuenta', authMiddleware, async (req, res) => {
  console.log('🔄 INICIANDO ACTUALIZACIÓN DE CUENTA');
  console.log('👤 Usuario ID:', req.user.id);
  console.log('📝 Datos recibidos:', req.body);
  
  try {
    const id_usuario = req.user.id;
    const { nombre, email, password } = req.body;

    const campos = [];
    const valores = [];
    let idx = 1;

    if (nombre) {
      campos.push(`nombre = $${idx++}`);
      valores.push(nombre);
      console.log('✅ Actualizando nombre a:', nombre);
    }

    if (email) {
      campos.push(`email = $${idx++}`);
      valores.push(email);
      console.log('✅ Actualizando email a:', email);
    }

    if (password) {
      console.log('🔐 Procesando nueva contraseña');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      campos.push(`contraseña = $${idx++}`);
      valores.push(hashedPassword);
      console.log('✅ Contraseña hasheada correctamente');
    }

    if (campos.length === 0) {
      console.log('❌ No hay datos para actualizar');
      return res.status(400).json({ error: 'No hay datos para actualizar' });
    }

    valores.push(id_usuario);
    
    console.log('🔄 Ejecutando consulta SQL:');
    console.log(`UPDATE usuarios SET ${campos.join(', ')} WHERE id_usuario = $${idx} RETURNING id_usuario, nombre, email`);
    console.log('📊 Valores:', valores);

    const result = await pool.query(
      `UPDATE usuarios 
       SET ${campos.join(', ')} 
       WHERE id_usuario = $${idx} 
       RETURNING id_usuario, nombre, email`,
      valores
    );

    console.log('✅ Actualización exitosa. Datos actualizados:', result.rows[0]);
    res.json({ message: 'Datos actualizados correctamente', usuario: result.rows[0] });
  } catch (err) {
    console.error('❌ ERROR al actualizar datos:', err);
    console.error('📝 Detalles del error:', err.message);
    if (err.code) console.error('📝 Código de error SQL:', err.code);
    if (err.constraint) console.error('📝 Restricción violada:', err.constraint);
    res.status(500).json({ error: 'Error del servidor al actualizar usuario' });
  }
});

// Eliminar cuenta propia
router.delete('/mi-cuenta', authMiddleware, async (req, res) => {
  console.log('🗑️ INICIANDO ELIMINACIÓN DE CUENTA PROPIA');
  console.log('👤 Usuario ID:', req.user.id);
  
  try {
    const id_usuario = req.user.id;
    
    console.log('🔄 Eliminando canjes del usuario');
    const canjesResult = await pool.query('DELETE FROM canjes WHERE id_usuario = $1 RETURNING id_canje', [id_usuario]);
    console.log(`✅ ${canjesResult.rowCount} canjes eliminados`);
    
    console.log('🔄 Eliminando reservas del usuario');
    const reservasResult = await pool.query('DELETE FROM reservas WHERE id_usuario = $1 RETURNING id_reserva', [id_usuario]);
    console.log(`✅ ${reservasResult.rowCount} reservas eliminadas`);
    
    console.log('🔄 Eliminando gamificación del usuario');
    const gamificacionResult = await pool.query('DELETE FROM gamificacion WHERE id_usuario = $1 RETURNING id_gamificacion', [id_usuario]);
    console.log(`✅ ${gamificacionResult.rowCount} registros de gamificación eliminados`);
    
    console.log('🔄 Eliminando usuario');
    const usuarioResult = await pool.query('DELETE FROM usuarios WHERE id_usuario = $1 RETURNING id_usuario', [id_usuario]);
    console.log(`✅ ${usuarioResult.rowCount} usuario eliminado`);

    console.log('✅ Cuenta eliminada correctamente');
    res.json({ message: 'Cuenta eliminada correctamente' });
  } catch (err) {
    console.error('❌ ERROR al eliminar cuenta:', err);
    console.error('📝 Detalles del error:', err.message);
    if (err.code) console.error('📝 Código de error SQL:', err.code);
    if (err.constraint) console.error('📝 Restricción violada:', err.constraint);
    res.status(500).json({ error: 'Error del servidor al eliminar cuenta' });
  }
});

// Añadir ruta para cambiar contraseña
router.put('/cambiar-password', authMiddleware, async (req, res) => {
  console.log('🔐 INICIANDO CAMBIO DE CONTRASEÑA');
  console.log('👤 Usuario ID:', req.user.id);
  
  try {
    const id_usuario = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    console.log('🔄 Verificando datos recibidos');
    if (!currentPassword || !newPassword) {
      console.log('❌ Faltan datos necesarios');
      return res.status(400).json({ error: 'Se requiere contraseña actual y nueva' });
    }
    
    console.log('🔄 Obteniendo contraseña actual del usuario');
    const { rows } = await pool.query(
      'SELECT contraseña FROM usuarios WHERE id_usuario = $1',
      [id_usuario]
    );

    if (rows.length === 0) {
      console.log('❌ Usuario no encontrado en la base de datos');
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    console.log('🔄 Verificando contraseña actual');
    const isMatch = await bcrypt.compare(currentPassword, rows[0].contraseña);

    if (!isMatch) {
      console.log('❌ Contraseña actual incorrecta');
      return res.status(400).json({ error: 'Contraseña actual incorrecta' });
    }
    
    console.log('✅ Contraseña actual verificada correctamente');
    console.log('🔄 Generando hash para nueva contraseña');
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    console.log('🔄 Actualizando contraseña en la base de datos');
    const updateResult = await pool.query(
      'UPDATE usuarios SET contraseña = $1 WHERE id_usuario = $2 RETURNING id_usuario',
      [hashedPassword, id_usuario]
    );
    
    console.log('✅ Contraseña actualizada correctamente');
    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    console.error('❌ ERROR al cambiar contraseña:', err);
    console.error('📝 Detalles del error:', err.message);
    if (err.code) console.error('📝 Código de error SQL:', err.code);
    if (err.constraint) console.error('📝 Restricción violada:', err.constraint);
    res.status(500).json({ error: 'Error del servidor al cambiar contraseña' });
  }
});

// DESPUÉS de las rutas específicas, las rutas con parámetros
// Obtener perfil de usuario
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    if (parseInt(req.params.id) !== req.user.id && req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    const reservas = await pool.query(
      `SELECT r.id_reserva, a.nombre_actividad, r.fecha_reserva, r.estado
       FROM reservas r
       JOIN actividades a ON r.id_actividad = a.id_actividad
       WHERE r.id_usuario = $1`,
      [req.params.id]
    );

    const recompensas = await pool.query(
      `SELECT r.nombre_recompensa, c.fecha_canje
       FROM canjes c
       JOIN recompensas r ON c.id_recompensa = r.id_recompensa
       WHERE c.id_usuario = $1`,
      [req.params.id]
    );

    res.json({
      usuario,
      reservas: reservas.rows,
      recompensas: recompensas.rows
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Actualizar otro usuario (admin o el mismo usuario)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (parseInt(req.params.id) !== req.user.id && req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const { nombre, email, rol } = req.body;

    const { rows } = await pool.query(
      `UPDATE usuarios 
       SET nombre = $1, email = $2, rol = $3 
       WHERE id_usuario = $4
       RETURNING id_usuario, nombre, email, rol, fecha_registro`,
      [nombre, email, rol, req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Eliminar usuario (solo admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  console.log('🗑️ INICIANDO ELIMINACIÓN DE USUARIO (ADMIN)');
  console.log('👤 Usuario a eliminar ID:', req.params.id);
  console.log('👮 Admin ID:', req.user.id);
  
  try {
    if (req.user.rol !== 'admin') {
      console.log('❌ Usuario no es administrador');
      return res.status(403).json({ error: 'No autorizado' });
    }
    
    if (parseInt(req.params.id) === req.user.id) {
      console.log('❌ Intento de auto-eliminación');
      return res.status(400).json({ error: 'No puedes eliminarte a ti mismo' });
    }
    
    console.log('🔄 Eliminando usuario de la base de datos');
    const result = await pool.query('DELETE FROM usuarios WHERE id_usuario = $1 RETURNING id_usuario', [req.params.id]);
    
    if (result.rowCount === 0) {
      console.log('❌ Usuario no encontrado');
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    console.log('✅ Usuario eliminado correctamente');
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('❌ ERROR al eliminar usuario:', error);
    console.error('📝 Detalles del error:', error.message);
    if (error.code) console.error('📝 Código de error SQL:', error.code);
    if (error.constraint) console.error('📝 Restricción violada:', error.constraint);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;