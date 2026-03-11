//Ponemos las instalaciones que se han hecho desde el cmd
const express = require('express');
const { engine } = require('express-handlebars');
const myconnection = require('express-myconnection');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const tareasRoutes = require('./routes/tareas');//constante para la carpeta de routes

const session = require('express-session')
const loginRoutes = require('./routes/login')

const app = express();
//Puerto de la app
app.set('port', 4000);

// Middlewares
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//vistas
app.set('views', __dirname + '/view');//ruta del dico durro
app.engine('.hbs', engine({//sirve para poder tener la extension de handlebars
    extname: '.hbs'
}));
app.set('view engine', 'hbs');

app.use(myconnection(mysql, {
    host: 'localhost',//el host
    user: 'root',//usuario de mysql
    password: 'curso',//contraseña de mysl
    port: 3306,//puerto de mysql
    database: 'crud_nodejs'//Aqui se pone el nombre de la base de datos
}, 'single'))

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.listen(app.get('port'), () => {
    console.log('Listening on port', app.get('port'))
});

app.use('/', tareasRoutes);
app.use('/login', loginRoutes);

//para el navegador
app.get('/', (req, res) => {
    if (req.session.loggendin == true) {
        res.render('/home', {nombreUsuario: req.session.nombreUsuario});
    } else {
        res.redirect('/tareas')
    }
})