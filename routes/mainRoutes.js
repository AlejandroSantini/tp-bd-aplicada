const express = require('express');
const router = express.Router();
const { getConnection } = require('../database');

function encodeBase64(text) {
    return Buffer.from(text).toString('base64');
}

function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/login');
}

router.get(['/', '/login'], (req, res) => {
    if (req.session.userId) {
        return res.redirect('/dashboard');
    }
    res.render('login', { error: null });
});

router.post('/login', async (req, res) => {
    const { usuario, password } = req.body;
    const passwordEncoded = encodeBase64(password);
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.query(
            'SELECT id FROM Usuario WHERE nombre = $1 AND password = $2',
            [usuario, passwordEncoded]
        );
        const rows = result.rows;
        if (rows.length > 0) {
            req.session.userId = rows[0].id;
            res.redirect('/dashboard');
        } else {
            res.render('login', { error: 'Credenciales incorrectas. Por favor, intente de nuevo.' });
        }
    } catch (error) {
        console.error("Error en el login:", error);
        res.render('login', { error: 'Ocurrió un error en el servidor.' });
    } finally {
        if (connection) connection.release();
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/dashboard');
        }
        res.redirect('/login');
    });
});

// ============================================
// NIVEL 1: Dashboard de Facultades
// ============================================
router.get('/dashboard', isAuthenticated, async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        
        const resultFacultades = await connection.query(`
            SELECT 
                f.id, 
                f.nombre_facultad, 
                ROUND(AVG(i.nota_final::numeric), 1) as promedio,
                COUNT(DISTINCT a.id) as total_alumnos
            FROM Facultad f
            LEFT JOIN Carrera c ON f.id = c.id_facultad
            LEFT JOIN Materia m ON c.id = m.id_carrera
            LEFT JOIN Inscripcion i ON m.id = i.id_materia
            LEFT JOIN Alumno a ON i.id_alumno = a.id
            WHERE i.nota_final IS NOT NULL
            GROUP BY f.id, f.nombre_facultad
            ORDER BY promedio DESC
        `);

        const datosParaGrafico = resultFacultades.rows.map(fac => ({
            id: fac.id,
            label: fac.nombre_facultad,
            promedio: parseFloat(fac.promedio) || 0,
            totalAlumnos: parseInt(fac.total_alumnos) || 0
        }));

        // Calcular tasa de aprobación global
        const resultAprobacion = await connection.query(`
            SELECT 
                ROUND(
                    (COUNT(*) FILTER (WHERE nota_final >= 6)::numeric / COUNT(*)::numeric) * 100, 
                    1
                ) as tasa_aprobacion
            FROM Inscripcion
            WHERE nota_final IS NOT NULL
        `);
        
        const tasaAprobacionGlobal = parseFloat(resultAprobacion.rows[0]?.tasa_aprobacion) || 0;
        const resultTotalAlumnos = await connection.query(`SELECT COUNT(*) as total FROM Alumno`);
        const totalAlumnos = parseInt(resultTotalAlumnos.rows[0].total) || 0;

        let tasaAprobacionColor;
        if (tasaAprobacionGlobal > 75) tasaAprobacionColor = 'verde';
        else if (tasaAprobacionGlobal >= 50) tasaAprobacionColor = 'amarillo';
        else tasaAprobacionColor = 'rojo';

        res.render('nivel1-facultades', {
            datosParaGrafico: datosParaGrafico,
            tasaAprobacionPorcentaje: tasaAprobacionGlobal,
            tasaAprobacionColor: tasaAprobacionColor,
            totalAlumnos: totalAlumnos,
            nivel: 1
        });
    } catch (error) {
        console.error("Error al cargar dashboard de facultades:", error);
        res.status(500).send("Error interno del servidor.");
    } finally {
        if (connection) connection.release();
    }
});

