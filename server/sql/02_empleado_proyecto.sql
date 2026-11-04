-- Tabla EMPLEADO_PROYECTO (asignaciones). Ejecutar después de 00_empleados.sql y 01_proyectos.sql
USE empleados;

CREATE TABLE IF NOT EXISTS empleado_proyecto (
  empleado_id INT NOT NULL,
  proyecto_id INT NOT NULL,
  PRIMARY KEY (empleado_id, proyecto_id),
  CONSTRAINT fk_empleado_proyecto_empleado FOREIGN KEY (empleado_id)
    REFERENCES empleados(id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_empleado_proyecto_proyecto FOREIGN KEY (proyecto_id)
    REFERENCES proyectos(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;