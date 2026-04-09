

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ENUMS
CREATE TYPE rol_usuario AS ENUM ('Usuario', 'Admin');
CREATE TYPE dificultad_ruta AS ENUM ('Fácil', 'Normal', 'Difícil');

-- USUARIO
CREATE TABLE usuario(
    email varchar(100) PRIMARY KEY NOT NULL,
    nombre varchar(1500) NOT NULL,
    contrasena text NOT NULL,
    rol rol_usuario NOT NULL,
	descripcion text,
	foto_perfil varchar(255)
);

-- RUTA
CREATE TABLE ruta(
    id_ruta serial PRIMARY KEY,
    nombre_ruta varchar(50) UNIQUE NOT NULL,
    dificultad_ruta dificultad_ruta,
    km numeric(6,2),
    direccion text NOT NULL,
	mapa_ruta varchar(255),
    descripcion text,
    desnivel_pos int,
    desnivel_neg int,
    altura_max int,
    altura_min int,
    geom geometry(LineString, 4326),

	email varchar(100) NOT NULL,
	FOREIGN KEY (email)
        REFERENCES usuario(email)
        ON DELETE CASCADE
);

CREATE INDEX idx_ruta_geom ON Ruta USING GIST (geom);

-- IMAGENES RUTA
CREATE TABLE imagenes_ruta(
    id_imagen serial PRIMARY KEY,
    id_ruta int NOT NULL,
    imagen_ruta varchar(255),

    FOREIGN KEY (id_ruta)
        REFERENCES ruta(id_ruta)
        ON DELETE CASCADE
);

-- COMENTARIO RUTA
CREATE TABLE comentario_ruta(
    id_comentario serial PRIMARY KEY,
    email varchar(100) NOT NULL,
    id_ruta int NOT NULL,
    comentario text,
    fecha_comentario timestamp DEFAULT current_timestamp,
	url_imagen varchar(255),
	ruta_hecha boolean,

    FOREIGN KEY (email)
        REFERENCES usuario(email)
        ON DELETE CASCADE,

    FOREIGN KEY (id_ruta)
        REFERENCES ruta(id_Ruta)
        ON DELETE CASCADE
);

-- RUTAS POR HACER
CREATE TABLE rutas_por_hacer(
    id_rutaPorHacer serial PRIMARY KEY,
    email varchar(100) NOT NULL,
    id_ruta int NOT NULL,

    FOREIGN KEY (email)
        REFERENCES usuario(email)
        ON DELETE CASCADE,

    FOREIGN KEY (id_ruta)
        REFERENCES ruta(id_ruta)
        ON DELETE CASCADE
);

-- QUEDADA
CREATE TABLE quedada(
    id_quedada serial PRIMARY KEY,
    id_ruta int NOT NULL,
    email_creador varchar(100) NOT NULL,
    dia timestamp NOT NULL,
    punto_encuentro geometry(Point, 4326),
    descripcion text,
    max_participantes int,

    FOREIGN KEY (id_ruta)
        REFERENCES ruta(id_ruta)
        ON DELETE CASCADE,

    FOREIGN KEY (email_creador)
        REFERENCES usuario(email)
        ON DELETE CASCADE
);

-- PARTICIPANTES QUEDADA
CREATE TABLE participantes_quedada(
    id_quedada int NOT NULL,
    email varchar(100) NOT NULL,

    PRIMARY KEY (id_quedada, email),

    FOREIGN KEY (id_quedada)
        REFERENCES quedada(id_quedada)
        ON DELETE CASCADE,

    FOREIGN KEY (email)
        REFERENCES usuario(email)
        ON DELETE CASCADE
);

-- SEGUIDORES
CREATE TABLE seguidores(
    email_seguidor varchar(100) NOT NULL,
    email_seguido varchar(100) NOT NULL,
    fecha_seguimiento timestamp DEFAULT current_timestamp,

    PRIMARY KEY (email_seguidor, email_seguido),

    CHECK (email_seguidor <> email_seguido),

    FOREIGN KEY (email_seguidor)
        REFERENCES usuario(email)
        ON DELETE CASCADE,

    FOREIGN KEY (email_Seguido)
        REFERENCES usuario(email)
        ON DELETE CASCADE
);


select * from usuario;