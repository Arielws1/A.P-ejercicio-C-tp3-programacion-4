-- Esquema de base de datos para gestión de vehículos, conductores y viajes

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
    `id` int NOT NULL AUTO_INCREMENT,
    `nombre` varchar(100) NOT NULL,
    `email` varchar(100) NOT NULL,
    `password_hash` varchar(255) NOT NULL,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla de vehículos
CREATE TABLE IF NOT EXISTS `vehiculos` (
    `id` int NOT NULL AUTO_INCREMENT,
    `marca` varchar(50) NOT NULL,
    `modelo` varchar(50) NOT NULL,
    `patente` varchar(10) NOT NULL,
    `año` int NOT NULL,
    `capacidad_carga` decimal(10,2) NOT NULL,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `patente` (`patente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla de conductores
CREATE TABLE IF NOT EXISTS `conductores` (
    `id` int NOT NULL AUTO_INCREMENT,
    `nombre` varchar(50) NOT NULL,
    `apellido` varchar(50) NOT NULL,
    `dni` varchar(20) NOT NULL,
    `licencia` varchar(20) NOT NULL,
    `fecha_vencimiento_licencia` date NOT NULL,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `dni` (`dni`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla de viajes
CREATE TABLE IF NOT EXISTS `viajes` (
    `id` int NOT NULL AUTO_INCREMENT,
    `vehiculo_id` int NOT NULL,
    `conductor_id` int NOT NULL,
    `fecha_salida` datetime NOT NULL,
    `fecha_llegada` datetime NOT NULL,
    `origen` varchar(100) NOT NULL,
    `destino` varchar(100) NOT NULL,
    `kilometros` decimal(10,2) NOT NULL,
    `observaciones` text,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `vehiculo_id` (`vehiculo_id`),
    KEY `conductor_id` (`conductor_id`),
    CONSTRAINT `viajes_ibfk_1` FOREIGN KEY (`vehiculo_id`) REFERENCES `vehiculos` (`id`) ON DELETE CASCADE,
    CONSTRAINT `viajes_ibfk_2` FOREIGN KEY (`conductor_id`) REFERENCES `conductores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;





