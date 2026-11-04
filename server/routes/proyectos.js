// Módulo PROYECTOS: crear, listar, editar y eliminar.
// Responsable: <nombre del integrante 1>
import { useCallback, useEffect, useRef, useState } from 'react';
import Axios from 'axios';
import { API, Campo, Lista, Formulario, BotonesForm, colAcciones, contiene, confirmar, exito, pedir } from '../comun';

export const meta = {
  id: 'proyectos',
  orden: 2,
  texto: 'Proyectos',
  titulo: 'Proyectos',
  detalle: 'Los proyectos en los que trabaja la empresa, con su descripción.',
};

export async function resumen() {
  const r = await Axios.get(`${API}/proyectos`);
  const n = r.data.length;
  return { cuenta: n, clave: [n, n === 1 ? 'proyecto activo' : 'proyectos activos'] };
}

const vacio = { nombre_proyecto: '', descripcion: '' };

export default function Proyectos({ onCambio }) {
  const [proyectos, setProyectos] = useState([]);
  const [form, setForm] = useState(vacio);
  const [editando, setEditando] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const formRef = useRef(null);

  const cargar = useCallback(async () => {
    const r = await pedir(() => Axios.get(`${API}/proyectos`), true);
    if (r) setProyectos(r.data);
  }, []);
  useEffect(() => { cargar(); }, [cargar]);

  const guardar = async (e) => {
    e.preventDefault();
    const r = await pedir(() => (editando
      ? Axios.put(`${API}/proyectos/${editando}`, form)
      : Axios.post(`${API}/proyectos`, form)));
    if (!r) return;
    const fueEdicion = Boolean(editando);
    await cargar(); onCambio(); setForm(vacio); setEditando(null);
    exito('Correcto', fueEdicion ? 'Proyecto actualizado.' : 'Proyecto registrado.');
  };
  const borrar = async (p) => {
    const r = await confirmar('¿Eliminar proyecto?', `Se eliminará ${p.nombre_proyecto} y sus asignaciones.`, 'Sí, eliminar');
    if (!r.isConfirmed) return;
    const ok = await pedir(() => Axios.delete(`${API}/proyectos/${p.id}`));
    if (!ok) return;
    await cargar(); onCambio();
    exito('Eliminado', 'Proyecto eliminado.');
  };
  const editar = (p) => {
    setEditando(p.id);
    setForm({ nombre_proyecto: p.nombre_proyecto, descripcion: p.descripcion || '' });
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };
  const cancelar = () => { setEditando(null); setForm(vacio); };

  const columnas = [
    { clave: 'n', titulo: 'Proyecto', celda: (f) => <b>{f.dato.nombre_proyecto}</b> },
    { clave: 'd', titulo: 'Descripción', clase: 'suave truncar', celda: (f) => f.dato.descripcion || 'Sin descripción' },
    colAcciones(editar, borrar),
  ];
  const filas = proyectos.filter((p) => contiene([p.nombre_proyecto, p.descripcion], busqueda)).map((p) => ({ key: p.id, dato: p }));

  return (
    <div className="trabajo">
      <Lista titulo="Proyectos registrados" etiqueta="proyectos" busqueda={busqueda} setBusqueda={setBusqueda}
        columnas={columnas} filas={filas} editandoId={editando}
        vacio={proyectos.length ? ['Sin resultados', 'Prueba con otro nombre.'] : ['Aún no hay proyectos', 'Crea el primero con el formulario.']} />
      <Formulario titulo={editando ? 'Editar proyecto' : 'Nuevo proyecto'} editando={editando} formRef={formRef}>
        <form onSubmit={guardar}>
          <Campo etiqueta="Nombre del proyecto" id="pro-nombre">
            <input id="pro-nombre" className="form-control" required maxLength="100" value={form.nombre_proyecto} onChange={(e) => setForm({ ...form, nombre_proyecto: e.target.value })} />
          </Campo>
          <Campo etiqueta="Descripción" id="pro-desc">
            <textarea id="pro-desc" className="form-control" rows="4" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
          </Campo>
          <BotonesForm editando={editando} textoCrear="Registrar proyecto" textoEditar="Guardar cambios" cancelar={cancelar} />
        </form>
      </Formulario>
    </div>
  );
}