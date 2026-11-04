-- Tabla SALARIO. Ejecutar después de 00_empleados.sql
USE empleados;

CREATE TABLE IF NOT EXISTS salario (
  id INT NOT NULL AUTO_INCREMENT,
  empleado_id INT NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  fecha_actualizacion DATE NOT NULL,
  PRIMARY KEY (id),
  INDEX idx_salario_empleado (empleado_id),
  CONSTRAINT fk_salario_empleado FOREIGN KEY (empleado_id)
    REFERENCES empleados(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;