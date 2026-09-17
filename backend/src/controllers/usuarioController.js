const crypto = require('crypto');
const pool = require('../config/database');


// ==========================================
// FUNCIONES AUXILIARES PARA CONTRASEÑAS
// ==========================================

function generarPassword(password) {

    const salt = crypto.randomBytes(16).toString('hex');

    const hash = crypto
        .scryptSync(password, salt, 64)
        .toString('hex');

    return `${salt}:${hash}`;
}


function verificarPassword(password, passwordGuardada) {

    try {

        const partes = passwordGuardada.split(':');

        if (partes.length !== 2) {
            return false;
        }

        const salt = partes[0];
        const hashGuardado = partes[1];

        const hash = crypto
            .scryptSync(password, salt, 64)
            .toString('hex');

        return crypto.timingSafeEqual(
            Buffer.from(hash, 'hex'),
            Buffer.from(hashGuardado, 'hex')
        );

    } catch (error) {

        return false;

    }
}


// ==========================================
// REGISTRAR USUARIO
// ==========================================

const registrarUsuario = async (req, res) => {

    try {

        const {
            registro_academico,
            nombres,
            apellidos,
            password,
            correo
        } = req.body;


        if (
            !registro_academico ||
            !nombres ||
            !apellidos ||
            !password ||
            !correo
        ) {

            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });

        }


        const [existente] = await pool.query(
            `SELECT id_usuario
             FROM usuarios
             WHERE registro_academico = ? OR correo = ?`,
            [registro_academico, correo]
        );


        if (existente.length > 0) {

            return res.status(409).json({
                mensaje: 'El registro académico o correo ya está registrado'
            });

        }


        const passwordHash = generarPassword(password);


        const [resultado] = await pool.query(
            `INSERT INTO usuarios
            (registro_academico, nombres, apellidos, password, correo)
            VALUES (?, ?, ?, ?, ?)`,
            [
                registro_academico,
                nombres,
                apellidos,
                passwordHash,
                correo
            ]
        );


        res.status(201).json({

            mensaje: 'Usuario registrado correctamente',

            usuario: {
                id_usuario: resultado.insertId,
                registro_academico,
                nombres,
                apellidos,
                correo
            }

        });


    } catch (error) {

        console.error('Error al registrar usuario:', error);

        res.status(500).json({
            mensaje: 'Error al registrar usuario',
            error: error.message
        });

    }
};


// ==========================================
// INICIAR SESIÓN
// ==========================================

const iniciarSesion = async (req, res) => {

    try {

        const {
            registro_academico,
            password
        } = req.body;


        if (!registro_academico || !password) {

            return res.status(400).json({
                mensaje: 'El registro académico y la contraseña son obligatorios'
            });

        }


        const [usuarios] = await pool.query(
            `SELECT *
             FROM usuarios
             WHERE registro_academico = ?`,
            [registro_academico]
        );


        if (usuarios.length === 0) {

            return res.status(401).json({
                mensaje: 'Registro académico o contraseña incorrectos'
            });

        }


        const usuario = usuarios[0];


        const passwordCorrecta = verificarPassword(
            password,
            usuario.password
        );


        if (!passwordCorrecta) {

            return res.status(401).json({
                mensaje: 'Registro académico o contraseña incorrectos'
            });

        }


        res.json({

            mensaje: 'Inicio de sesión exitoso',

            usuario: {
                id_usuario: usuario.id_usuario,
                registro_academico: usuario.registro_academico,
                nombres: usuario.nombres,
                apellidos: usuario.apellidos,
                correo: usuario.correo
            }

        });


    } catch (error) {

        console.error('Error al iniciar sesión:', error);

        res.status(500).json({
            mensaje: 'Error al iniciar sesión',
            error: error.message
        });

    }
};


// ==========================================
// OBTENER TODOS LOS USUARIOS
// ==========================================

const obtenerUsuarios = async (req, res) => {

    try {

        const [usuarios] = await pool.query(
            `SELECT
                id_usuario,
                registro_academico,
                nombres,
                apellidos,
                correo
             FROM usuarios
             ORDER BY apellidos, nombres`
        );


        res.json(usuarios);


    } catch (error) {

        console.error('Error al obtener usuarios:', error);

        res.status(500).json({
            mensaje: 'Error al obtener usuarios',
            error: error.message
        });

    }
};


// ==========================================
// OBTENER USUARIO POR ID
// ==========================================

const obtenerUsuarioPorId = async (req, res) => {

    try {

        const { id } = req.params;


        const [usuarios] = await pool.query(
            `SELECT
                id_usuario,
                registro_academico,
                nombres,
                apellidos,
                correo
             FROM usuarios
             WHERE id_usuario = ?`,
            [id]
        );


        if (usuarios.length === 0) {

            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });

        }


        res.json(usuarios[0]);


    } catch (error) {

        console.error('Error al obtener usuario:', error);

        res.status(500).json({
            mensaje: 'Error al obtener usuario',
            error: error.message
        });

    }
};


