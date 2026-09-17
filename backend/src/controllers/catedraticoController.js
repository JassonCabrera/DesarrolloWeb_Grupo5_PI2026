const pool = require('../config/database');


// ==========================================
// OBTENER TODOS
// ==========================================

const obtenerCatedraticos = async (req, res) => {

    try {

        const [catedraticos] = await pool.query(
            `SELECT
                id_catedratico,
                nombres,
                apellidos
             FROM catedraticos
             ORDER BY apellidos, nombres`
        );


        res.json(catedraticos);


    } catch (error) {

        console.error('Error al obtener catedráticos:', error);

        res.status(500).json({
            mensaje: 'Error al obtener catedráticos',
            error: error.message
        });

    }
};


// ==========================================
// OBTENER POR ID
// ==========================================

const obtenerCatedraticoPorId = async (req, res) => {

    try {

        const { id } = req.params;


        const [catedraticos] = await pool.query(
            `SELECT
                id_catedratico,
                nombres,
                apellidos
             FROM catedraticos
             WHERE id_catedratico = ?`,
            [id]
        );


        if (catedraticos.length === 0) {

            return res.status(404).json({
                mensaje: 'Catedrático no encontrado'
            });

        }


        res.json(catedraticos[0]);


    } catch (error) {

        console.error('Error al obtener catedrático:', error);

        res.status(500).json({
            mensaje: 'Error al obtener catedrático',
            error: error.message
        });

    }
};


// ==========================================
// BUSCAR CATEDRÁTICOS
// ==========================================

const buscarCatedraticos = async (req, res) => {

    try {

        const { texto } = req.params;


        const [catedraticos] = await pool.query(
            `SELECT
                id_catedratico,
                nombres,
                apellidos
             FROM catedraticos
             WHERE nombres LIKE ?
                OR apellidos LIKE ?
             ORDER BY apellidos, nombres`,
            [
                `%${texto}%`,
                `%${texto}%`
            ]
        );


        res.json(catedraticos);


    } catch (error) {

        console.error('Error al buscar catedráticos:', error);

        res.status(500).json({
            mensaje: 'Error al buscar catedráticos',
            error: error.message
        });

    }
};


// ==========================================
// CREAR CATEDRÁTICO
// ==========================================

const crearCatedratico = async (req, res) => {

    try {

        const {
            nombres,
            apellidos
        } = req.body;


        if (!nombres || !apellidos) {

            return res.status(400).json({
                mensaje: 'Nombres y apellidos son obligatorios'
            });

        }


        const [resultado] = await pool.query(
            `INSERT INTO catedraticos
            (nombres, apellidos)
            VALUES (?, ?)`,
            [
                nombres,
                apellidos
            ]
        );


        res.status(201).json({

            mensaje: 'Catedrático creado correctamente',

            catedratico: {
                id_catedratico: resultado.insertId,
                nombres,
                apellidos
            }

        });


    } catch (error) {

        console.error('Error al crear catedrático:', error);

        res.status(500).json({
            mensaje: 'Error al crear catedrático',
            error: error.message
        });

    }
};


module.exports = {
    obtenerCatedraticos,
    obtenerCatedraticoPorId,
    buscarCatedraticos,
    crearCatedratico
};