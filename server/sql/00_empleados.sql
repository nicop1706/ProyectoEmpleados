-- Base de datos y tabla EMPLEADOS (base del proyecto).
-- Ejecutar primero en phpMyAdmin: Inicio > pestaña SQL > pegar > Continuar.
SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS `empleados`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE `empleados`;

CREATE TABLE IF NOT EXISTS `empleados` (
  `id`     int(11)      NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `edad`   int(11)      NOT NULL,
  `pais`   varchar(100) NOT NULL,
  `cargo`  varchar(100) NOT NULL,
  `correo` varchar(150) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;