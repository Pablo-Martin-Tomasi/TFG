async function organizarQuedada(req, res) {
    const {
        dia,
        hora,
        direcion,
        descripcion,
        max_participantes
    } = req.body;

    const email = req.session.email;
    const { id } = req.params;

    try {
        if (!email) {
            return res.status(401).send("No autenticado");
        }

        const resultadoRuta = await req.db.query(
            'SELECT email FROM ruta WHERE id_ruta = $1',
            [id]
        );

        if (resultadoRuta.rows.length === 0) {
            return res.status(404).send("Ruta no encontrada");
        }

        await req.db.query(
            'INSERT INTO quedada (id_ruta, email_creador, dia, hora, direcion, descripcion, max_participantes) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [
                id,
                email,
                dia,
                hora,
                direcion,
                descripcion,
                max_participantes
            ]
        );

        res.redirect(`/detalleRuta/${id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al añadir una nueva ruta: ' + error.message);
    }
}

async function verQuedadas(req, res) {
    try {
        const result = await req.db.query(`
            SELECT q.*, r.nombre_ruta 
            FROM quedada q
            JOIN ruta r ON q.id_ruta = r.id_ruta
            WHERE q.dia >= NOW() 
            ORDER BY q.dia ASC;
        `);
        const quedadas = result.rows;

        res.render('vistas/quedada/verQuedadas', {
            title: 'Ver quedadas | Descubre tu al rededor',
            bodyClass: 'verRutas',//se va a usar la misma body class para el estilo para evitar repeticion
            mostrarNav: true,
            nombre: req.session.nombre,
            quedadas: quedadas
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las rutas: ' + error.message);
    }
}

async function detalleQuedada(req, res) {
    try {
        const id = parseInt(req.params.id);//sacar el id de la quedada

        if (isNaN(id)) {
            return res.send("ID no valido");
        }

        //obtener los datos de la quedada, la ruta vinculada y el nombre del creador
        const resultadoQuedada = await req.db.query(`
            SELECT q.*, r.nombre_ruta, u.nombre, ST_AsGeoJSON(geom) as geom_json
            FROM quedada q
            JOIN ruta r ON q.id_ruta = r.id_ruta
            JOIN usuario u ON q.email_creador = u.email
            WHERE q.id_quedada = $1
        `, [id]);

        //error por si el id de la quedada no esta
        if (resultadoQuedada.rows.length === 0) {
            return res.status(404).send("Quedada no encontrada");
        }

        const quedada = resultadoQuedada.rows[0];
        const emailUsuario = req.session.email || null;

        // Comprobar si el usuario ya está apuntado
        let esApuntado = false;
        if (emailUsuario) {
            const resultadoParticipante = await req.db.query(
                'SELECT 1 FROM participantes_quedada WHERE id_quedada = $1 AND email = $2',
                [id, emailUsuario]
            );
            esApuntado = resultadoParticipante.rows.length > 0;
        }

        res.render('vistas/quedada/detalleQuedada', {
            title: 'Quedada de ' + quedada.nombre_ruta + " | Descubre tu al rededor",
            bodyClass: 'detalleQuedada',
            mostrarNav: true,
            nombre: req.session.nombre,
            quedada: quedada,
            esApuntado: esApuntado,
            emailUsuario: emailUsuario
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las rutas: ' + error.message);
    }
}

async function quedadasOrganizadas(req, res) {
    const email = req.session.email;

    try {
        if (!email) {
            return res.status(401).send("No autenticado");
        }

        const result = await req.db.query(`
            SELECT q.*, r.nombre_ruta 
            FROM quedada q
            JOIN ruta r ON q.id_ruta = r.id_ruta
            WHERE email_creador = $1`,
            [email]);
        const quedadas = result.rows;

        res.render('vistas/quedada/quedadasOrganizadas', {
            title: 'Quedadas organizadas | Descubre tu al rededor',
            bodyClass: 'verRutas',//se va a usar la misma body class para el estilo para evitar repeticion
            mostrarNav: true,
            nombre: req.session.nombre,
            quedadas: quedadas
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al ver tus quedadas añadidas: ' + error.message);
    }
}

async function quedadasApuntado(req, res) {
    const email = req.session.email;

    try {
        if (!email) {
            return res.status(401).send("No autenticado");
        }

        const result = await req.db.query(
            `SELECT pq.*, q.*, r.* FROM participantes_quedada pq
       JOIN quedada q ON pq.id_quedada = q.id_quedada
       JOIN ruta r ON q.id_ruta = r.id_ruta
       WHERE pq.email = $1`,
            [email]
        );

        const quedadasPar = result.rows;
        res.render('vistas/quedada/quedadasParticipado', {
            title: 'Quedadas en las que has participado | Descubre tu al rededor',
            bodyClass: 'verRutas',
            mostrarNav: true,
            nombre: req.session.nombre,
            quedadasPar: quedadasPar
        });

    } catch (error) {
        console.error("ERROR:", error);
        res.status(500).send('Error: ' + error.message);
    }
}

module.exports = {
    organizarQuedada,
    verQuedadas,
    detalleQuedada,
    quedadasOrganizadas,
    quedadasApuntado
}