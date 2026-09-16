const express = require('express');
const cors = require('cors');

const pool = require('./config/database');

const app = express();

app.use(cors());
app.use(express.json());


// Ruta principal
app.get('/', (req, res) => {
    res.json({
        mensaje: 'API de Desarrollo Web funcionando correctamente'
    });
});


// Ruta para comprobar la conexión con MySQL
app.get('/api/prueba-db', async (req, res) => {

    try {

        const [resultado] = await pool.query('SELECT 1 AS conectado');

        res.json({
            mensaje: 'Conexión con MySQL funcionando correctamente',
            baseDatos: 'desarrollo_web',
            resultado: resultado
        });

    } catch (error) {

        console.error('Error al conectar con MySQL:', error);

        res.status(500).json({
            mensaje: 'Error al conectar con MySQL',
            error: error.message
        });
    }
});


// Puerto del servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});