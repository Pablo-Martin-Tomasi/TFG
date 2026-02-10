CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS postgis;

-- ENUMS
CREATE TYPE RolUsuario AS ENUM ('Usuario', 'Admin');
CREATE TYPE DificultadRuta AS ENUM ('Fácil', 'Normal', 'Difícil');

CREATE TABLE Usuario(
	IdUsuario serial primary key,
	NombreUsuario varchar(50) unique not null,
	Email varchar(50) unique not null,
	Contrasena text not null,
	Rol RolUsuario not null
);

CREATE TABLE DescripcionUsuario(
	IdDescripcionUsuario serial primary key,
	IdUsuario int not null,
	Descripcion text,
	FotoPerfil varchar(255),

	FOREIGN KEY (IdUsuario)
	REFERENCES Usuario(IdUsuario)
	ON DELETE CASCADE
);

CREATE TABLE Ruta(
	IdRuta serial primary key,
	NombreRuta varchar(50) unique not null,
	DificultadRuta DificultadRuta,
	Km numeric(6, 2),
	DescripcionRapida text,
	geom GEOMETRY(LineString, 4326)
);

CREATE TABLE DescripcionRuta(
	IdRutaDescripcion serial primary key,
	IdRuta int not null,
	MapaRuta varchar(255), --Aqui va a haber una imagen del mapa de la ruta
	Descripcion text,
	Bucle boolean,
	DesnivelPos int,
	DesnivelNeg int,
	AlturaMax int,
	AlturaMin int,

	FOREIGN KEY (IdRuta)
	REFERENCES Ruta(IdRuta)
	ON DELETE CASCADE
);

CREATE TABLE ImagenesRuta(
	IdImagen serial primary key,
	IdRutaDescripcion int not null,
	ImagenRuta varchar(255), --Aqui va el o los enlaces de las imagenes de la ruta

	FOREIGN KEY (IdRutaDescripcion)
	REFERENCES DescripcionRuta(IdRutaDescripcion)
	ON DELETE CASCADE
);

CREATE TABLE ComentarioRuta(
	IdComentario serial primary key,
	IdUsuario int,
	IdRuta int,
	Comentario text,
	FechaComentario timestamp default current_timestamp,

	FOREIGN KEY (IdUsuario)
	REFERENCES Usuario(IdUsuario)
	ON DELETE CASCADE,

	FOREIGN KEY (IdRuta)
	REFERENCES Ruta(IdRuta)
	ON DELETE CASCADE
);

CREATE TABLE RutasHechas(
	IdRutaHecha serial primary key,
	IdUsuario int not null,
	IdRuta int not null,
	UNIQUE (IdUsuario, IdRuta),

	FOREIGN KEY (IdUsuario)
	REFERENCES Usuario(IdUsuario)
	ON DELETE CASCADE,

	FOREIGN KEY (IdRuta)
	REFERENCES Ruta(IdRuta)
	ON DELETE CASCADE
);

CREATE TABLE RutasPorHacer(
	IdRutaPorHacer serial primary key,
	IdUsuario int not null,
	IdRuta int not null,
	UNIQUE (IdUsuario, IdRuta),

	FOREIGN KEY (IdUsuario)
	REFERENCES Usuario(IdUsuario)
	ON DELETE CASCADE,

	FOREIGN KEY (IdRuta)
	REFERENCES Ruta(IdRuta)
	ON DELETE CASCADE
);