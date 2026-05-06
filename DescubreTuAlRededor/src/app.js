// Importaciones
const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const { Pool } = require('pg'); // PostgreSQL


//Constantes para todo lo necesario, para el registro y inicio de sesion del usuario
const session = require('express-session')
const loginRoutes = require('./routes/login')

//ruta para modificar los datos del perfil del usuario
const perfilUsuarioRoutes = require('./routes/perfilUsuario');

//ruta para añadir y todo en las rutas de senderismo
const rutasRoutes = require('./routes/rutas');

//ruta para poder añadir imagenes a las rutas que has agregado
const imagesRoutes = require('./routes/images');

//ruta para hacer las quedadas
const quedadaRoutes = require('./routes/quedada');

//ruta para poder apuntarse y desapuntarse de una quedada
const apuntarseRoutes = require('./routes/apuntarseQuedada');

//ruta para poder añadir una ruta a favoritas
const favRoutes = require('./routes/routasFavoritas');

//ruta para poder marcar la ruta como hecha
const historialRoutes = require('./routes/historialRutas');

//ruta para poder añadir un nuevo comentario
const comentarioRoutes = require('./routes/comentario');

//ruta para la vista GPS
const gpsRoutes = require('./routes/rutasGPS');

//ruta para la authenticiacion
const authMiddleware = require('./middleware/auth');
const { title } = require('process');


const app = express();

//para el css
app.use(express.static(path.join(__dirname, '../public')));

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// Puerto
app.set('port', 4000);

// Vistas
app.set('views', path.join(__dirname, '../views'));//ruta del dico durro
app.engine('.hbs', engine({//sirve para poder tener la extension de handlebars
    extname: '.hbs',
    helpers: {
        eq: (a, b) => a === b,
        formatDate: (date) => {
            if (!date) return '';
            const d = new Date(date);
            const dia = String(d.getDate()).padStart(2, '0');
            const mes = String(d.getMonth() + 1).padStart(2, '0');
            const anio = d.getFullYear();
            return `${dia}/${mes}/${anio}`;
        },
        substring: (str, start, len) => {
            if (!str) return '';
            return str.substring(start, len);
        }
    }
}));
app.set('view engine', 'hbs');

//CONEXIÓN A POSTGRESQL
const pool = new Pool({
    host: 'localhost',//host
    user: 'postgres',//usuario
    password: 'curso',//contraseña
    port: 5432, //Puerto 
    database: 'DescubreTuAlRededor'//nombre de la base de datos
});

// Middleware para usar la BD en las rutas
app.use((req, res, next) => {
    req.db = pool;
    next();
});

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Servidor
app.listen(app.get('port'), () => {
    console.log('Listening on port', app.get('port'));
});

// Rutas
app.use('/', loginRoutes);
app.use('/', perfilUsuarioRoutes);
app.use('/', rutasRoutes);
app.use('/', imagesRoutes);
app.use('/', quedadaRoutes);
app.use('/', apuntarseRoutes);
app.use('/', favRoutes);
app.use('/', historialRoutes);
app.use('/', comentarioRoutes);
app.use('/', gpsRoutes);


//ruta para el perfil del usuario
app.get('/perfilUsuario', authMiddleware, (req, res) => {
    res.render('vistas/usuario/perfilUsuario', {
        title: 'Perfil usuario | Descubre tu al rededor',
        bodyClass: 'perfilUsuario',
        mostrarNav: true,
        nombre: req.session.nombre,
        contrasena: req.session.contrasena,
        email: req.session.email,
        descripcion: req.session.descripcion,
        fotoPerfil: req.session.foto_perfil
    });
});

//ruta para modificar los datos del usuario
app.get('/modificarDatosUsuario', authMiddleware, (req, res) => {
    res.render('vistas/usuario/modificarDatosUsuario', {
        title: 'Modificar datos del usuario | Descubre tu al rededor',
        bodyClass: 'modificarDatosUsuario',
        mostrarNav: true,
        nombre: req.session.nombre,
        contrasena: req.session.contrasena,
        email: req.session.email,
        descripcion: req.session.descripcion,
        fotoPerfil: req.session.foto_perfil
    });
});

//ver rutas por hacer 
app.get('/rutasFav', authMiddleware, (req, res) => {
    res.render('vistas/rutas/rutasFav', {
        title: 'Rutas favoritas | Descubre tu al rededor',
        bodyClass: 'verRutasPorHacer',
        mostrarNav: true,
        nombre: req.session.nombre
    });
});


