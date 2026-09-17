const pool = require('../config/database');


// ==========================================
// OBTENER TODOS LOS CURSOS
// ==========================================

const obtenerCursos = async (req, res) => {

    try {

        const [cursos] = await pool.query(
            `SELECT
                id_curso,
                codigo,
                nombre,
                creditos
             FROM cursos
             ORDER BY codigo`
        );


        res.json(cursos);


    } catch (error) {

        console.error('Error al obtener cursos:', error);

        res.status(500).json({
            mensaje: 'Error al obtener cursos',
            error: error.message
        });

    }
};


// ==========================================
// OBTENER CURSO POR ID
// ==========================================

const obtenerCursoPorId = async (req, res) => {

    try {

        const { id } = req.params;


        const [cursos] = await pool.query(
            `SELECT
                id_curso,
                codigo,
                nombre,
                creditos
             FROM cursos
             WHERE id_curso = ?`,
            [id]
        );


        if (cursos.length === 0) {

            return res.status(404).json({
                mensaje: 'Curso no encontrado'
            });

        }


        res.json(cursos[0]);


    } catch (error) {

        console.error('Error al obtener curso:', error);

        res.status(500).json({
            mensaje: 'Error al obtener curso',
            error: error.message
        });

    }
};


// ==========================================
// BUSCAR CURSOS
// ==========================================

const buscarCursos = async (req, res) => {

    try {

        const { texto } = req.params;


        const [cursos] = await pool.query(
            `SELECT
                id_curso,
                codigo,
                nombre,
                creditos
             FROM cursos
             WHERE codigo LIKE ?
                OR nombre LIKE ?
             ORDER BY codigo`,
            [
                `%${texto}%`,
                `%${texto}%`
            ]
        );


        res.json(cursos);


    } catch (error) {

        console.error('Error al buscar cursos:', error);

        res.status(500).json({
            mensaje: 'Error al buscar cursos',
            error: error.message
        });

    }
};


// ==========================================
// CREAR CURSO
// ==========================================

const crearCurso = async (req, res) => {

    try {

        const {
            codigo,
            nombre,
            creditos
        } = req.body;


        if (!codigo || !nombre || !creditos) {

            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });

        }


        const [resultado] = await pool.query(
            `INSERT INTO cursos
            (codigo, nombre, creditos)
            VALUES (?, ?, ?)`,
            [
                codigo,
                nombre,
                creditos
            ]
        );


        res.status(201).json({

            mensaje: 'Curso creado correctamente',

            curso: {
                id_curso: resultado.insertId,
                codigo,
                nombre,
                creditos
            }

        });


    } catch (error) {

        console.error('Error al crear curso:', error);

        res.status(500).json({
            mensaje: 'Error al crear curso',
            error: error.message
        });

    }
};


module.exports = {
    obtenerCursos,
    obtenerCursoPorId,
    buscarCursos,
    crearCurso
};