async function verFormularioReporte(req, res) {
    const email = req.session.email;
    const { id } = req.params;

    try {
        if (!email) {
            return res.status(401).send("Sesión no válida");
        }

        const result = await req.db.query(
            `SELECT * FROM ruta WHERE id_ruta = $1`,
            [id]
        );

        res.render('vistas/reporte/hacerReporte', {
            title: "Reportar ruta | Descubre tu alrededor",
            bodyClass: 'anadirRuta',
            mostrarNav: true,
            nombre: req.session.nombre,
            ruta: result.rows[0]
        })
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al abrir el formulario de editar la ruta: ' + error.message);
    }
}

async function hacerReporte(req, res) {
    const { texto_reporte } = req.body;

    const email = req.session.email;
    const { id } = req.params;

    try {
        if (!email) {
            return res.status(401).send("Sesión no válida");
        }

        const result = await req.db.query(`
            INSERT INTO reporte (email, id_ruta, texto_reporte) VALUES ($1, $2, $3)`,
            [
                email,
                id,
                texto_reporte
            ]);

        res.redirect(`/detalleRuta/${id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al añadir el reporte de la ruta: ' + error.message);
    }
}

async function verRutasReportadas(req, res) {
    const email = req.session.email;

    try {
        if (!email) {
            return res.status(401).send("Sesión no válida");
        }

        const result = await req.db.query(`
            SELECT ru.id_ruta, ru.nombre_ruta, ru.dificultad_ruta, ru.km, ru.descripcion, ru.direccion, ST_AsGeoJSON(geom) as geom_json,
            COUNT(re.id_reporte) as total_reportes
            FROM reporte re 
            JOIN ruta ru ON re.id_ruta = ru.id_ruta
            GROUP BY ru.id_ruta, ru.nombre_ruta, ru.dificultad_ruta, ru.km, ru.descripcion, ru.direccion, ru.geom
            `);
        const routesReporte = result.rows;

        routesReporte.forEach(route => {
            if (route.descripcion) {
                route.descripcion_corta = route.descripcion.length > 50
                    ? route.descripcion.substring(0, 50) + '...'
                    : route.descripcion;
            } else {
                route.descripcion_corta = 'Sin descripción';
            }
        });

        res.render('vistas/reporte/verRutasConReportes', {
            title: 'Rutas con reportes | Descubre tu alrededor',
            bodyClass: 'verRutas',
            mostrarNav: true,
            nombre: req.session.nombre,
            routesReporte: routesReporte
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al ver las rutas reportadas: ' + error.message);
    }

}

async function verReportesRuta(req, res) {
    const email = req.session.email;
    const { id } = req.params;

    try {
        if (!email) {
            return res.status(401).send("Sesión no válida");
        }

        const resultRuta = await req.db.query(
            `SELECT id_ruta, nombre_ruta FROM ruta WHERE id_ruta = $1`,
            [id]
        );

        if (resultRuta.rows.length === 0) {
            return res.status(404).send("Ruta no encontrada");
        }

        const ruta = resultRuta.rows[0];

        const resultReportes = await req.db.query(`
            SELECT u.nombre, u.foto_perfil, re.texto_reporte, re.fecha 
            FROM reporte re
            JOIN usuario u ON re.email = u.email
            WHERE re.id_ruta = $1
            ORDER BY re.fecha DESC
            `,
            [id]);

        const reportes = resultReportes.rows;

        res.render('vistas/reporte/detalleReporte', {
            title: "Reportes de la ruta " + ruta.nombre_ruta + " | Descubre tu alrededor",
            bodyClass: 'verRutas',
            mostrarNav: true,
            nombre: req.session.nombre,
            ruta: ruta,
            reportes: reportes
        })
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al ver los reportes de la ruta: ' + error.message);
    }
}

module.exports = {
    verFormularioReporte,
    hacerReporte,
    verRutasReportadas,
    verReportesRuta
}