// ============================================
// NIVEL 2: Carreras de una Facultad
// ============================================
router.get('/facultad/:id', isAuthenticated, async (req, res) => {
    const facultadId = req.params.id;
    let connection;
    try {
        connection = await getConnection();
        
        // Obtener info de la facultad
        const resultFacultad = await connection.query(
            'SELECT nombre_facultad FROM Facultad WHERE id = $1',
            [facultadId]
        );
        
        if (resultFacultad.rows.length === 0) {
            return res.status(404).send('Facultad no encontrada');
        }
        
        const nombreFacultad = resultFacultad.rows[0].nombre_facultad;
        
        // Obtener carreras con sus estadísticas
        const resultCarreras = await connection.query(`
            SELECT 
                c.id, 
                c.nombre_carrera, 
                COALESCE(ROUND(AVG(i.nota_final::numeric), 1), 0) as promedio,
                COUNT(DISTINCT a.id) as total_alumnos
            FROM Carrera c
            LEFT JOIN Materia m ON c.id = m.id_carrera
            LEFT JOIN Inscripcion i ON m.id = i.id_materia AND i.nota_final IS NOT NULL
            LEFT JOIN Alumno a ON i.id_alumno = a.id
            WHERE c.id_facultad = $1
            GROUP BY c.id, c.nombre_carrera
            ORDER BY c.nombre_carrera
        `, [facultadId]);
        
        const datosParaGrafico = resultCarreras.rows.map(car => ({
            id: car.id,
            label: car.nombre_carrera,
            promedio: parseFloat(car.promedio) || 0,
            totalAlumnos: parseInt(car.total_alumnos) || 0
        }));

        // Tasa de aprobación de la facultad
        const resultAprobacion = await connection.query(`
            SELECT 
                ROUND(
                    (COUNT(*) FILTER (WHERE i.nota_final >= 6)::numeric / COUNT(*)::numeric) * 100, 
                    1
                ) as tasa_aprobacion
            FROM Inscripcion i
            JOIN Materia m ON i.id_materia = m.id
            JOIN Carrera c ON m.id_carrera = c.id
            WHERE c.id_facultad = $1 AND i.nota_final IS NOT NULL
        `, [facultadId]);
        
        const tasaAprobacion = parseFloat(resultAprobacion.rows[0]?.tasa_aprobacion) || 0;
        
        // Total alumnos de la facultad
        const resultTotalAlumnos = await connection.query(`
            SELECT COUNT(DISTINCT a.id) as total
            FROM Alumno a
            JOIN Inscripcion i ON a.id = i.id_alumno
            JOIN Materia m ON i.id_materia = m.id
            JOIN Carrera c ON m.id_carrera = c.id
            WHERE c.id_facultad = $1
        `, [facultadId]);
        const totalAlumnos = parseInt(resultTotalAlumnos.rows[0].total) || 0;
        
        let tasaAprobacionColor;
        if (tasaAprobacion > 75) tasaAprobacionColor = 'verde';
        else if (tasaAprobacion >= 50) tasaAprobacionColor = 'amarillo';
        else tasaAprobacionColor = 'rojo';

        res.render('nivel2-carreras', {
            facultadId: facultadId,
            nombreFacultad: nombreFacultad,
            datosParaGrafico: datosParaGrafico,
            tasaAprobacionPorcentaje: tasaAprobacion,
            tasaAprobacionColor: tasaAprobacionColor,
            totalAlumnos: totalAlumnos,
            nivel: 2
        });
    } catch (error) {
        console.error("Error al cargar carreras:", error);
        res.status(500).send("Error interno del servidor.");
    } finally {
        if (connection) connection.release();
    }
});

