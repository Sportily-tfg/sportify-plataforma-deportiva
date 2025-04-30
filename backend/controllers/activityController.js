const Actividad = require('../models/Actividad');

/**
 * Controlador para gestionar actividades deportivas
 */
const activityController = {
    // Obtener todas las actividades
    getAllActivities: async (req, res) => {
        try {
            const actividades = await Actividad.getAll();
            res.json(actividades);
        } catch (error) {
            console.error('Error al obtener actividades:', error);
            res.status(500).json({ error: 'Error del servidor' });
        }
    },

    // Crear una nueva actividad (solo para administradores)
    createActivity: async (req, res) => {
        try {
            if (req.user.rol !== 'admin') {
                return res.status(403).json({ error: 'No autorizado' });
            }

            const { nombre_actividad, descripcion, descripcion_larga, nivel_dificultad, max_participantes, precio } = req.body;

            // Validación básica
            if (!nombre_actividad || !descripcion || !nivel_dificultad || !max_participantes || !precio) {
                return res.status(400).json({ error: 'Faltan campos obligatorios' });
            }

            const nuevaActividad = await Actividad.create({
                nombre_actividad,
                descripcion,
                descripcion_larga,
                nivel_dificultad,
                max_participantes,
                precio
            });

            res.status(201).json(nuevaActividad);
        } catch (error) {
            console.error('Error al crear actividad:', error);
            res.status(500).json({ error: 'Error del servidor' });
        }
    },

    // Actualizar una actividad (solo para administradores)
    updateActivity: async (req, res) => {
        try {
            if (req.user.rol !== 'admin') {
                return res.status(403).json({ error: 'No autorizado' });
            }

            const { id } = req.params;
            const { nombre_actividad, descripcion, descripcion_larga, nivel_dificultad, max_participantes, precio } = req.body;

            const actividadActualizada = await Actividad.update(id, {
                nombre_actividad,
                descripcion,
                descripcion_larga,
                nivel_dificultad,
                max_participantes,
                precio
            });

            if (!actividadActualizada) {
                return res.status(404).json({ error: 'Actividad no encontrada' });
            }

            res.json(actividadActualizada);
        } catch (error) {
            console.error('Error al actualizar actividad:', error);
            res.status(500).json({ error: 'Error del servidor' });
        }
    },

    // Eliminar una actividad (solo para administradores)
    deleteActivity: async (req, res) => {
        try {
            if (req.user.rol !== 'admin') {
                return res.status(403).json({ error: 'No autorizado' });
            }

            const { id } = req.params;
            const eliminado = await Actividad.delete(id);

            if (!eliminado) {
                return res.status(404).json({ error: 'Actividad no encontrada' });
            }

            res.json({ message: 'Actividad eliminada correctamente' });
        } catch (error) {
            console.error('Error al eliminar actividad:', error);
            res.status(500).json({ error: 'Error del servidor' });
        }
    }
};

module.exports = activityController;