// Conexión a MySQL y funciones compartidas por todos los módulos.
const mysql = require('mysql');

const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'empleados'
});

db.getConnection((err, conexion) => {
  if (err) {
    console.error('No se pudo conectar con MySQL:', err.message);
    return;
  }
  console.log('Conectado a MySQL: base de datos empleados');
  conexion.release();
});

const manejarError = (res, err) => {
  console.error(err);
  if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Ese registro ya existe.' });
  if (err.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ error: 'El empleado o proyecto seleccionado no existe.' });
  if (err.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).json({ error: 'No se puede eliminar porque existen registros relacionados.' });
  if (err.code === 'ECONNREFUSED' || err.code === 'PROTOCOL_CONNECTION_LOST') return res.status(503).json({ error: 'No hay conexión con MySQL. Enciende MySQL en XAMPP.' });
  if (err.code === 'ER_NO_SUCH_TABLE') return res.status(500).json({ error: 'Falta una tabla en la base de datos. Ejecuta los scripts de la carpeta sql.' });
  return res.status(500).json({ error: 'Error interno del servidor. Revisa la consola de Node.js.' });
};

const validarId = (id) => Number.isInteger(Number(id)) && Number(id) > 0;

module.exports = { db, manejarError, validarId };