//ver detalle de la ruta
app.get('/detalleRuta', (req, res) => {
    res.render('vistas/rutas/detalleRuta', {
        title: 'Ver rutas | Descubre tu al rededor',
        bodyClass: 'verRutas',
        mostrarNav: true,
        nombre: req.session.nombre
    });
});

//formulario añadir nueva ruta 
app.get('/anadirRuta', authMiddleware, (req, res) => {
    res.render('vistas/rutas/anadirRuta', {
        title: 'Añadir nueva ruta | Descubre tu al rededor',
        bodyClass: 'anadirRuta',
        mostrarNav: true,
        nombre: req.session.nombre
    });
});


//formulario para poder cambiar la contraseña
app.get('/modificarContrasenia', authMiddleware, (req, res) => {
    res.render('vistas/usuario/modificarContrasenia', {
        title: 'Modificar contraseña | Descubre tu al rededor',
        bodyClass: 'modificarContrasenia',
        mostrarNav: true,
        nombre: req.session.nombre,
        contrasena: req.session.contrasena
    });
});

//ruta para modificar los datos del usuario
app.get('/modificarFotoPerfil', authMiddleware, (req, res) => {
    res.render('vistas/usuario/modificarFotoPerfil', {
        title: 'Cambiar foto de perfil | Descubre tu al rededor',
        bodyClass: 'modificarFotoPerfil',
        mostrarNav: true,
        nombre: req.session.nombre,
        fotoPerfil: req.session.foto_perfil
    });
});

//ruta para poder ver misRutas
app.get('/misRutas', authMiddleware, (req, res) => {
    res.render('vistas/rutas/misRutas', {
        title: 'Mis rutas | Descubre tu al rededor',
        bodyClass: 'misRutas',
        mostrarNav: true,
        nombre: req.session.nombre
    });
});

//ruta para poder ver el detalle de una ruta que has agregado como usuario
app.get('/miRuta', authMiddleware, (req, res) => {
    res.render('vistas/rutas/miRuta', {
        title: ruta.nombre_ruta + " | Descubre tu al rededor",
        bodyClass: 'verRutas',
        mostrarNav: true,
        nombre: req.session.nombre
    });
});

//vista de configuracion
app.get('/configuracion', authMiddleware, (req, res) => {
    res.render('vistas/usuario/configuracion', {
        title: 'Configuracion | Descubre tu al rededor',
        bodyClass: 'opciones',
        mostrarNav: true,
        nombre: req.session.nombre
    });
});

//vista para organizar quedada
app.get('/organizarQuedada/:id', authMiddleware, (req, res) => {
    const { id } = req.params;
    res.render('vistas/quedada/organizarQuedada', {
        title: 'Organizar quedada | Descubre tu al rededor',
        bodyClass: 'organizarQuedada',
        mostrarNav: true,
        nombre: req.session.nombre,
        id_ruta: id
    });
});

//vista para poder ver las quedadas
app.get('/verQuedadas', authMiddleware, (req, res) => {
    res.render('vistas/quedada/verQuedadas', {
        title: 'Ver quedadas | Descubre tu al rededor',
        bodyClass: 'verRutas',//se va a usar la misma body class para el estilo para evitar repeticion
        mostrarNav: true,
        nombre: req.session.nombre
    });
});

//vista para poder ver el detalle de una quedada
app.get('/detalleQuedada', authMiddleware, (req, res) => {
    res.render('vistas/quedada/detalleQuedada', {
        title: 'Quedada de ' + quedada.id_quedada + " | Descubre tu al rededor",
        bodyClass: 'detalleQuedada',
        mostrarNav: true,
        nombre: req.session.nombre
    });
});

//vista para poder ver la vista de todas las quedadas que el a organizado
app.get('/quedadasOrganizadas', authMiddleware, (req, res) => {
    res.render('vistas/quedada/quedadasOrganizadas', {
        title: 'Quedadas organizadas | Descubre tu al rededor',
        bodyClass: 'verRutas',
        mostrarNav: true,
        nombre: req.session.nombre
    })
});

//vista para que poder ver las quedadas a las que has participado
app.get('/quedadasParticipadas', authMiddleware, (req, res) => {
    res.render('vistas/quedada/quedadasParticipado', {
        title: 'Quedadas en las que has participado | Descubre tu al rededor',
        bodyClass: 'verRutas',
        mostrarNav: true,
        nombre: req.session.nombre
    })
});