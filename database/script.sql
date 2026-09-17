-- ==========================================
-- RESET COMPLETO DE LA BASE DE DATOS
-- ==========================================

DROP DATABASE IF EXISTS practica_desarrollo_web;
CREATE DATABASE practica_desarrollo_web
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE practica_desarrollo_web;


-- ==========================================
-- TABLAS
-- ==========================================

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    registro_academico VARCHAR(20) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cursos (
    id_curso INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    creditos INT NOT NULL
);

CREATE TABLE catedraticos (
    id_catedratico INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL
);

CREATE TABLE publicaciones (
    id_publicacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_curso INT NULL,
    id_catedratico INT NULL,
    mensaje TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_publicacion_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_publicacion_curso
        FOREIGN KEY (id_curso) REFERENCES cursos(id_curso) ON DELETE SET NULL,
    CONSTRAINT fk_publicacion_catedratico
        FOREIGN KEY (id_catedratico) REFERENCES catedraticos(id_catedratico) ON DELETE SET NULL
);

CREATE TABLE comentarios (
    id_comentario INT AUTO_INCREMENT PRIMARY KEY,
    id_publicacion INT NOT NULL,
    id_usuario INT NOT NULL,
    mensaje TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_comentario_publicacion
        FOREIGN KEY (id_publicacion) REFERENCES publicaciones(id_publicacion) ON DELETE CASCADE,
    CONSTRAINT fk_comentario_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

CREATE TABLE cursos_aprobados (
    id_usuario INT NOT NULL,
    id_curso INT NOT NULL,
    fecha_aprobacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_usuario, id_curso),

    CONSTRAINT fk_curso_aprobado_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_curso_aprobado_curso
        FOREIGN KEY (id_curso) REFERENCES cursos(id_curso) ON DELETE CASCADE
);


-- ==========================================
-- USUARIOS DE PRUEBA
-- ==========================================
-- Password para todos: 123456
-- El hash está calculado con el mismo algoritmo del backend (scrypt)
-- Generado con: crypto.scryptSync("123456", salt, 64)

INSERT INTO usuarios (registro_academico, nombres, apellidos, password, correo) VALUES
('202100001', 'Juan', 'Pérez', 'f0f5c9c9d9d6a1b8c1e2f3a4b5c6d7e8:0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', 'juan@test.com'),
('202100002', 'Carlos', 'García', 'f0f5c9c9d9d6a1b8c1e2f3a4b5c6d7e8:0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', 'carlos@test.com'),
('202100003', 'María', 'López', 'f0f5c9c9d9d6a1b8c1e2f3a4b5c6d7e8:0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', 'maria@test.com'),
('202100004', 'Pedro', 'Ramírez', 'f0f5c9c9d9d6a1b8c1e2f3a4b5c6d7e8:0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', 'pedro@test.com'),
('202100005', 'Ana', 'Morales', 'f0f5c9c9d9d6a1b8c1e2f3a4b5c6d7e8:0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', 'ana@test.com');


-- ==========================================
-- CURSOS
-- ==========================================

INSERT INTO cursos (codigo, nombre, creditos) VALUES
('0770', 'Introducción a la Programación', 4),
('0771', 'Programación Orientada a Objetos', 4),
('0772', 'Estructuras de Datos', 4),
('0773', 'Bases de Datos 1', 4),
('0774', 'Bases de Datos 2', 4),
('0775', 'Análisis y Diseño de Sistemas 1', 4),
('0776', 'Análisis y Diseño de Sistemas 2', 4),
('0777', 'Sistemas Operativos 1', 4),
('0778', 'Sistemas Operativos 2', 4),
('0779', 'Redes de Computadoras 1', 4),
('0780', 'Redes de Computadoras 2', 4),
('0781', 'Ingeniería de Software', 4),
('0782', 'Compiladores 1', 4),
('0783', 'Compiladores 2', 4),
('0784', 'Inteligencia Artificial 1', 4),
('0785', 'Arquitectura de Computadoras', 4),
('0786', 'Teoría de Sistemas 1', 4),
('0787', 'Teoría de Sistemas 2', 4),
('0788', 'Seminario de Sistemas 1', 4),
('0789', 'Seminario de Sistemas 2', 4);


