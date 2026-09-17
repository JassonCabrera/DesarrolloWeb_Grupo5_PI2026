const pool = require('../config/database');


// ==========================================
// OBTENER CURSOS APROBADOS DE UN USUARIO
// ==========================================

const obtenerCursosAprobados = async (req, res) => {

    try {

        const { id_usuario } = req.params;


        const [cursos] = await pool.query(
            `
            SELECT
                c.id_curso,
                c.codigo,
                c.nombre,
                c.creditos,
                ca.fecha_aprobacion

            FROM cursos_aprobados ca

            INNER JOIN cursos c
                ON ca.id_curso = c.id_curso

            WHERE ca.id_usuario = ?

            ORDER BY c.codigo
            `,
            [id_usuario]
        );


        const totalCreditos = cursos.reduce(
            (total, curso) => total + Number(curso.creditos),
            0
        );


        res.json({

            cursos: cursos,

            totalCreditos: totalCreditos

        });


    } catch (error) {

        console.error(
            'Error al obtener cursos aprobados:',
            error
        );

        res.status(500).json({
            mensaje: 'Error al obtener cursos aprobados',
            error: error.message
        });

    }
};


// ==========================================
// AGREGAR CURSO APROBADO
// ==========================================

const agregarCursoAprobado = async (req, res) => {

    try {

        const {
            id_usuario,
            id_curso
        } = req.body;


        if (!id_usuario || !id_curso) {

            return res.status(400).json({
                mensaje: 'El usuario y curso son obligatorios'
            });

        }


        const [existente] = await pool.query(
            `
            SELECT *
            FROM cursos_aprobados
            WHERE id_usuario = ?
            AND id_curso = ?
            `,
            [
                id_usuario,
                id_curso
            ]
        );


        if (existente.length > 0) {

            return res.status(409).json({
                mensaje: 'El curso ya se encuentra aprobado'
            });

        }


        await pool.query(
            `
            INSERT INTO cursos_aprobados
            (
                id_usuario,
                id_curso
            )
            VALUES (?, ?)
            `,
            [
                id_usuario,
                id_curso
            ]
        );


        res.status(201).json({
            mensaje: 'Curso agregado a cursos aprobados'
        });


    } catch (error) {

        console.error(
            'Error al agregar curso aprobado:',
            error
        );

        res.status(500).json({
            mensaje: 'Error al agregar curso aprobado',
            error: error.message
        });

    }
};


// ==========================================
// ELIMINAR CURSO APROBADO
// ==========================================

const eliminarCursoAprobado = async (req, res) => {

    try {

        const {
            id_usuario,
            id_curso
        } = req.params;


        const [resultado] = await pool.query(
            `
            DELETE FROM cursos_aprobados
            WHERE id_usuario = ?
            AND id_curso = ?
            `,
            [
                id_usuario,
                id_curso
            ]
        );


        if (resultado.affectedRows === 0) {

            return res.status(404).json({
                mensaje: 'El curso aprobado no existe'
            });

        }


        res.json({
            mensaje: 'Curso eliminado de aprobados correctamente'
        });


    } catch (error) {

        console.error(
            'Error al eliminar curso aprobado:',
            error
        );

        res.status(500).json({
            mensaje: 'Error al eliminar curso aprobado',
            error: error.message
        });

    }
};


module.exports = {
    obtenerCursosAprobados,
    agregarCursoAprobado,
    eliminarCursoAprobado
};