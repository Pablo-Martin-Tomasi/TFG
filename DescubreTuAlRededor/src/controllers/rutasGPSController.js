async function verGPS(req, res) {
    const email = req.session.email;

    try {
        if (!email) {
            return res.status(401).send("Sesión no válida");
        }

        const result = await req.db.query(
            `SELECT id_ruta, nombre_ruta, ST_AsGeoJSON(geom) AS geom_json
            FROM ruta`
        );
        const routes = result.rows;

        res.render('vistas/gps/vistaGPS', {
            title: 'Ver rutas | Descubre tu alrededor',
            bodyClass: 'verRutas',
            mostrarNav: true,
            nombre: req.session.nombre,
            routes: routes
        })
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al ver la vista GPS: ' + error.message);
    }
}

module.exports = {
    verGPS
}