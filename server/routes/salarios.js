// Módulo SALARIOS
const router = require("express").Router();
const { db, manejarError, validarId } = require("../db");

router.get("/salarios", (req, res) => {
  const sql = `SELECT s.id, s.empleado_id, e.nombre AS empleado_nombre, s.monto,
    DATE_FORMAT(s.fecha_actualizacion, '%Y-%m-%d') AS fecha_actualizacion
    FROM salario s INNER JOIN empleados e ON e.id=s.empleado_id ORDER BY s.fecha_actualizacion DESC, s.id DESC`;
  db.query(sql, (err, rows) => (err ? manejarError(res, err) : res.json(rows)));
});
router.post("/salarios", (req, res) => {
  const { empleado_id, monto, fecha_actualizacion } = req.body;
  if (
    !validarId(empleado_id) ||
    !Number.isFinite(Number(monto)) ||
    Number(monto) <= 0 ||
    !/^\d{4}-\d{2}-\d{2}$/.test(fecha_actualizacion || "")
  )
    return res
      .status(400)
      .json({
        error:
          "Selecciona un empleado e ingresa un monto positivo y una fecha válida.",
      });
  db.query(
    "INSERT INTO salario (empleado_id, monto, fecha_actualizacion) VALUES (?, ?, ?)",
    [Number(empleado_id), Number(monto), fecha_actualizacion],
    (err, result) =>
      err
        ? manejarError(res, err)
        : res
            .status(201)
            .json({ mensaje: "Salario registrado.", id: result.insertId }),
  );
});
router.put("/salarios/:id", (req, res) => {
  const { empleado_id, monto, fecha_actualizacion } = req.body;
  if (
    !validarId(req.params.id) ||
    !validarId(empleado_id) ||
    !Number.isFinite(Number(monto)) ||
    Number(monto) <= 0 ||
    !/^\d{4}-\d{2}-\d{2}$/.test(fecha_actualizacion || "")
  )
    return res.status(400).json({ error: "Datos salariales no válidos." });
  db.query(
    "UPDATE salario SET empleado_id=?, monto=?, fecha_actualizacion=? WHERE id=?",
    [
      Number(empleado_id),
      Number(monto),
      fecha_actualizacion,
      Number(req.params.id),
    ],
    (err, result) => {
      if (err) return manejarError(res, err);
      if (!result.affectedRows)
        return res
          .status(404)
          .json({ error: "Registro salarial no encontrado." });
      res.json({ mensaje: "Salario actualizado." });
    },
  );
});
router.delete("/salarios/:id", (req, res) => {
  if (!validarId(req.params.id))
    return res.status(400).json({ error: "ID no válido." });
  db.query(
    "DELETE FROM salario WHERE id=?",
    [Number(req.params.id)],
    (err, result) => {
      if (err) return manejarError(res, err);
      if (!result.affectedRows)
        return res
          .status(404)
          .json({ error: "Registro salarial no encontrado." });
      res.json({ mensaje: "Salario eliminado." });
    },
  );
});

module.exports = router;
