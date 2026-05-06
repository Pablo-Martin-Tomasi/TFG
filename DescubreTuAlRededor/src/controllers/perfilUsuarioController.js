const bcrypt = require('bcrypt');

const fs = require('fs');
const path = require('path');

const DEFAULT_AVATAR = '/uploads/AvatarDefault.jpg';

//funcion para modificar los datos del usuario (nombre y descripcion)
async function actualizar(req, res) {
    const { nombre, descripcion } = req.body;
    const email = req.session.email;

    try {
        // Verificar si ya existe
        const existe = await req.db.query(
            'SELECT * FROM usuario WHERE email = $1',
            [email]
        );

        if (existe.rows.length === 0) {
            return res.send('Usuario no encontrado');
        }

        //actulizar los datos del usuario
        await req.db.query(
            'UPDATE usuario SET nombre = $1, descripcion = $2 WHERE email = $3',
            [nombre, descripcion, email]
        );

        // actualizar sesión
        req.session.nombre = nombre;
        req.session.descripcion = descripcion;

        res.redirect('/perfilUsuario');
    } catch (error) {
        console.error(error);
        res.send('Error en la modificación del perfil');
    }
}

//funcion para poder modificar la contraseña
async function cambiarContrasenia(req, res) {

    const { contraseniaActual, contraseniaNueva, confirmarContrasenia } = req.body;
    const email = req.session.email;

    try {

        // comprobar que las nuevas contraseñas coinciden
        if (contraseniaNueva !== confirmarContrasenia) {
            return res.render('vistas/usuario/modificarContrasenia', {
                title: 'Modificar contraseña | Descubre tu al rededor',
                bodyClass: 'modificarContrasenia',
                mostrarNav: true,
                nombre: req.session.nombre,
                contrasena: req.session.contrasena,
                error: 'Las contraseñas no coinciden'
            });
        }

        // obtener contraseña actual del usuario
        const resultado = await req.db.query(
            'SELECT contrasena FROM usuario WHERE email = $1',
            [email]
        );

        if (resultado.rows.length === 0) {
            return res.send('Usuario no encontrado');
        }

        const hashActual = resultado.rows[0].contrasena;

        // comprobar contraseña actual
        const coincide = await bcrypt.compare(contraseniaActual, hashActual);

        if (!coincide) {
            return res.render('vistas/usuario/modificarContrasenia', {
                title: 'Modificar contraseña | Descubre tu al rededor',
                bodyClass: 'modificarContrasenia',
                mostrarNav: true,
                nombre: req.session.nombre,
                contrasena: req.session.contrasena,
                error: 'La contraseña actual es incorrecta'
            });
        }

        // generar hash de la nueva contraseña
        const hashNueva = await bcrypt.hash(contraseniaNueva, 12);

        // actualizar contraseña en la base de datos
        await req.db.query(
            'UPDATE usuario SET contrasena = $1 WHERE email = $2',
            [hashNueva, email]
        );

        res.redirect('/perfilUsuario');
    } catch (error) {

        console.error(error);
        res.send('Error al cambiar la contraseña');

    }
}

//cambiar la foto de perfil del usuario, ademas de eso
async function cambiarFotoPerfil(req, res) {
    const email = req.session.email;

    try {
        //obtener la foto de perfil actual
        const resultado = await req.db.query(
            'SELECT foto_perfil FROM usuario WHERE email = $1',
            [email]
        );

        if (resultado.rows.length === 0){
            return res.send('Usuario no encontrado');
        }

        const imagenAntigua = resultado.rows[0].foto_perfil;

        //subir nueva imagen con multer
        const imagenNueva = '/uploads/' + req.file.filename;

        //borra la imagen anterior almenos que sea la default
        if (imagenAntigua && imagenAntigua !== DEFAULT_AVATAR) {
            const fullPath = path.join(__dirname, '../../public', imagenAntigua);

            if (fs.existsSync(fullPath)) {
                fs.unlink(fullPath, (err) => {
                    if (err) console.error('Error al eliminar la imagen:', err);
                })
            }
        }

        //actualizar la imagen en la base de datos
        await req.db.query(
            'UPDATE usuario SET foto_perfil = $1 WHERE email = $2',
            [imagenNueva, email]
        )
        
        //actualizar la sesion
        req.session.foto_perfil = imagenNueva;

        res.redirect('/perfilUsuario');
    } catch (error) {
        console.error(error);
        res.send('Error al cambiar la foto de perfil');
    }
}

module.exports = {
    actualizar,
    cambiarContrasenia,
    cambiarFotoPerfil
};