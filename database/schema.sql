USE rendimiento_academico;

CREATE TABLE IF NOT EXISTS Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Facultad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_facultad VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS Carrera (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_carrera VARCHAR(100) NOT NULL,
    id_facultad INT NOT NULL,
    FOREIGN KEY (id_facultad) REFERENCES Facultad(id)
);

CREATE TABLE IF NOT EXISTS Materia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_materia VARCHAR(100) NOT NULL,
    id_carrera INT NOT NULL,
    FOREIGN KEY (id_carrera) REFERENCES Carrera(id)
);

CREATE TABLE IF NOT EXISTS Alumno (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    legajo VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Inscripcion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_alumno INT NOT NULL,
    id_materia INT NOT NULL,
    nota_final INT,
    fecha_cursado DATE,
    estado VARCHAR(20) DEFAULT 'Cursando',
    FOREIGN KEY (id_alumno) REFERENCES Alumno(id),
    FOREIGN KEY (id_materia) REFERENCES Materia(id)
);
