const express = require('express');
const cors = require('cors');

const pool = require('./config/database');

const usuarioRoutes = require('./routes/usuarioRoutes');
const cursoRoutes = require('./routes/cursoRoutes');
const catedraticoRoutes = require('./routes/catedraticoRoutes');
const publicacionRoutes = require('./routes/publicacionRoutes');
const comentarioRoutes = require('./routes/comentarioRoutes');
const cursoAprobadoRoutes = require('./routes/cursoAprobadoRoutes');


const app = express();


// ==========================================
// MIDDLEWARES
// ==========================================

app.use(cors());

app.use(express.json());


// ==========================================
// RUTA PRINCIPAL
// ==========================================

app.get('/', (req, res) => {

    res.json({
        mensaje: 'API de Desarrollo Web funcionando correctamente'
    });

});


// ==========================================
// PRUEBA DE MYSQL
// ==========================================

app.get('/api/prueba-db', async (req, res) => {

    try {

        const [resultado] = await pool.query(
            'SELECT 1 AS conectado'
        );


        res.json({

            mensaje: 'Conexión con MySQL funcionando correctamente',

            baseDatos: process.env.DB_NAME,

            resultado: resultado

        });


    } catch (error) {

        console.error(
            'Error al conectar con MySQL:',
            error
        );


        res.status(500).json({

            mensaje: 'Error al conectar con MySQL',

            error: error.message

        });

    }

});


// ==========================================
// RUTAS
// ==========================================

app.use(
    '/api/usuarios',
    usuarioRoutes
);


app.use(
    '/api/cursos',
    cursoRoutes
);


app.use(
    '/api/catedraticos',
    catedraticoRoutes
);


app.use(
    '/api/publicaciones',
    publicacionRoutes
);


app.use(
    '/api/comentarios',
    comentarioRoutes
);


app.use(
    '/api/cursos-aprobados',
    cursoAprobadoRoutes
);


// ==========================================
// MANEJO DE RUTAS NO ENCONTRADAS
// ==========================================

app.use((req, res) => {

    res.status(404).json({

        mensaje: 'Ruta no encontrada',

        ruta: req.originalUrl

    });

});


// ==========================================
// MANEJO GENERAL DE ERRORES
// ==========================================

app.use((error, req, res, next) => {

    console.error('Error del servidor:', error);


    res.status(500).json({

        mensaje: 'Error interno del servidor',

        error: error.message

    });

});


// ==========================================
// SERVIDOR
// ==========================================

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {

    console.log(
        `Servidor ejecutándose en http://localhost:${PORT}`
    );

});