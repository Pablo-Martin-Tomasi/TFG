const bcrypt = require('bcrypt');

function login(req, res) {
    if (req.session.loggendin != true) {
        res.render('login/index');
    } else {
        res.redirect('/tareas')
    }
}

function aut(req, res) {
    const data = req.body;

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM users WHERE email = ?', [data.email], (err, userdata) => {
            if (userdata.length > 0) {
                userdata.forEach(element => {
                    bcrypt.compare(data.contrasenia, element.contrasenia, (err, isMatch) => {
                        if (!isMatch) {
                            res.render('login/index', { error: 'Error: Contraseña incorecta' });
                        } else {
                            req.session.loggendin = true;
                            req.session.nombreUsuario = element.nombreUsuario

                            res.redirect('/tareas');
                        }
                    });
                });
            } else {
                res.render('login/index', { error: 'Error: Este usuario no existe? ¿No tienes cuenta -> Registrate?' });
            }
        });
    });
}

function register(req, res) {
    if (req.session.loggendin != true) {
        res.render('login/registro');
    } else {
        res.redirect('/tareas')
    }
}

function storeUser(req, res) {
    const data = req.body;

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM users WHERE email = ?', [data.email], (err, userdata) => {
            if (userdata.length > 0) {
                /*console.log('user already created');
                * ! para verificar si el usuario a sido creado o no desde la terminal*/
                res.render('login/registro', { error: 'Error: Este usuario ya existe?' });
            } else {
                bcrypt.hash(data.contrasenia, 12).then(hash => {
                    data.contrasenia = hash;

                    req.getConnection((err, conn) => {
                        conn.query('INSERT INTO users SET ?', [data], (err, rows) => {
                            res.redirect('/tareas');
                        });
                    });
                });
            }
        });
    });
}

module.exports = {
    login,
    register,
    storeUser,
    aut,
}