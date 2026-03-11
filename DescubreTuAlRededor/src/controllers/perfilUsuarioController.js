const bcrypt = require('bcrypt');

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

module.exports = {
    actualizar
};