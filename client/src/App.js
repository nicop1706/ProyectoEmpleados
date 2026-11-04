import { useState } from 'react';
import Empleados from './components/Empleados';
import Proyectos from './components/Proyectos';
import Asignaciones from './components/Asignaciones';
import Salarios from './components/Salarios';

function App() {
  const [seccion, setSeccion] = useState('empleados');
  return (
    <div>
      <nav>
        <button onClick={() => setSeccion('empleados')}>Empleados</button>
        <button onClick={() => setSeccion('proyectos')}>Proyectos</button>
        <button onClick={() => setSeccion('asignaciones')}>Asignaciones</button>
        <button onClick={() => setSeccion('salarios')}>Salarios</button>
      </nav>
      {seccion === 'empleados' && <Empleados />}
      {seccion === 'proyectos' && <Proyectos />}
      {seccion === 'asignaciones' && <Asignaciones />}
      {seccion === 'salarios' && <Salarios />}
    </div>
  );
}
export default App;