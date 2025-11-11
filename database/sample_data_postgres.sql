-- Datos de ejemplo para Dashboard Académico
-- Base de datos: rendimiento_academico

-- Usuarios (contraseñas en Base64)
-- admin / admin123
-- secretario / secret123
-- coordinador / coord123
INSERT INTO Usuario (nombre, password) VALUES
('admin', 'YWRtaW4xMjM='),
('secretario', 'c2VjcmV0MTIz'),
('coordinador', 'Y29vcmQxMjM=')
ON CONFLICT (nombre) DO NOTHING;

-- Facultades
INSERT INTO Facultad (id, nombre_facultad) VALUES
(1, 'Facultad de Tecnología Informática'),
(2, 'Facultad de Ingeniería y Ciencias Exactas'),
(3, 'Facultad de Ciencias Económicas')
ON CONFLICT (id) DO NOTHING;

-- Ajustar secuencia de Facultad
SELECT setval('facultad_id_seq', (SELECT MAX(id) FROM Facultad));

-- Carreras
INSERT INTO Carrera (id, nombre_carrera, id_facultad) VALUES
(1, 'Ingeniería en Sistemas Informáticos', 1),
(2, 'Licenciatura en Sistemas', 1),
(3, 'Ingeniería Industrial', 2),
(4, 'Contador Público', 3)
ON CONFLICT (id) DO NOTHING;

-- Ajustar secuencia de Carrera
SELECT setval('carrera_id_seq', (SELECT MAX(id) FROM Carrera));

-- Materias
INSERT INTO Materia (id, nombre_materia, id_carrera) VALUES
(1, 'Bases de Datos Aplicadas', 1),
(2, 'Programación Web', 1),
(3, 'Algoritmos y Estructuras de Datos', 1),
(4, 'Investigación Operativa', 3),
(5, 'Contabilidad I', 4)
ON CONFLICT (id) DO NOTHING;

-- Ajustar secuencia de Materia
SELECT setval('materia_id_seq', (SELECT MAX(id) FROM Materia));

-- Alumnos
INSERT INTO Alumno (id, nombre_completo, legajo) VALUES
(1, 'Juan Carlos Pérez', '2021001'),
(2, 'María Fernanda García', '2021002'),
(3, 'Luis Roberto Martínez', '2021003'),
(4, 'Ana Sofía López', '2021004'),
(5, 'Carlos Eduardo Rodríguez', '2021005')
ON CONFLICT (legajo) DO NOTHING;

-- Ajustar secuencia de Alumno
SELECT setval('alumno_id_seq', (SELECT MAX(id) FROM Alumno));

-- Inscripciones (con diferentes notas para probar los indicadores)
INSERT INTO Inscripcion (id_alumno, id_materia, nota_final, fecha_cursado, estado) VALUES
-- Bases de Datos Aplicadas - Promedio: 7.6
(1, 1, 9, '2024-07-15', 'Aprobado'),
(2, 1, 8, '2024-07-15', 'Aprobado'),
(3, 1, 4, '2024-07-15', 'Desaprobado'),
(4, 1, 10, '2024-07-15', 'Aprobado'),
(5, 1, 7, '2024-07-15', 'Aprobado'),
-- Programación Web - Promedio: 8.5
(1, 2, 8, '2024-11-20', 'Aprobado'),
(2, 2, 9, '2024-11-20', 'Aprobado'),
-- Algoritmos y Estructuras de Datos - Promedio: 6.5
(1, 3, 7, '2024-11-20', 'Aprobado'),
(2, 3, 6, '2024-11-20', 'Aprobado'),
-- Investigación Operativa - Promedio: 7.0
(3, 4, 7, '2024-11-20', 'Aprobado'),
-- Contabilidad I - Promedio: 8.0
(4, 5, 8, '2024-11-20', 'Aprobado');