// ============================================
// NIVEL 3: Alumnos de una Carrera
// ============================================
router.get('/carrera/:id', isAuthenticated, async (req, res) => {
    const carreraId = req.params.id;
    let connection;
    try {
        connection = await getConnection();
        
        // Obtener info de la carrera y facultad
        const resultCarrera = await connection.query(`
            SELECT c.nombre_carrera, f.id as facultad_id, f.nombre_facultad
            FROM Carrera c
            JOIN Facultad f ON c.id_facultad = f.id
            WHERE c.id = $1
        `, [carreraId]);
        
        if (resultCarrera.rows.length === 0) {
            return res.status(404).send('Carrera no encontrada');
        }
        
        const { nombre_carrera, facultad_id, nombre_facultad } = resultCarrera.rows[0];
        
        // Obtener alumnos con sus estadísticas
        const resultAlumnos = await connection.query(`
            SELECT 
                a.id,
                a.nombre_completo,
                a.legajo,
                ROUND(AVG(i.nota_final::numeric), 1) as promedio,
                COUNT(i.id) as total_materias,
                COUNT(CASE WHEN i.nota_final >= 6 THEN 1 END) as materias_aprobadas
            FROM Alumno a
            JOIN Inscripcion i ON a.id = i.id_alumno
            JOIN Materia m ON i.id_materia = m.id
            WHERE m.id_carrera = $1 AND i.nota_final IS NOT NULL
            GROUP BY a.id, a.nombre_completo, a.legajo
            ORDER BY promedio DESC
        `, [carreraId]);
        
        const alumnos = resultAlumnos.rows.map(alumno => ({
            id: alumno.id,
            nombre: alumno.nombre_completo,
            legajo: alumno.legajo,
            promedio: parseFloat(alumno.promedio) || 0,
            totalMaterias: parseInt(alumno.total_materias) || 0,
            materiasAprobadas: parseInt(alumno.materias_aprobadas) || 0
        }));

        // Estadísticas de la carrera
        const promedioCarrera = alumnos.length > 0 
            ? (alumnos.reduce((sum, a) => sum + a.promedio, 0) / alumnos.length).toFixed(1)
            : 0;

        res.render('nivel3-alumnos', {
            carreraId: carreraId,
            nombreCarrera: nombre_carrera,
            facultadId: facultad_id,
            nombreFacultad: nombre_facultad,
            alumnos: alumnos,
            promedioCarrera: promedioCarrera,
            totalAlumnos: alumnos.length,
            nivel: 3
        });
    } catch (error) {
        console.error("Error al cargar alumnos:", error);
        res.status(500).send("Error interno del servidor.");
    } finally {
        if (connection) connection.release();
    }
});

// ============================================
// DETALLE: Estadísticas de un Alumno
// ============================================
router.get('/alumno/:id', isAuthenticated, async (req, res) => {
    const alumnoId = req.params.id;
    let connection;
    try {
        connection = await getConnection();
        
        // Info del alumno
        const resultAlumno = await connection.query(
            'SELECT * FROM Alumno WHERE id = $1',
            [alumnoId]
        );
        
        if (resultAlumno.rows.length === 0) {
            return res.status(404).send('Alumno no encontrado');
        }
        
        const alumno = resultAlumno.rows[0];
        
        // Inscripciones del alumno con detalles
        const resultInscripciones = await connection.query(`
            SELECT 
                i.id,
                m.nombre_materia,
                c.nombre_carrera,
                i.nota_final,
                i.fecha_cursado,
                i.estado
            FROM Inscripcion i
            JOIN Materia m ON i.id_materia = m.id
            JOIN Carrera c ON m.id_carrera = c.id
            WHERE i.id_alumno = $1
            ORDER BY i.fecha_cursado DESC
        `, [alumnoId]);
        
        const inscripciones = resultInscripciones.rows;
        
        // Calcular estadísticas
        const notasValidas = inscripciones.filter(i => i.nota_final !== null);
        const promedio = notasValidas.length > 0
            ? (notasValidas.reduce((sum, i) => sum + parseFloat(i.nota_final), 0) / notasValidas.length).toFixed(1)
            : 0;
        const aprobadas = notasValidas.filter(i => i.nota_final >= 6).length;
        const tasaAprobacion = notasValidas.length > 0 
            ? ((aprobadas / notasValidas.length) * 100).toFixed(1)
            : 0;

        res.render('detalle-alumno', {
            alumno: alumno,
            inscripciones: inscripciones,
            promedio: promedio,
            totalMaterias: inscripciones.length,
            materiasAprobadas: aprobadas,
            tasaAprobacion: tasaAprobacion
        });
    } catch (error) {
        console.error("Error al cargar detalle del alumno:", error);
        res.status(500).send("Error interno del servidor.");
    } finally {
        if (connection) connection.release();
    }
});

module.exports = router;