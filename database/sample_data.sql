USE rendimiento_academico;

INSERT IGNORE INTO Usuario (nombre, password) VALUES
('admin', 'YWRtaW4xMjM='),
('secretario', 'c2VjcmV0MTIz'),
('coordinador', 'Y29vcmQxMjM=');

INSERT IGNORE INTO Facultad (id, nombre_facultad) VALUES
(1, 'Facultad de Tecnología Informática'),
(2, 'Facultad de Ingeniería y Ciencias Exactas'),
(3, 'Facultad de Ciencias Económicas');

INSERT IGNORE INTO Carrera (id, nombre_carrera, id_facultad) VALUES
(1, 'Ingeniería en Sistemas Informáticos', 1),
(2, 'Licenciatura en Sistemas', 1),
(3, 'Ingeniería Industrial', 2),
(4, 'Contador Público', 3);

INSERT IGNORE INTO Materia (id, nombre_materia, id_carrera) VALUES
(1, 'Bases de Datos Aplicadas', 1),
(2, 'Programación Web', 1),
(3, 'Algoritmos y Estructuras de Datos', 1),
(4, 'Investigación Operativa', 3),
(5, 'Contabilidad I', 4);

INSERT IGNORE INTO Alumno (id, nombre_completo, legajo) VALUES
(1, 'Juan Carlos Pérez', '2021001'),
(2, 'María Fernanda García', '2021002'),
(3, 'Luis Roberto Martínez', '2021003'),
(4, 'Ana Sofía López', '2021004'),
(5, 'Carlos Eduardo Rodríguez', '2021005');

INSERT IGNORE INTO Inscripcion (id_alumno, id_materia, nota_final, fecha_cursado, estado) VALUES
(1, 1, 9, '2024-07-15', 'Aprobado'),
(2, 1, 8, '2024-07-15', 'Aprobado'),
(3, 1, 4, '2024-07-15', 'Desaprobado'),
(4, 1, 10, '2024-07-15', 'Aprobado'),
(5, 1, 7, '2024-07-15', 'Aprobado'),
(1, 2, 8, '2024-11-20', 'Aprobado'),
(2, 2, 9, '2024-11-20', 'Aprobado');
