-- Tabla PROYECTOS. Ejecutar después de 00_empleados.sql
USE empleados;

CREATE TABLE IF NOT EXISTS proyectos (
  id INT NOT NULL AUTO_INCREMENT,
  nombre_proyecto VARCHAR(100) NOT NULL,
  descripcion TEXT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;