async function verFormularioEditarAdmin(req, res) {
    const email = req.session.email;
    const { id } = req.params;

    try {
        const result = await req.db.query(
            `SELECT * FROM ruta WHERE id_ruta = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(403).send("No tienes acceso a esta ruta");
        }

        res.render('vistas/rutas/editarRutaAdmin', {
            title: 'Editar ruta | Descubre tu alrededor',
            bodyClass: 'anadirRuta',
            mostrarNav: true,
            nombre: req.session.nombre,
            ruta: result.rows[0],
            id_ruta: result.rows[0].id_ruta
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al abrir el formulario de editar la ruta: ' + error.message);
    }
}

async function editarRutaAdmin(req, res) {
    const {
        nombre_ruta,
        dificultad_ruta,
        descripcion,
        duracion_estimacion,
        tipo_ruta
    } = req.body;

    const email = req.session.email;
    const { id } = req.params;

    try {
        if (!email) {
            return res.status(401).send("Sesión no válida");
        }

        const result = await req.db.query(`
            UPDATE ruta
            SET 
                nombre_ruta = $1,
                dificultad_ruta = $2,
                descripcion = $3,
                duracion_estimacion = $4,
                tipo_ruta = $5
            WHERE id_ruta = $6
        `, [
            nombre_ruta,
            dificultad_ruta,
            descripcion,
            duracion_estimacion,
            tipo_ruta,
            id
        ]);

        res.redirect(`/detalleRuta/${id}`);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al modificar la ruta: ' + error.message);
    }
}

module.exports = {
    verFormularioEditarAdmin,
    editarRutaAdmin
}