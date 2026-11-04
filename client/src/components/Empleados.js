// Módulo EMPLEADOS (base del proyecto): crear, listar, editar y eliminar.
import { useCallback, useEffect, useRef, useState } from 'react';
import Axios from 'axios';
import { API, Campo, Lista, Formulario, BotonesForm, Persona, colAcciones, contiene, confirmar, exito, pedir } from '../comun';

export const meta = {
  id: 'empleados',
  orden: 1,
  texto: 'Empleados',
  titulo: 'Empleados',
  detalle: 'Registra a las personas del equipo y mantén sus datos de contacto al día.',
};

export async function resumen() {
  const r = await Axios.get(`${API}/empleados`);
  const n = r.data.length;
  return { cuenta: n, clave: [n, n === 1 ? 'persona registrada' : 'personas registradas'] };
}

const vacio = { nombre: '', edad: '', pais: '', cargo: '', correo: '' };

export default function Empleados({ onCambio }) {
  const [empleados, setEmpleados] = useState([]);
  const [form, setForm] = useState(vacio);
  const [editando, setEditando] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const formRef = useRef(null);

  const cargar = useCallback(async () => {
    const r = await pedir(() => Axios.get(`${API}/empleados`), true);
    if (r) setEmpleados(r.data);
  }, []);
  useEffect(() => { cargar(); }, [cargar]);

  const guardar = async (e) => {
    e.preventDefault();
    const datos = { ...form, edad: Number(form.edad) };
    const r = await pedir(() => (editando
      ? Axios.put(`${API}/empleados/${editando}`, datos)
      : Axios.post(`${API}/empleados`, datos)));
    if (!r) return;
    const fueEdicion = Boolean(editando);
    await cargar(); onCambio(); setForm(vacio); setEditando(null);
    exito('Correcto', fueEdicion ? 'Empleado actualizado.' : 'Empleado registrado.');
  };
  const borrar = async (emp) => {
    const r = await confirmar('¿Eliminar empleado?', `Se eliminará a ${emp.nombre}. Sus asignaciones y salarios relacionados también se eliminarán.`, 'Sí, eliminar');
    if (!r.isConfirmed) return;
    const ok = await pedir(() => Axios.delete(`${API}/empleados/${emp.id}`));
    if (!ok) return;
    await cargar(); onCambio();
    exito('Eliminado', 'Empleado eliminado.');
  };
  const editar = (e) => {
    setEditando(e.id);
    setForm({ nombre: e.nombre, edad: String(e.edad), pais: e.pais, cargo: e.cargo, correo: e.correo });
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };
  const cancelar = () => { setEditando(null); setForm(vacio); };

  const campo = (clave, etiqueta, tipo = 'text', extra = {}) => (
    <Campo etiqueta={etiqueta} id={`emp-${clave}`}>
      <input id={`emp-${clave}`} className="form-control" type={tipo} required value={form[clave]} min={tipo === 'number' ? '1' : undefined}
        onChange={(e) => setForm({ ...form, [clave]: e.target.value })} {...extra} />
    </Campo>
  );

  const columnas = [
    { clave: 'n', titulo: 'Empleado', celda: (f) => <Persona nombre={f.dato.nombre} detalle={f.dato.correo} /> },
    { clave: 'c', titulo: 'Cargo', celda: (f) => f.dato.cargo },
    { clave: 'p', titulo: 'País', celda: (f) => f.dato.pais },
    { clave: 'e', titulo: 'Edad', clase: 'num', celda: (f) => f.dato.edad },
    colAcciones(editar, borrar),
  ];
  const filas = empleados.filter((e) => contiene([e.nombre, e.cargo, e.pais, e.correo], busqueda)).map((e) => ({ key: e.id, dato: e }));

  return (
    <div className="trabajo">
      <Lista titulo="Empleados registrados" etiqueta="empleados" busqueda={busqueda} setBusqueda={setBusqueda}
        columnas={columnas} filas={filas} editandoId={editando}
        vacio={empleados.length ? ['Sin resultados', 'Prueba con otro nombre, cargo o país.'] : ['Aún no hay empleados', 'Registra al primero con el formulario.']} />
      <Formulario titulo={editando ? 'Editar empleado' : 'Nuevo empleado'} editando={editando} formRef={formRef}>
        <form onSubmit={guardar}>
          {campo('nombre', 'Nombre completo', 'text', { autoComplete: 'off' })}
          <div className="campo-par">{campo('edad', 'Edad', 'number')}{campo('pais', 'País')}</div>
          {campo('cargo', 'Cargo')}
          {campo('correo', 'Correo electrónico', 'email')}
          <BotonesForm editando={editando} textoCrear="Registrar empleado" textoEditar="Guardar cambios" cancelar={cancelar} />
        </form>
      </Formulario>
    </div>
  );
}