// Importaciones
const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const { Pool } = require('pg'); // ⬅️ PostgreSQL
const tareasRoutes = require('./routes/tareas');//CAMBIAR ESTO SI O SI
//CAMBIAR ESTO SI O SI lo de arriba

const app = express();

// Puerto
app.set('port', 4000);

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
    port: 5432, // ⬅️ Puerto de PostgreSQL
    database: 'crud_nodejs'//nombre de la base de datos
});

// Middleware para usar la BD en las rutas
app.use((req, res, next) => {
    req.db = pool;
    next();
});

// Rutas
app.use('/', tareasRoutes);

// Ruta principal
app.get('/', (req, res) => {
    res.render('index');
});

// Servidor
app.listen(app.get('port'), () => {
    console.log('Listening on port', app.get('port'));
});