// Módulo Asignaciones: pendiente. Lo completa la rama feature/asignaciones-<nombre>.
export const meta = {
  id: 'asignaciones',
  orden: 3,
  texto: 'Asignaciones',
  titulo: 'Asignaciones',
  detalle: 'Quién trabaja en qué proyecto. Una persona no puede repetirse en el mismo proyecto.',
};

export async function resumen() {
  return { cuenta: 0, clave: ['—', 'módulo en construcción'] };
}

export default function Asignaciones() {
  return <div className="vacio"><strong>Asignaciones</strong>Módulo en construcción.</div>;
}