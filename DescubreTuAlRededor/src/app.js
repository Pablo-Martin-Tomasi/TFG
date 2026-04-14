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
        eq: (a, b) => a === b
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

// Ruta principal
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Inicio',
        bodyClass: 'vistaIndex',
        mostrarNav: true,
        nombre: req.session.nombre
    });
});

//ruta para el perfil del usuario
app.get('/perfilUsuario', authMiddleware, (req, res) => {
    res.render('vistas/usuario/perfilUsuario', {
        title: 'Perfil usuario',
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
        title: 'Modificar datos del usuario',
        bodyClass: 'modificarDatosUsuario',
        mostrarNav: true,
        nombre: req.session.nombre,
        contrasena: req.session.contrasena,
        email: req.session.email,
        descripcion: req.session.descripcion,
        fotoPerfil: req.session.foto_perfil
    });
});

//ver rutas hechas 
app.get('/verRutasHechas', authMiddleware, (req, res) => {
    res.render('vistas/usuario/verRutasHechas', {
        title: 'Ver rutas hechas',
        bodyClass: 'verRutasHechas',
        mostrarNav: true,
        nombre: req.session.nombre
    });
});

//ver rutas por hacer 
app.get('/verRutasPorHacer', authMiddleware, (req, res) => {
    res.render('vistas/usuario/verRutasPorHacer', {
        title: 'Ver rutas por hacer',
        bodyClass: 'verRutasPorHacer',
        mostrarNav: true,
        nombre: req.session.nombre
    });
});


//ver detalle de la ruta
app.get('/detalleRuta', (req, res) => {
    res.render('vistas/rutas/detalleRuta', {
        title: 'Ver rutas',
        bodyClass: 'verRutas',
        mostrarNav: true,
        nombre: req.session.nombre
    });
});

//formulario añadir nueva ruta 
app.get('/anadirRuta', authMiddleware, (req, res) => {
    res.render('vistas/rutas/anadirRuta', {
        title: 'Añadir nueva ruta',
        bodyClass: 'anadirRuta',
        mostrarNav: true,
        nombre: req.session.nombre
    });
});

//formulario para poder cambiar la contraseña
app.get('/modificarContrasenia', authMiddleware, (req, res) => {
    res.render('vistas/usuario/modificarContrasenia', {
        title: 'Modificar contraseña',
        bodyClass: 'modificarContrasenia',
        mostrarNav: true,
        nombre: req.session.nombre,
        contrasena: req.session.contrasena
    });
});

//ruta para modificar los datos del usuario
app.get('/modificarFotoPerfil', authMiddleware, (req, res) => {
    res.render('vistas/usuario/modificarFotoPerfil', {
        title: 'Cambiar foto de perfil',
        bodyClass: 'modificarFotoPerfil',
        mostrarNav: true,
        nombre: req.session.nombre,
        fotoPerfil: req.session.foto_perfil
    });
});

//ruta para poder ver misRutas
app.get('/misRutas', authMiddleware, (req, res) => {
    res.render('vistas/rutas/misRutas', {
        title: 'Mis rutas',
        bodyClass: 'misRutas',
        mostrarNav: true,
        nombre: req.session.nombre
    });
});

//ruta para poder ver el detalle de una ruta que has agregado como usuario
app.get('/miRuta', authMiddleware, (req, res) => {
    res.render('vistas/rutas/miRuta', {
        title: ruta.nombre_ruta,
        bodyClass: 'verRutas',
        mostrarNav: true,
        nombre: req.session.nombre
    });
});

//vista de configuracion
app.get('/configuracion', authMiddleware, (req, res) => {
    res.render('vistas/usuario/configuracion', {
        title: 'Configuracion',
        bodyClass: 'opciones',
        mostrarNav: true,
        nombre: req.session.nombre
    });
});

//vista de anadir imagenes
app.get('/anadirImagenRuta', authMiddleware, (req, res) => {
    res.render('vistas/rutas/anadirImagenRuta', {
        title: 'Añadir imagenes a la ruta',
        bodyClass: 'imagenRuta',
        mostrarNav: true,
        nombre: req.session.nombre
    })
})