// ==========================================
// BUSCAR POR REGISTRO ACADÉMICO
// ==========================================

const buscarPorRegistro = async (req, res) => {

    try {

        const { registro } = req.params;


        const [usuarios] = await pool.query(
            `SELECT
                id_usuario,
                registro_academico,
                nombres,
                apellidos,
                correo
             FROM usuarios
             WHERE registro_academico LIKE ?`,
            [`%${registro}%`]
        );


        res.json(usuarios);


    } catch (error) {

        console.error('Error al buscar usuario:', error);

        res.status(500).json({
            mensaje: 'Error al buscar usuario',
            error: error.message
        });

    }
};


// ==========================================
// EDITAR PERFIL
// ==========================================

const actualizarPerfil = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            nombres,
            apellidos,
            correo
        } = req.body;


        if (!nombres || !apellidos || !correo) {

            return res.status(400).json({
                mensaje: 'Nombres, apellidos y correo son obligatorios'
            });

        }


        const [existente] = await pool.query(
            `SELECT id_usuario
             FROM usuarios
             WHERE correo = ?
             AND id_usuario <> ?`,
            [correo, id]
        );


        if (existente.length > 0) {

            return res.status(409).json({
                mensaje: 'El correo ya está siendo utilizado'
            });

        }


        const [resultado] = await pool.query(
            `UPDATE usuarios
             SET nombres = ?,
                 apellidos = ?,
                 correo = ?
             WHERE id_usuario = ?`,
            [
                nombres,
                apellidos,
                correo,
                id
            ]
        );


        if (resultado.affectedRows === 0) {

            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });

        }


        res.json({
            mensaje: 'Perfil actualizado correctamente'
        });


    } catch (error) {

        console.error('Error al actualizar perfil:', error);

        res.status(500).json({
            mensaje: 'Error al actualizar perfil',
            error: error.message
        });

    }
};


// ==========================================
// CAMBIAR CONTRASEÑA
// ==========================================

const cambiarPassword = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            passwordActual,
            passwordNueva
        } = req.body;


        if (!passwordActual || !passwordNueva) {

            return res.status(400).json({
                mensaje: 'Debe proporcionar ambas contraseñas'
            });

        }


        const [usuarios] = await pool.query(
            `SELECT password
             FROM usuarios
             WHERE id_usuario = ?`,
            [id]
        );


        if (usuarios.length === 0) {

            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });

        }


        const correcta = verificarPassword(
            passwordActual,
            usuarios[0].password
        );


        if (!correcta) {

            return res.status(401).json({
                mensaje: 'La contraseña actual es incorrecta'
            });

        }


        const nuevaHash = generarPassword(passwordNueva);


        await pool.query(
            `UPDATE usuarios
             SET password = ?
             WHERE id_usuario = ?`,
            [nuevaHash, id]
        );


        res.json({
            mensaje: 'Contraseña actualizada correctamente'
        });


    } catch (error) {

        console.error('Error al cambiar contraseña:', error);

        res.status(500).json({
            mensaje: 'Error al cambiar contraseña',
            error: error.message
        });

    }
};


// ==========================================
// RECUPERAR CONTRASEÑA
// ==========================================

const recuperarPassword = async (req, res) => {

    try {

        const {
            registro_academico,
            correo,
            passwordNueva
        } = req.body;


        if (
            !registro_academico ||
            !correo ||
            !passwordNueva
        ) {

            return res.status(400).json({
                mensaje: 'Registro académico, correo y nueva contraseña son obligatorios'
            });

        }


        const [usuarios] = await pool.query(
            `SELECT id_usuario
             FROM usuarios
             WHERE registro_academico = ?
             AND correo = ?`,
            [
                registro_academico,
                correo
            ]
        );


        if (usuarios.length === 0) {

            return res.status(404).json({
                mensaje: 'No se encontró un usuario con esos datos'
            });

        }


        const nuevaHash = generarPassword(passwordNueva);


        await pool.query(
            `UPDATE usuarios
             SET password = ?
             WHERE id_usuario = ?`,
            [
                nuevaHash,
                usuarios[0].id_usuario
            ]
        );


        res.json({
            mensaje: 'Contraseña restablecida correctamente'
        });


    } catch (error) {

        console.error('Error al recuperar contraseña:', error);

        res.status(500).json({
            mensaje: 'Error al recuperar contraseña',
            error: error.message
        });

    }
};


module.exports = {
    registrarUsuario,
    iniciarSesion,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    buscarPorRegistro,
    actualizarPerfil,
    cambiarPassword,
    recuperarPassword
};