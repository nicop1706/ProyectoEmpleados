// Módulo SALARIOS: registrar, listar, editar y eliminar.
import { useCallback, useEffect, useRef, useState } from "react";
import Axios from "axios";
import {
  API,
  Campo,
  Lista,
  Formulario,
  BotonesForm,
  Persona,
  colAcciones,
  contiene,
  confirmar,
  exito,
  pedir,
  hoy,
  soles,
  fechaCorta,
} from "../comun";

export const meta = {
  id: "salarios",
  orden: 4,
  texto: "Salarios",
  titulo: "Salarios",
  detalle:
    "Historial de montos por empleado, con la fecha de cada actualización.",
};

// Planilla actual: suma del salario más reciente de cada empleado.
const calcularPlanilla = (salarios) => {
  const ultimo = {};
  salarios.forEach((s) => {
    const f = String(s.fecha_actualizacion).slice(0, 10);
    const previo = ultimo[s.empleado_id];
    if (!previo || f > previo.f || (f === previo.f && s.id > previo.id))
      ultimo[s.empleado_id] = { f, id: s.id, monto: Number(s.monto) };
  });
  return Object.values(ultimo).reduce((t, x) => t + x.monto, 0);
};

export async function resumen() {
  const r = await Axios.get(`${API}/salarios`);
  return {
    cuenta: r.data.length,
    clave: [soles(calcularPlanilla(r.data)), "planilla mensual actual"],
  };
}

const vacio = () => ({
  empleado_id: "",
  monto: "",
  fecha_actualizacion: hoy(),
});

export default function Salarios({ onCambio }) {
  const [salarios, setSalarios] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [form, setForm] = useState(vacio);
  const [editando, setEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const formRef = useRef(null);

  const cargar = useCallback(async () => {
    const r = await pedir(() => Axios.get(`${API}/salarios`), true);
    if (r) setSalarios(r.data);
  }, []);
  useEffect(() => {
    cargar();
    pedir(() => Axios.get(`${API}/empleados`), true).then(
      (r) => r && setEmpleados(r.data),
    );
  }, [cargar]);

  const guardar = async (e) => {
    e.preventDefault();
    const datos = {
      ...form,
      empleado_id: Number(form.empleado_id),
      monto: Number(form.monto),
    };
    const r = await pedir(() =>
      editando
        ? Axios.put(`${API}/salarios/${editando}`, datos)
        : Axios.post(`${API}/salarios`, datos),
    );
    if (!r) return;
    const fueEdicion = Boolean(editando);
    await cargar();
    onCambio();
    setForm(vacio());
    setEditando(null);
    exito(
      "Correcto",
      fueEdicion ? "Salario actualizado." : "Salario registrado.",
    );
  };
  const borrar = async (s) => {
    const r = await confirmar(
      "¿Eliminar registro salarial?",
      `Monto: ${soles(s.monto)}`,
      "Sí, eliminar",
    );
    if (!r.isConfirmed) return;
    const ok = await pedir(() => Axios.delete(`${API}/salarios/${s.id}`));
    if (!ok) return;
    await cargar();
    onCambio();
    exito("Eliminado", "Registro salarial eliminado.");
  };
  const editar = (s) => {
    setEditando(s.id);
    setForm({
      empleado_id: String(s.empleado_id),
      monto: String(s.monto),
      fecha_actualizacion: String(s.fecha_actualizacion).slice(0, 10),
    });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };
  const cancelar = () => {
    setEditando(null);
    setForm(vacio());
  };

  const columnas = [
    {
      clave: "e",
      titulo: "Empleado",
      celda: (f) => <Persona nombre={f.dato.empleado_nombre} />,
    },
    {
      clave: "f",
      titulo: "Actualizado",
      celda: (f) => fechaCorta(f.dato.fecha_actualizacion),
    },
    {
      clave: "m",
      titulo: "Monto",
      clase: "num",
      celda: (f) => <span className="monto">{soles(f.dato.monto)}</span>,
    },
    colAcciones(editar, borrar),
  ];
  const filas = salarios
    .filter((s) => contiene([s.empleado_nombre, s.monto], busqueda))
    .map((s) => ({ key: s.id, dato: s }));

  return (
    <div className="trabajo">
      <Lista
        titulo="Salarios registrados"
        etiqueta="salarios"
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        columnas={columnas}
        filas={filas}
        editandoId={editando}
        vacio={
          salarios.length
            ? ["Sin resultados", "Prueba con otro empleado."]
            : ["Aún no hay salarios", "Registra el primero con el formulario."]
        }
      />
      <Formulario
        titulo={editando ? "Editar salario" : "Nuevo salario"}
        editando={editando}
        formRef={formRef}
      >
        <form onSubmit={guardar}>
          <Campo etiqueta="Empleado" id="sal-emp">
            <select
              id="sal-emp"
              className="form-select"
              required
              value={form.empleado_id}
              onChange={(e) =>
                setForm({ ...form, empleado_id: e.target.value })
              }
            >
              <option value="">Selecciona un empleado</option>
              {empleados.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre} (ID {e.id})
                </option>
              ))}
            </select>
          </Campo>
          <div className="campo-par">
            <Campo etiqueta="Monto (S/)" id="sal-monto">
              <input
                id="sal-monto"
                className="form-control"
                type="number"
                min="0.01"
                step="0.01"
                required
                value={form.monto}
                onChange={(e) => setForm({ ...form, monto: e.target.value })}
              />
            </Campo>
            <Campo etiqueta="Fecha" id="sal-fecha">
              <input
                id="sal-fecha"
                className="form-control"
                type="date"
                required
                value={form.fecha_actualizacion}
                onChange={(e) =>
                  setForm({ ...form, fecha_actualizacion: e.target.value })
                }
              />
            </Campo>
          </div>
          <BotonesForm
            editando={editando}
            textoCrear="Registrar salario"
            textoEditar="Guardar cambios"
            cancelar={cancelar}
          />
        </form>
      </Formulario>
    </div>
  );
}
