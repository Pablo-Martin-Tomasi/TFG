async function anadirComentario(req, res) {
    const { comentario } = req.body;
    const email = req.session.email;
    const { id } = req.params;

    try {
        if (!email) {
            return res.status(401).send("Usuario no autenticado");
        }

        const rutaHecha = await req.db.query(
            'SELECT * FROM historial_rutas WHERE email = $1 AND id_ruta = $2',
            [email, id]
        );

        if (rutaHecha.rows.length === 0) {
            return res.status(404).send("No puedes comentar esta ruta si no la has hecho");
        }

        const id_historial = rutaHecha.rows[0].id_historial;

        let url_imagen = null;
        if (req.file) {
            url_imagen = '/fotosComentarios/' + req.file.filename;
        }

        await req.db.query(
            "INSERT INTO comentario_ruta (id_historial, comentario, url_imagen) VALUES ($1, $2, $3)",
            [
                id_historial,
                comentario,
                url_imagen
            ]
        );

        const id_ruta = rutaHecha.rows[0].id_ruta;
        res.redirect(`/detalleRuta/${id_ruta}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al añadir el comentario: ' + error.message);
    }
}




module.exports = {
    anadirComentario
}