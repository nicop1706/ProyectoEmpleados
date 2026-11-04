// Servidor principal. Carga automáticamente todos los módulos de la carpeta "rutas".
// Cada integrante agrega su archivo en server/rutas y no necesita tocar este archivo.
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ mensaje: 'API de empleados, proyectos, asignaciones y salarios funcionando.' }));

const carpetaRutas = path.join(__dirname, 'rutas');
fs.readdirSync(carpetaRutas)
  .filter((archivo) => archivo.endsWith('.js'))
  .sort()
  .forEach((archivo) => {
    app.use(require(path.join(carpetaRutas, archivo)));
    console.log(`Módulo cargado: ${archivo}`);
  });

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada.' }));
// JSON mal escrito u otros errores: responder en JSON, no en HTML.
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'El cuerpo de la petición no es un JSON válido.' });
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));