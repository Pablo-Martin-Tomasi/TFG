async function agregarRutaFav(req, res) {
    const email = req.session.email;
    const { id } = req.params;

    try {
        if (!email) {
            return res.status(401).send("No autenticado");
        }

        const resultadoRuta = await req.db.query(
            'SELECT * FROM ruta WHERE id_ruta = $1',
            [id]
        );

        if (resultadoRuta.rows.length === 0) {
            return res.status(404).send("Ruta no encontrada");
        }

        await req.db.query(
            'INSERT INTO rutas_por_hacer (email, id_ruta) VALUES ($1, $2)',
            [email, id]
        );

        res.redirect(req.get('Referer'));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al añadir la ruta a fav: ' + error.message);
    }
}

async function rutasFav(req, res) {
    const email = req.session.email;

    try {
        if (!email) {
            return res.status(401).send("No autenticado");
        }

        const result = await req.db.query(
            `SELECT r.id_ruta, r.nombre_ruta, r.dificultad_ruta, r.km, r.descripcion, ST_AsGeoJSON(geom) as geom_json
             FROM rutas_por_hacer rph
             JOIN ruta r ON rph.id_ruta = r.id_ruta
             WHERE rph.email = $1`,
            [email]
        );

        const rutasFavUsuario = result.rows;

        rutasFavUsuario.forEach(route => {
            route.es_favorita = true;
            // Generar descripción corta si no existe
            if (route.descripcion) {
                route.descripcion_corta = route.descripcion.length > 50
                    ? route.descripcion.substring(0, 50) + '...'
                    : route.descripcion;
            } else {
                route.descripcion_corta = 'Sin descripción';
            }
        });

        res.render('vistas/rutas/rutasFav', {
            title: 'Rutas favoritas | Descubre tu al rededor',
            bodyClass: 'verRutasPorHacer',
            mostrarNav: true,
            nombre: req.session.nombre,
            rutasFavUsuario: rutasFavUsuario
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las rutas favoritas: ' + error.message);
    }
}

async function quitarRutaFav(req, res) {
    const email = req.session.email;
    const { id } = req.params;

    try {
        if (!email) {
            return res.status(401).send("No autenticado");
        }

        const resultadoRuta = await req.db.query(
            'SELECT * FROM ruta WHERE id_ruta = $1',
            [id]
        );

        if (resultadoRuta.rows.length === 0) {
            return res.status(404).send("Ruta no encontrada");
        }

        await req.db.query(
            'DELETE FROM rutas_por_hacer WHERE email = $1 AND id_ruta = $2',
            [email, id]
        );

        res.redirect(req.get('Referer'));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al quitar la ruta de fav: ' + error.message);
    }
}

module.exports = {
    agregarRutaFav,
    rutasFav,
    quitarRutaFav
}