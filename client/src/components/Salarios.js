// Módulo Salarios: pendiente. Lo completa la rama feature/salarios-<nombre>.
export const meta = {
  id: 'salarios',
  orden: 4,
  texto: 'Salarios',
  titulo: 'Salarios',
  detalle: 'Historial de montos por empleado, con la fecha de cada actualización.',
};

export async function resumen() {
  return { cuenta: 0, clave: ['—', 'módulo en construcción'] };
}

export default function Salarios() {
  return <div className="vacio"><strong>Salarios</strong>Módulo en construcción.</div>;
}