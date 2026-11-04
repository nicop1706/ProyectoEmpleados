// Módulo ASIGNACIONES (empleado - proyecto): asignar, listar y quitar.
import { useCallback, useEffect, useState } from 'react';
import Axios from 'axios';
import { API, Campo, Lista, Formulario, BotonesForm, Persona, colAcciones, contiene, confirmar, exito, pedir } from '../comun';

export const meta = {
  id: 'asignaciones',
  orden: 3,
  texto: 'Asignaciones',
  titulo: 'Asignaciones',
  detalle: 'Quién trabaja en qué proyecto. Una persona no puede repetirse en el mismo proyecto.',
};

export async function resumen() {
  const r = await Axios.get(`${API}/empleado-proyecto`);
  const n = r.data.length;
  return { cuenta: n, clave: [n, n === 1 ? 'asignación' : 'asignaciones'] };
}

const vacio = { empleado_id: '', proyecto_id: '' };

export default function Asignaciones({ onCambio }) {
  const [asignaciones, setAsignaciones] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [form, setForm] = useState(vacio);
  const [busqueda, setBusqueda] = useState('');

  const cargarAsignaciones = useCallback(async () => {
    const r = await pedir(() => Axios.get(`${API}/empleado-proyecto`), true);
    if (r) setAsignaciones(r.data);
  }, []);
  useEffect(() => {
    cargarAsignaciones();
    pedir(() => Axios.get(`${API}/empleados`), true).then((r) => r && setEmpleados(r.data));
    pedir(() => Axios.get(`${API}/proyectos`), true).then((r) => r && setProyectos(r.data));
  }, [cargarAsignaciones]);

  const guardar = async (e) => {
    e.preventDefault();
    const r = await pedir(() => Axios.post(`${API}/empleado-proyecto`, { empleado_id: Number(form.empleado_id), proyecto_id: Number(form.proyecto_id) }));
    if (!r) return;
    await cargarAsignaciones(); onCambio(); setForm(vacio);
    exito('Correcto', 'Empleado asignado al proyecto.');
  };
  const borrar = async (a) => {
    const r = await confirmar('¿Quitar asignación?', `${a.empleado_nombre} — ${a.nombre_proyecto}`, 'Sí, quitar');
    if (!r.isConfirmed) return;
    const ok = await pedir(() => Axios.delete(`${API}/empleado-proyecto/${a.empleado_id}/${a.proyecto_id}`));
    if (!ok) return;
    await cargarAsignaciones(); onCambio();
    exito('Correcto', 'Asignación eliminada.');
  };

  const columnas = [
    { clave: 'e', titulo: 'Empleado', celda: (f) => <Persona nombre={f.dato.empleado_nombre} /> },
    { clave: 'p', titulo: 'Proyecto', celda: (f) => f.dato.nombre_proyecto },
    colAcciones(null, borrar, 'Quitar'),
  ];
  const filas = asignaciones.filter((a) => contiene([a.empleado_nombre, a.nombre_proyecto], busqueda))
    .map((a) => ({ key: `${a.empleado_id}-${a.proyecto_id}`, dato: a }));

  return (
    <div className="trabajo">
      <Lista titulo="Asignaciones registradas" etiqueta="asignaciones" busqueda={busqueda} setBusqueda={setBusqueda}
        columnas={columnas} filas={filas}
        vacio={asignaciones.length ? ['Sin resultados', 'Prueba con otro empleado o proyecto.'] : ['Aún no hay asignaciones', 'Elige un empleado y un proyecto para crear la primera.']} />
      <Formulario titulo="Asignar a un proyecto" editando={false}>
        <form onSubmit={guardar}>
          <Campo etiqueta="Empleado" id="asi-emp">
            <select id="asi-emp" className="form-select" required value={form.empleado_id} onChange={(e) => setForm({ ...form, empleado_id: e.target.value })}>
              <option value="">Selecciona un empleado</option>
              {empleados.map((e) => <option key={e.id} value={e.id}>{e.nombre} (ID {e.id})</option>)}
            </select>
          </Campo>
          <Campo etiqueta="Proyecto" id="asi-pro">
            <select id="asi-pro" className="form-select" required value={form.proyecto_id} onChange={(e) => setForm({ ...form, proyecto_id: e.target.value })}>
              <option value="">Selecciona un proyecto</option>
              {proyectos.map((p) => <option key={p.id} value={p.id}>{p.nombre_proyecto}</option>)}
            </select>
          </Campo>
          {(!empleados.length || !proyectos.length) && <p className="nota-form">Necesitas al menos un empleado y un proyecto para crear una asignación.</p>}
          <BotonesForm editando={false} textoCrear="Asignar proyecto" />
        </form>
      </Formulario>
    </div>
  );
}