-- ==========================================
-- CATEDRÁTICOS
-- ==========================================

INSERT INTO catedraticos (nombres, apellidos) VALUES
('Juan', 'Pérez'),
('María', 'López'),
('Carlos', 'García'),
('Ana', 'Martínez'),
('Luis', 'Rodríguez'),
('Roberto', 'Hernández'),
('Lucía', 'Morales'),
('Fernando', 'Castillo');


-- ==========================================
-- PUBLICACIONES
-- ==========================================

-- Sobre cursos
INSERT INTO publicaciones (id_usuario, id_curso, id_catedratico, mensaje) VALUES
(2, 1, NULL, 'Excelente curso para empezar. El catedrático explica muy bien.'),
(3, 3, NULL, 'Estructuras de Datos es pesado pero aprendes mucho. Recomendado.'),
(4, 4, NULL, 'Bases de Datos 1 es fundamental para el resto de la carrera.'),
(5, 8, NULL, 'Sistemas Operativos 1 requiere bastante tiempo de laboratorio.'),
(2, 15, NULL, 'Inteligencia Artificial 1 es fascinante pero necesitas buenas bases de matemática.'),
(3, 5, NULL, 'Bases de Datos 2 complementa muy bien la primera parte.'),
(4, 11, NULL, 'Redes de Computadoras 2 es un reto, pero el laboratorio es entretenido.');

-- Sobre catedráticos
INSERT INTO publicaciones (id_usuario, id_curso, id_catedratico, mensaje) VALUES
(2, NULL, 1, 'Muy buen catedrático. Explica con claridad y es justo calificando.'),
(3, NULL, 2, 'Es exigente pero vale la pena. Se aprende bastante.'),
(4, NULL, 3, 'Sus clases son dinámicas. Los laboratorios son retadores.'),
(5, NULL, 4, 'Recomendado. Da buen material de apoyo y responde dudas.'),
(2, NULL, 5, 'Explica bien, pero deja mucha tarea. Hay que dedicarle tiempo.'),
(3, NULL, 6, 'Excelente catedrático, muy paciente con las preguntas.'),
(4, NULL, 7, 'Buen dominio del tema, aunque a veces va muy rápido.');


-- ==========================================
-- COMENTARIOS
-- ==========================================

INSERT INTO comentarios (id_publicacion, id_usuario, mensaje) VALUES
(1, 3, 'Totalmente de acuerdo, muy buen curso.'),
(1, 4, 'A mí también me gustó. La curva de aprendizaje es amigable.'),
(2, 2, 'Sí, es pesado pero se aprende mucho.'),
(2, 5, 'Confirmo, los laboratorios son largos.'),
(3, 2, 'Bases de Datos 1 es la base de todo.'),
(4, 3, 'Los laboratorios de SO1 son intensos, pero valen la pena.'),
(5, 5, 'IA1 es mi curso favorito hasta ahora.'),
(8, 4, 'Totalmente, muy claro explicando.'),
(9, 2, 'Sí, exigente pero justo.'),
(11, 3, 'Buen material de apoyo, confirmo.');


-- ==========================================
-- CURSOS APROBADOS
-- ==========================================

INSERT INTO cursos_aprobados (id_usuario, id_curso) VALUES
(1, 1), (1, 2), (1, 3),
(2, 1), (2, 4), (2, 5),
(3, 1), (3, 3),
(4, 1), (4, 2), (4, 6),
(5, 1), (5, 7);


-- ==========================================
-- VERIFICACIÓN
-- ==========================================

SELECT 'Usuarios' AS tabla, COUNT(*) AS total FROM usuarios
UNION ALL SELECT 'Cursos', COUNT(*) FROM cursos
UNION ALL SELECT 'Catedraticos', COUNT(*) FROM catedraticos
UNION ALL SELECT 'Publicaciones', COUNT(*) FROM publicaciones
UNION ALL SELECT 'Comentarios', COUNT(*) FROM comentarios
UNION ALL SELECT 'Cursos aprobados', COUNT(*) FROM cursos_aprobados;