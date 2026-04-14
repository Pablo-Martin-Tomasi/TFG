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

        res.render('vistas/rutas/anadirImagenRuta', {
            title: 'Añadir imágenes a la ruta',
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
        if (!req.files || req.files.length === 0) {
            return res.send("No se ha subido ninguna imagen");
        }

        for (const file of req.files) {
            const fotoRuta = '/mapasRutas/' + file.filename;

            await req.db.query(
                'INSERT INTO imagenes_ruta(id_ruta, imagen_ruta) VALUES ($1, $2)',
                [id, fotoRuta]
            );
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