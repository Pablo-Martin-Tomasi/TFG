// Importaciones
const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const { Pool } = require('pg'); // PostgreSQL

//Constantes para todo lo necesario, para el registro y inicio de sesion del usuario
const session = require('express-session')
const loginRoutes = require('./routes/login')

//ruta para modificar los datos del perfil del usuario
const perfilUsuarioRoutes = require('./routes/perfilUsuario');

const app = express();

//para el css
app.use(express.static(__dirname + '/public'));

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Puerto
app.set('port', 4000);

// Vistas
app.set('views', __dirname + '/view');//ruta del dico durro
app.engine('.hbs', engine({//sirve para poder tener la extension de handlebars
    extname: '.hbs'
}));
app.set('view engine', 'hbs');

//CONEXIÓN A POSTGRESQL
const pool = new Pool({
    host: 'localhost',//host
    user: 'postgres',//usuario
    password: 'curso',//contraseña
    port: 5432, //Puerto 
    database: 'DescubreTuAlrededor'//nombre de la base de datos
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


// Servidor
app.listen(app.get('port'), () => {
    console.log('Listening on port', app.get('port'));
});

// Rutas
app.use('/', loginRoutes);
app.use('/', perfilUsuarioRoutes);

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
app.get('/perfilUsuario', (req, res) => {
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
app.get('/modificarDatosUsuario', (req, res) => {
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
app.get('/verRutasHechas', (req, res) => {
    res.render('vistas/usuario/verRutasHechas', {
        title: 'Ver rutas hechas',
        bodyClass: 'verRutasHechas',
        mostrarNav: true,
        nombre: req.session.nombre
    });
});

//ver rutas por hacer 
app.get('/verRutasPorHacer', (req, res) => {
    res.render('vistas/usuario/verRutasPorHacer', {
        title: 'Ver rutas por hacer',
        bodyClass: 'verRutasPorHacer',
        mostrarNav: true,
        nombre: req.session.nombre
    });
});

//ver rutas 
app.get('/verRutas', (req, res) => {
    res.render('vistas/rutas/verRutas', {
        title: 'Ver rutas',
        bodyClass: 'verRutas',
        mostrarNav: true,
        nombre: req.session.nombre
    });
});

//ver rutas 
app.get('/detalleRuta', (req, res) => {
    res.render('vistas/rutas/detalleRuta', {
        title: 'Ver rutas',
        bodyClass: 'verRutas',
        mostrarNav: true,
        nombre: req.session.nombre
    });
});

//formulario añadir nueva ruta 
app.get('/anadirRuta', (req, res) => {
    res.render('vistas/rutas/anadirRuta', {
        title: 'Añadir nueva ruta',
        bodyClass: 'anadirRuta',
        mostrarNav: true,
        nombre: req.session.nombre
    });
});