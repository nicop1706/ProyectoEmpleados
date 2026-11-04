require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Servidor funcionando'));
app.use('/empleados', require('./routes/empleados'));
app.use('/proyectos', require('./routes/proyectos'));
app.use('/empleado-proyecto', require('./routes/empleadoProyecto'));
app.use('/salarios', require('./routes/salarios'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));