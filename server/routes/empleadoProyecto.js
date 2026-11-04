// Módulo ASIGNACIONES (empleado - proyecto)
const router = require('express').Router();
const { db, manejarError, validarId } = require('../db');

router.get('/empleado-proyecto', (req, res) => {
  const sql = `SELECT ep.empleado_id, ep.proyecto_id, e.nombre AS empleado_nombre, p.nombre_proyecto
    FROM empleado_proyecto ep
    INNER JOIN empleados e ON e.id = ep.empleado_id
    INNER JOIN proyectos p ON p.id = ep.proyecto_id
    ORDER BY e.nombre, p.nombre_proyecto`;
  db.query(sql, (err, rows) => err ? manejarError(res, err) : res.json(rows));
});
router.post('/empleado-proyecto', (req, res) => {
  const { empleado_id, proyecto_id } = req.body;
  if (!validarId(empleado_id) || !validarId(proyecto_id)) return res.status(400).json({ error: 'Selecciona un empleado y un proyecto válidos.' });
  db.query('INSERT INTO empleado_proyecto (empleado_id, proyecto_id) VALUES (?, ?)', [Number(empleado_id), Number(proyecto_id)], (err) => err ? manejarError(res, err) : res.status(201).json({ mensaje: 'Asignación creada.' }));
});
router.delete('/empleado-proyecto/:empleado_id/:proyecto_id', (req, res) => {
  const { empleado_id, proyecto_id } = req.params;
  if (!validarId(empleado_id) || !validarId(proyecto_id)) return res.status(400).json({ error: 'IDs no válidos.' });
  db.query('DELETE FROM empleado_proyecto WHERE empleado_id=? AND proyecto_id=?', [Number(empleado_id), Number(proyecto_id)], (err, result) => {
    if (err) return manejarError(res, err);
    if (!result.affectedRows) return res.status(404).json({ error: 'Asignación no encontrada.' });
    res.json({ mensaje: 'Asignación eliminada.' });
  });
});

module.exports = router;