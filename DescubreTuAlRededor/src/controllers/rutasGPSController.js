async function verGPS(req, res) {
    try {
        const result = await req.db.query(
            `SELECT id_ruta, nombre_ruta, ST_AsGeoJSON(geom) AS geom_json
            FROM ruta`
        );
        const routes = result.rows;

        res.render('vistas/gps/vistaGPS', {
            title: 'Ver rutas | Descubre tualrededor',
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
