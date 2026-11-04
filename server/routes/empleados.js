// Módulo EMPLEADOS (base del proyecto)
const router = require('express').Router();
const { db, manejarError, validarId } = require('../db');

router.get('/empleados', (req, res) => {
  db.query('SELECT * FROM empleados ORDER BY id DESC', (err, rows) => err ? manejarError(res, err) : res.json(rows));
});
router.post(['/create', '/empleados'], (req, res) => {
  const { nombre, edad, pais, cargo, correo } = req.body;
  if (!nombre || !edad || !pais || !cargo || !correo) return res.status(400).json({ error: 'Completa todos los campos del empleado.' });
  db.query('INSERT INTO empleados (nombre, edad, pais, cargo, correo) VALUES (?, ?, ?, ?, ?)', [nombre.trim(), Number(edad), pais.trim(), cargo.trim(), correo.trim()], (err, result) => err ? manejarError(res, err) : res.status(201).json({ mensaje: 'Empleado registrado.', id: result.insertId }));
});
router.put(['/update', '/empleados/:id'], (req, res) => {
  const id = req.params.id || req.body.id;
  const { nombre, edad, pais, cargo, correo } = req.body;
  if (!validarId(id) || !nombre || !edad || !pais || !cargo || !correo) return res.status(400).json({ error: 'ID o datos del empleado no válidos.' });
  db.query('UPDATE empleados SET nombre=?, edad=?, pais=?, cargo=?, correo=? WHERE id=?', [nombre.trim(), Number(edad), pais.trim(), cargo.trim(), correo.trim(), Number(id)], (err, result) => {
    if (err) return manejarError(res, err);
    if (!result.affectedRows) return res.status(404).json({ error: 'Empleado no encontrado.' });
    res.json({ mensaje: 'Empleado actualizado.' });
  });
});
router.delete(['/delete/:id', '/empleados/:id'], (req, res) => {
  if (!validarId(req.params.id)) return res.status(400).json({ error: 'ID no válido.' });
  db.query('DELETE FROM empleados WHERE id=?', [Number(req.params.id)], (err, result) => {
    if (err) return manejarError(res, err);
    if (!result.affectedRows) return res.status(404).json({ error: 'Empleado no encontrado.' });
    res.json({ mensaje: 'Empleado eliminado.' });
  });
});

module.exports = router;