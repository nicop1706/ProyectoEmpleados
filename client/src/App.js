import './App.css';
import { useCallback, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { API } from './comun';
import * as Empleados from './components/Empleados';
import * as Proyectos from './components/Proyectos';
import * as Asignaciones from './components/Asignaciones';
import * as Salarios from './components/Salarios';

// Cada módulo (archivo de src/components) exporta: meta, resumen() y el componente por defecto.
const MODULOS = [Empleados, Proyectos, Asignaciones, Salarios];

function App() {
  const [seccion, setSeccion] = useState('empleados');
  const [resumenes, setResumenes] = useState({});
  const [error, setError] = useState('');

  // Cada módulo informa su cantidad (menú lateral) y su dato clave (cabecera).
  const cargarResumenes = useCallback(async () => {
    const nuevos = {};
    let fallos = 0;
    let mensaje = '';
    await Promise.all(MODULOS.map(async (m) => {
      try { nuevos[m.meta.id] = await m.resumen(); }
      catch (e) { fallos += 1; mensaje = e.response?.data?.error || ''; }
    }));
    setResumenes((previos) => ({ ...previos, ...nuevos }));
    setError(fallos ? (mensaje || `No se pudo conectar con el servidor en ${API}. Inicia el backend con "npm start" en la carpeta server y revisa que MySQL esté encendido.`) : '');
  }, []);
  useEffect(() => { cargarResumenes(); }, [cargarResumenes]);

  const actual = MODULOS.find((m) => m.meta.id === seccion) || MODULOS[0];
  const Modulo = actual.default;
  const datoClave = resumenes[actual.meta.id]?.clave || ['—', ''];

  return (
    <div className="app">
      <aside className="lateral">
        <div className="marca">
          <h1>Gestión de empleados</h1>
          <p>Equipo, proyectos y salarios</p>
        </div>
        <nav aria-label="Secciones">
          <ul className="menu">
            {MODULOS.map((m) => (
              <li key={m.meta.id}>
                <button type="button" aria-current={seccion === m.meta.id ? 'page' : undefined} onClick={() => setSeccion(m.meta.id)}>
                  <span>{m.meta.texto}</span><span className="cuenta">{resumenes[m.meta.id]?.cuenta ?? 0}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="lateral-pie">Fullstack Developer Software · SENATI</div>
      </aside>

      <main className="principal">
        <header className="cabecera">
          <div><h2>{actual.meta.titulo}</h2><p>{actual.meta.detalle}</p></div>
          <div className="dato-clave"><strong>{datoClave[0]}</strong><span>{datoClave[1]}</span></div>
        </header>

        {error && <div className="aviso" role="alert"><div><strong>Algo salió mal</strong>{error}</div></div>}

        <Modulo key={actual.meta.id} onCambio={cargarResumenes} />

        <footer className="pie">Proyecto académico · React, Node.js y MySQL</footer>
      </main>
    </div>
  );
}
export default App;