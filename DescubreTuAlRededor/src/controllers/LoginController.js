const bcrypt = require('bcrypt');

function login(req, res) {
    if (req.session.loggendin === true) {
        return res.redirect('/');
    }

    res.render('vistas/usuario/inicioSesion', {
        title: 'Inicio sesión',
        bodyClass: 'loginRegistro',
        mostrarNav: false
    });
}

async function aut(req, res) {
    const { email, contrasena } = req.body;

    try {
        // Buscar usuario por email
        const result = await req.db.query(
            'SELECT * FROM Usuario WHERE Email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.render('vistas/usuario/inicioSesion', {
                title: 'Inicio sesión',
                bodyClass: 'loginRegistro',
                mostrarNav: false,
                error: 'No existe un usuario con ese email'
            });
        }

        const usuario = result.rows[0];


        // Comparar contraseña
        const passwordCorrecta = await bcrypt.compare(
            contrasena,
            usuario.contrasena
        );

        if (!passwordCorrecta) {
            return res.render('vistas/usuario/inicioSesion', {
                title: 'Inicio sesión',
                bodyClass: 'loginRegistro',
                mostrarNav: false,
                error: 'Contraseña incorrecta'
            });
        }

        // Crear sesión
        req.session.loggendin = true;
        req.session.email = usuario.email;
        req.session.contrasena = usuario.contrasena;
        req.session.nombre = usuario.nombre;
        req.session.rol = usuario.rol;
        req.session.descripcion = usuario.descripcion;
        req.session.foto_perfil = usuario.foto_perfil;

        res.redirect('/');

    } catch (error) {
        console.error(error);
        res.send('Error en el login');
    }
}

function register(req, res) {
    if (req.session.loggendin === true) {
        return res.redirect('/');
    }

    res.render('vistas/usuario/registro', {
        title: 'Registro',
        bodyClass: 'loginRegistro',
        mostrarNav: false
    });
}

async function storeUser(req, res) {
    const { email, nombre, contrasena } = req.body;

    try {
        // Verificar si ya existe
        const existe = await req.db.query(
            'SELECT * FROM usuario WHERE email = $1',
            [email]
        );

        if (existe.rows.length > 0) {
            return res.render('vistas/usuario/registro', {
                title: 'Registro',
                bodyClass: 'loginRegistro',
                mostrarNav: false,
                error: 'Ya existe un usuario con ese email'
            });
        }

        // Encriptar contraseña
        const hash = await bcrypt.hash(contrasena, 12);

        // Insertar usuario
        await req.db.query(
            'INSERT INTO usuario (email, nombre, contrasena, rol, descripcion, foto_perfil) VALUES ($1, $2, $3, $4, $5, $6)',
            [email, nombre, hash, 'Usuario', 'Hola soy un/a nuev@ usuario', 'Foto de perfil']
        );

        // Opcional: iniciar sesión automáticamente tras registrarse
        req.session.loggendin = true;
        req.session.email = email;
        req.session.nombre = nombre;
        req.session.rol = 'Usuario';

        res.redirect('/');

    } catch (error) {
        console.error(error);
        res.send('Error en el registro');
    }
}

//funcion para el logout
function logout(req, res) {
    if (req.session.loggendin == true) {
        req.session.destroy();
    }
    res.redirect('/');
}

module.exports = {
    login,
    aut,
    register,
    storeUser,
    logout,
};