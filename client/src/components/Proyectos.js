// Módulo Proyectos: pendiente. Lo completa la rama feature/proyectos-<nombre>.
export const meta = {
  id: 'proyectos',
  orden: 2,
  texto: 'Proyectos',
  titulo: 'Proyectos',
  detalle: 'Los proyectos en los que trabaja la empresa, con su descripción.',
};

export async function resumen() {
  return { cuenta: 0, clave: ['—', 'módulo en construcción'] };
}

export default function Proyectos() {
  return <div className="vacio"><strong>Proyectos</strong>Módulo en construcción.</div>;
}