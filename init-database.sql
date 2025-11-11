-- Script de inicialización de la base de datos PostgreSQL
-- Ejecutar este script después de instalar PostgreSQL

-- Crear la base de datos si no existe (esto se hace desde la línea de comandos)
-- CREATE DATABASE rendimiento_academico;

-- Usar la base de datos
\c rendimiento_academico;

-- Crear las tablas
CREATE TABLE IF NOT EXISTS Usuario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Facultad (
    id SERIAL PRIMARY KEY,
    nombre_facultad VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS Carrera (
    id SERIAL PRIMARY KEY,
    nombre_carrera VARCHAR(100) NOT NULL,
    id_facultad INTEGER NOT NULL,
    FOREIGN KEY (id_facultad) REFERENCES Facultad(id)
);

CREATE TABLE IF NOT EXISTS Materia (
    id SERIAL PRIMARY KEY,
    nombre_materia VARCHAR(100) NOT NULL,
    id_carrera INTEGER NOT NULL,
    FOREIGN KEY (id_carrera) REFERENCES Carrera(id)
);

CREATE TABLE IF NOT EXISTS Alumno (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    legajo VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Inscripcion (
    id SERIAL PRIMARY KEY,
    id_alumno INTEGER NOT NULL,
    id_materia INTEGER NOT NULL,
    nota_final INTEGER,
    fecha_cursado DATE,
    estado VARCHAR(20) DEFAULT 'Cursando',
    FOREIGN KEY (id_alumno) REFERENCES Alumno(id),
    FOREIGN KEY (id_materia) REFERENCES Materia(id)
);

-- Insertar datos de ejemplo
INSERT INTO Usuario (nombre, password) VALUES
('admin', 'YWRtaW4xMjM='),
('secretario', 'c2VjcmV0MTIz'),
('coordinador', 'Y29vcmQxMjM=')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO Facultad (id, nombre_facultad) VALUES
(1, 'Facultad de Tecnología Informática'),
(2, 'Facultad de Ingeniería y Ciencias Exactas'),
(3, 'Facultad de Ciencias Económicas')
ON CONFLICT (id) DO NOTHING;

INSERT INTO Carrera (id, nombre_carrera, id_facultad) VALUES
(1, 'Ingeniería en Sistemas Informáticos', 1),
(2, 'Licenciatura en Sistemas', 1),
(3, 'Ingeniería Industrial', 2),
(4, 'Contador Público', 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO Materia (id, nombre_materia, id_carrera) VALUES
(1, 'Bases de Datos Aplicadas', 1),
(2, 'Programación Web', 1),
(3, 'Algoritmos y Estructuras de Datos', 1),
(4, 'Investigación Operativa', 3),
(5, 'Contabilidad I', 4)
ON CONFLICT (id) DO NOTHING;

INSERT INTO Alumno (id, nombre_completo, legajo) VALUES
(1, 'Juan Carlos Pérez', '2021001'),
(2, 'María Fernanda García', '2021002'),
(3, 'Luis Roberto Martínez', '2021003'),
(4, 'Ana Sofía López', '2021004'),
(5, 'Carlos Eduardo Rodríguez', '2021005')
ON CONFLICT (id) DO NOTHING;

INSERT INTO Inscripcion (id_alumno, id_materia, nota_final, fecha_cursado, estado) VALUES
(1, 1, 9, '2024-07-15', 'Aprobado'),
(2, 1, 8, '2024-07-15', 'Aprobado'),
(3, 1, 4, '2024-07-15', 'Desaprobado'),
(4, 1, 10, '2024-07-15', 'Aprobado'),
(5, 1, 7, '2024-07-15', 'Aprobado'),
(1, 2, 8, '2024-11-20', 'Aprobado'),
(2, 2, 9, '2024-11-20', 'Aprobado')
ON CONFLICT DO NOTHING;

-- Mostrar mensaje de éxito
SELECT 'Base de datos inicializada correctamente' AS mensaje;