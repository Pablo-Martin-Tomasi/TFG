async function apuntarse(req, res) {
    const email = req.session.email;
    const { id } = req.params;

    try {
        if (!email) {
            return res.status(401).send("No autenticado");
        }

        const resultadoApunteQuedada = await req.db.query(
            'SELECT email_creador FROM quedada WHERE id_quedada = $1',
            [id]
        );

        if (resultadoApunteQuedada.rows.length === 0) {
            return res.status(404).send("Quedada no encontrada");
        }

        await req.db.query(
            'INSERT INTO participantes_quedada (id_quedada, email) VALUES ($1, $2)',
            [id, email]
        );

        res.redirect(`/detalleQuedada/${id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al apuntarse a la quedada: ' + error.message);
    }
}

async function desapuntarse(req, res) {
    const email = req.session.email;
    const { id } = req.params;

    try {
        if (!email) {
            return res.status(401).send("No autenticado");
        }

        await req.db.query(
            'DELETE FROM participantes_quedada WHERE id_quedada = $1 AND email = $2',
            [id, email]
        );

        res.redirect(`/detalleQuedada/${id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al desapuntarse de la quedada: ' + error.message);
    }
}

module.exports = {
    apuntarse,
    desapuntarse
}