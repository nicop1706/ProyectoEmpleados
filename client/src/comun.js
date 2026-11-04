// Piezas compartidas por todos los módulos de la interfaz.
import { useState } from 'react';
import Swal from 'sweetalert2';

export const API = 'http://localhost:3001';
export const VERDE = '#123d36';
export const ROJO = '#b4402e';

// Fecha de hoy con la hora local (no UTC), formato AAAA-MM-DD.
export const hoy = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
export const soles = (n) => `S/ ${Number(n).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const fechaCorta = (f) => { const [a, m, d] = String(f).slice(0, 10).split('-'); return d && m && a ? `${d}/${m}/${a}` : String(f); };
export const iniciales = (nombre = '') => nombre.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');
export const contiene = (valores, q) => !q || valores.some((v) => String(v ?? '').toLowerCase().includes(q.toLowerCase().trim()));

export const confirmar = (title, text, confirmButtonText) => Swal.fire({
  title, text, icon: 'warning', showCancelButton: true,
  confirmButtonText, cancelButtonText: 'Cancelar',
  confirmButtonColor: ROJO, cancelButtonColor: '#5a6b66', reverseButtons: true,
});
export const exito = (titulo, texto) => Swal.fire({ title: titulo, text: texto, icon: 'success', confirmButtonColor: VERDE, timer: 2200, timerProgressBar: true });

// Ejecuta una petición. Si falla, muestra el error y devuelve null (no rompe la pantalla).
export const pedir = async (fn, silencioso = false) => {
  try {
    return await fn();
  } catch (e) {
    if (!silencioso) {
      const mensaje = e.response?.data?.error || e.message || 'Ocurrió un error.';
      await Swal.fire({ title: 'Error', text: mensaje, icon: 'error', confirmButtonColor: VERDE });
    }
    return null;
  }
};

export function Campo({ etiqueta, id, children }) {
  return <div className="campo"><label htmlFor={id}>{etiqueta}</label>{children}</div>;
}

export function BotonesForm({ editando, textoCrear, textoEditar, cancelar }) {
  return (
    <div className="formulario-botones">
      <button className="btn-p">{editando ? textoEditar : textoCrear}</button>
      {editando && <button type="button" className="btn-s" onClick={cancelar}>Cancelar</button>}
    </div>
  );
}

export function Persona({ nombre, detalle }) {
  return (
    <div className="persona">
      <span className="inicial" aria-hidden="true">{iniciales(nombre)}</span>
      {detalle ? <div><b>{nombre}</b><small>{detalle}</small></div> : <b>{nombre}</b>}
    </div>
  );
}

export const colAcciones = (onEditar, onEliminar, textoEliminar = 'Eliminar') => ({
  clave: 'acc',
  titulo: <span className="visually-hidden">Acciones</span>,
  clase: 'acciones',
  celda: (f) => (
    <>
      {onEditar && <button className="btn-t" onClick={() => onEditar(f.dato)}>Editar</button>}
      <button className="btn-t peligro" onClick={() => onEliminar(f.dato)}>{textoEliminar}</button>
    </>
  ),
});

const POR_PAGINA = 6;

// Devuelve los números de página a mostrar, con "…" cuando hay muchas.
const paginasVisibles = (actual, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, actual, actual - 1, actual + 1]);
  const orden = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  return orden.flatMap((n, i) => (i && n - orden[i - 1] > 1 ? ['…' + n, n] : [n]));
};

export function Tabla({ columnas, filas, vacio, filaClase }) {
  const [pagina, setPagina] = useState(1);
  if (!filas.length) return <div className="vacio"><strong>{vacio[0]}</strong>{vacio[1]}</div>;

  const total = Math.ceil(filas.length / POR_PAGINA);
  const actual = Math.min(pagina, total);
  const inicio = (actual - 1) * POR_PAGINA;
  const visibles = filas.slice(inicio, inicio + POR_PAGINA);

  return (
    <>
      <div className="tabla-wrap">
        <table className="tabla">
          <thead><tr>{columnas.map((c) => <th key={c.clave} className={c.clase}>{c.titulo}</th>)}</tr></thead>
          <tbody>
            {visibles.map((f) => (
              <tr key={f.key} className={filaClase ? filaClase(f) : undefined}>
                {columnas.map((c) => <td key={c.clave} className={c.clase}>{c.celda(f)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {total > 1 && (
        <nav className="paginacion" aria-label="Paginación">
          <span className="paginacion-info">{inicio + 1}–{inicio + visibles.length} de {filas.length}</span>
          <div className="paginacion-botones">
            <button type="button" className="pag" disabled={actual === 1} onClick={() => setPagina(actual - 1)}>Anterior</button>
            {paginasVisibles(actual, total).map((n) => (typeof n === 'string'
              ? <span key={n} className="pag-puntos" aria-hidden="true">…</span>
              : <button key={n} type="button" className="pag" aria-current={n === actual ? 'page' : undefined} aria-label={`Página ${n}`} onClick={() => setPagina(n)}>{n}</button>))}
            <button type="button" className="pag" disabled={actual === total} onClick={() => setPagina(actual + 1)}>Siguiente</button>
          </div>
        </nav>
      )}
    </>
  );
}

// Panel izquierdo: título, buscador y tabla.
export function Lista({ titulo, etiqueta, busqueda, setBusqueda, columnas, filas, vacio, editandoId }) {
  return (
    <section className="panel" aria-label={`Lista de ${etiqueta}`}>
      <div className="panel-cab">
        <h3>{titulo}</h3>
        <input className="buscar" type="search" placeholder="Buscar" aria-label={`Buscar en ${etiqueta}`} value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
      </div>
      <Tabla key={busqueda} columnas={columnas} filas={filas} vacio={vacio} filaClase={(f) => (editandoId && f.key === editandoId ? 'editando' : undefined)} />
    </section>
  );
}

// Panel derecho: formulario.
export function Formulario({ titulo, editando, formRef, children }) {
  return (
    <section ref={formRef} className={`panel formulario ${editando ? 'editando' : ''}`} aria-label={titulo}>
      <div className="panel-cab"><h3>{titulo}</h3></div>
      {children}
    </section>
  );
}