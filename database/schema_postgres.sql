-- Schema PostgreSQL para Dashboard Académico
-- Base de datos: rendimiento_academico

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
    FOREIGN KEY (id_facultad) REFERENCES Facultad(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Materia (
    id SERIAL PRIMARY KEY,
    nombre_materia VARCHAR(100) NOT NULL,
    id_carrera INTEGER NOT NULL,
    FOREIGN KEY (id_carrera) REFERENCES Carrera(id) ON DELETE CASCADE
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
    FOREIGN KEY (id_alumno) REFERENCES Alumno(id) ON DELETE CASCADE,
    FOREIGN KEY (id_materia) REFERENCES Materia(id) ON DELETE CASCADE
);
