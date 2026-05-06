async function rutaHecha(req, res) {
    const email = req.session.email;
    const { id } = req.params;

    try {
        if (!email) {
            return res.status(401).send("Usuario no autenticado");
        }

        const resultadoRuta = await req.db.query(
            'SELECT * FROM ruta WHERE id_ruta = $1',
            [id]
        );

        if (resultadoRuta.rows.length === 0) {
            return res.status(404).send("Ruta no encontrada");
        }

        await req.db.query(
            'INSERT INTO historial_rutas (email, id_ruta) VALUES ($1, $2)',
            [email, id]
        );

        res.redirect(`/detalleRuta/${id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al añadir la ruta como hehca: ' + error.message);
    }

}

async function historialDeRutas(req, res) {
    const email = req.session.email;

    try {
        if (!email) {
            return res.status(401).send("Usuario no autenticado");
        }

        const historial = await req.db.query(`
            SELECT r.id_ruta, r.nombre_ruta, r.dificultad_ruta, r.km, r.descripcion, ST_AsGeoJSON(geom) as geom_json FROM historial_rutas hr
            JOIN ruta r
            ON hr.id_ruta = r.id_ruta
            WHERE hr.email = $1`,
            [email]
        );

        const historialRutas = historial.rows;

        let rutasFavIds = [];
        if (email) {
            const resultFav = await req.db.query('SELECT id_ruta FROM rutas_por_hacer WHERE email = $1', [email]);
            rutasFavIds = resultFav.rows.map(row => row.id_ruta);
        }

        historialRutas.forEach(route => {
            route.es_favorita = rutasFavIds.includes(route.id_ruta);
            // Generar descripción corta
            if (route.descripcion) {
                route.descripcion_corta = route.descripcion.length > 50 
                    ? route.descripcion.substring(0, 50) + '...' 
                    : route.descripcion;
            } else {
                route.descripcion_corta = 'Sin descripción';
            }
        });

        //renderizar la vista para que se pueda 
        res.render('vistas/rutas/historialRutas', {
            title: 'Historial rutas | Descubre tu al rededor',
            bodyClass: 'verRutasHechas',
            mostrarNav: true,
            nombre: req.session.nombre,
            historialRutas: historialRutas
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al ver tu historial de rutas: ' + error.message);
    }
}

module.exports = {
    rutaHecha,
    historialDeRutas
}