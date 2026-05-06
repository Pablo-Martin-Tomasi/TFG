async function verFormularioAnadirImagen(req, res) {
    try {
        const id = parseInt(req.params.id);
        const resultado = await req.db.query(
            'SELECT * FROM ruta WHERE id_ruta = $1',
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.send("Ruta no encontrada");
        }

        const ruta = resultado.rows[0];

        // Verificar que el usuario en sesión es el que creó la ruta
        if (ruta.email !== req.session.email) {
            return res.status(403).render('vistas/rutas/detalleRuta', {
                title: ruta.nombre_ruta + " | Descubre tu al rededor",
                bodyClass: 'verRutas',
                mostrarNav: true,
                nombre: req.session.nombre,
                ruta: ruta,
                error: 'Solo el creador de la ruta puede añadir imágenes'
            });
        }

        res.render('vistas/rutas/anadirImagenRuta', {
            title: 'Añadir imágenes a la ruta | Descubre tu al rededor',
            ruta: ruta,
            nombre: req.session.nombre,
            mostrarNav: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar la página: " + error.message);
    }
}

async function anadirImagenRuta(req, res) {
    const { id } = req.params;
    try {
        const resultadoRuta = await req.db.query(
            'SELECT email FROM ruta WHERE id_ruta = $1',
            [id]
        );

        if (resultadoRuta.rows.length === 0) {
            return res.status(404).send("Ruta no encontrada");
        }

        if (resultadoRuta.rows[0].email !== req.session.email) {
            return res.status(403).send("No tienes permiso para realizar esta acción");
        }

        if (!req.files || req.files.length === 0) {
            //Se necesita verificar que la ruta existe para poder añadir las imagenes a la ruta
            const resultado = await req.db.query('SELECT * FROM ruta WHERE id_ruta = $1', [id]);
            const ruta = resultado.rows[0];

            return res.render('vistas/rutas/anadirImagenRuta', {
                title: 'Añadir imágenes a la ruta | Descubre tu al rededor',
                ruta: ruta,
                nombre: req.session.nombre,
                mostrarNav: true,
                error: 'No se ha subido ninguna imagen'//mensaje de error, para decir al usuario de que no se ha subido ninguna imagen
            });
        }

        for (const file of req.files) {
            const fotoRuta = '/fotosRuta/' + file.filename;//ruta donde se va a guardar la imagen

            await req.db.query(
                'INSERT INTO imagenes_ruta(id_ruta, imagen_ruta) VALUES ($1, $2)',
                [id, fotoRuta]
            );//insertar la imagen en la base de datos
        }

        res.redirect(`/detalleRuta/${id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al añadir imágenes: ' + error.message);
    }
}


module.exports = {
    anadirImagenRuta,
    verFormularioAnadirImagen
}