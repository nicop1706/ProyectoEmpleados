
// Módulo PROYECTOS: crear, listar, editar y eliminar.
const router = require('express').Router();
const { db, manejarError, validarId } = require('../db');

// Listar proyectos
router.get('/proyectos', (req, res) => {
  db.query(
    'SELECT * FROM proyectos ORDER BY id DESC',
    (err, rows) => {
      if (err) return manejarError(res, err);
      res.json(rows);
    }
  );
});

// Registrar proyecto
router.post('/proyectos', (req, res) => {
  const { nombre_proyecto, descripcion } = req.body;

  if (!nombre_proyecto || !nombre_proyecto.trim()) {
    return res.status(400).json({
      error: 'El nombre del proyecto es obligatorio.'
    });
  }

  db.query(
    'INSERT INTO proyectos (nombre_proyecto, descripcion) VALUES (?, ?)',
    [nombre_proyecto.trim(), descripcion?.trim() || null],
    (err, result) => {
      if (err) return manejarError(res, err);

      res.status(201).json({
        mensaje: 'Proyecto registrado.',
        id: result.insertId
      });
    }
  );
});

// Actualizar proyecto
router.put('/proyectos/:id', (req, res) => {
  const id = req.params.id;
  const { nombre_proyecto, descripcion } = req.body;

  if (!validarId(id) || !nombre_proyecto || !nombre_proyecto.trim()) {
    return res.status(400).json({
      error: 'ID o nombre del proyecto no válido.'
    });
  }

  db.query(
    'UPDATE proyectos SET nombre_proyecto = ?, descripcion = ? WHERE id = ?',
    [nombre_proyecto.trim(), descripcion?.trim() || null, Number(id)],
    (err, result) => {
      if (err) return manejarError(res, err);

      if (!result.affectedRows) {
        return res.status(404).json({
          error: 'Proyecto no encontrado.'
        });
      }

      res.json({ mensaje: 'Proyecto actualizado.' });
    }
  );
});

// Eliminar proyecto
router.delete('/proyectos/:id', (req, res) => {
  const id = req.params.id;

  if (!validarId(id)) {
    return res.status(400).json({
      error: 'ID no válido.'
    });
  }

  db.query(
    'DELETE FROM proyectos WHERE id = ?',
    [Number(id)],
    (err, result) => {
      if (err) return manejarError(res, err);

      if (!result.affectedRows) {
        return res.status(404).json({
          error: 'Proyecto no encontrado.'
        });
      }

      res.json({ mensaje: 'Proyecto eliminado.' });
    }
  );
});

module.exports = router;
