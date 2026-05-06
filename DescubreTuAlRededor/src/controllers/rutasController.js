const fs = require('fs');
const path = require('path');

async function anadirRuta(req, res) {
    const {
        nombre_ruta,
        dificultad_ruta,
        km,
        direccion,
        descripcion,
        desnivel_pos,
        desnivel_neg,
        altura_max,
        altura_min,
        duracion_estimacion,
        tipo_ruta,
        coordenadas
    } = req.body;

    const email = req.session.email;

    try {
        //las coordenadas
        const coords = JSON.parse(coordenadas);

        if (!coords || coords.length < 2) {
            return res.send("Ruta inválida");
        }

        //hacer el linestring
        const lineString = coords
            .map(p => `${p[1]} ${p[0]}`)
            .join(',');

        const geom = `LINESTRING(${lineString})`;

        const existe = await req.db.query(
            'SELECT 1 FROM ruta WHERE nombre_ruta = $1',
            [nombre_ruta]
        );

        if (existe.rows.length > 0) {
            return res.render('vistas/rutas/anadirRuta', {
                title: 'Descubre tu al rededor | Añadir nueva ruta',
                bodyClass: 'anadirRuta',
                mostrarNav: true,
                nombre: req.session.nombre,
                error: 'Ya existe una ruta con ese nombre'
            });
        }

        if (altura_min > altura_max) {
            return res.render('vistas/rutas/anadirRuta', {
                title: 'Añadir nueva ruta | Descubre tu al rededor',
                bodyClass: 'anadirRuta',
                mostrarNav: true,
                nombre: req.session.nombre,
                error: 'La altura minima no puede superior a la altura maxima'
            });
        }

        if (desnivel_pos < 0 || desnivel_neg < 0) {
            return res.render('vistas/rutas/anadirRuta', {
                title: 'Añadir nueva ruta | Descubre tu al rededor',
                bodyClass: 'anadirRuta',
                mostrarNav: true,
                nombre: req.session.nombre,
                error: 'Los desniveles no pueden ser negativos'
            });
        }

        await req.db.query(
            `INSERT INTO ruta 
            (nombre_ruta, dificultad_ruta, km, direccion, descripcion, desnivel_pos, desnivel_neg, altura_max, altura_min, geom, email, duracion_estimacion, tipo_ruta) 
            VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, ST_GeomFromText($10, 4326), $11, $12, $13)`,
            [
                nombre_ruta,
                dificultad_ruta,
                km,
                direccion,
                descripcion,
                desnivel_pos,
                desnivel_neg,
                altura_max,
                altura_min,
                geom,
                email,
                duracion_estimacion,
                tipo_ruta
            ]
        );

        res.redirect('/verRutas');

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al añadir una nueva ruta: ' + error.message);
    }
}

async function verRutas(req, res) {
    try {
        const result = await req.db.query('SELECT id_ruta, nombre_ruta, dificultad_ruta, km, descripcion, ST_AsGeoJSON(geom) as geom_json FROM ruta');
        const routes = result.rows;

        const email = req.session.email;
        let rutasFavIds = [];
        if (email) {
            const resultFav = await req.db.query('SELECT id_ruta FROM rutas_por_hacer WHERE email = $1', [email]);
            rutasFavIds = resultFav.rows.map(row => row.id_ruta);
        }

        routes.forEach(route => {
            route.es_favorita = rutasFavIds.includes(route.id_ruta);
            // Generar descripción corta si no existe
            if (route.descripcion) {
                route.descripcion_corta = route.descripcion.length > 50
                    ? route.descripcion.substring(0, 50) + '...'
                    : route.descripcion;
            } else {
                route.descripcion_corta = 'Sin descripción';
            }
        });

        res.render('vistas/rutas/verRutas', {
            title: 'Ver rutas | Descubre tualrededor',
            bodyClass: 'verRutas',
            mostrarNav: true,
            nombre: req.session.nombre,
            routes: routes
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las rutas: ' + error.message);
    }
}

async function verRutasIndex(req, res) {
    try {
        const result = await req.db.query('SELECT id_ruta, nombre_ruta, dificultad_ruta, km, descripcion, ST_AsGeoJSON(geom) as geom_json FROM ruta ORDER BY RANDOM() LIMIT 12;');
        const routes = result.rows;

        const email = req.session.email;
        let rutasFavIds = [];
        if (email) {
            const resultFav = await req.db.query('SELECT id_ruta FROM rutas_por_hacer WHERE email = $1', [email]);
            rutasFavIds = resultFav.rows.map(row => row.id_ruta);
        }

        routes.forEach(route => {
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

        res.render('index', {
            title: 'Descubre tu al rededor',
            bodyClass: 'verRutas',
            mostrarNav: true,
            nombre: req.session.nombre,
            routes: routes
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las rutas: ' + error.message);
    }
}

async function verFormularioEditar(req, res) {
    const email = req.session.email;
    const { id } = req.params;

    try {
        const result = await req.db.query(
            `SELECT * FROM ruta WHERE id_ruta = $1 AND email = $2`,
            [id, email]
        );

        if (result.rows.length === 0) {
            return res.status(403).send("No tienes acceso a esta ruta");
        }

        res.render('vistas/rutas/editarRuta', {
            title: 'Editar ruta | Descubre tu al rededor',
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

async function modificarRuta(req, res) {
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
            WHERE id_ruta = $6 AND email = $7
        `, [
            nombre_ruta,
            dificultad_ruta,
            descripcion,
            duracion_estimacion,
            tipo_ruta,
            id,
            email
        ]);

        // 🔥 clave: comprobar si realmente se ha actualizado algo
        if (result.rowCount === 0) {
            return res.status(403).send("No tienes permisos para modificar esta ruta");
        }

        res.redirect(`/detalleRuta/${id}`);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al modificar la ruta: ' + error.message);
    }
}

async function detalleRuta(req, res) {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.send("ID inválido");
        }

        // Obtener datos de la ruta
        const resultadoRuta = await req.db.query(`
            SELECT r.*, u.nombre, ST_AsGeoJSON(geom) as geom_json
            FROM ruta r
            JOIN usuario u
            ON u.email = r.email
            WHERE r.id_ruta = $1`,
            [id]
        );

        if (resultadoRuta.rows.length === 0) {
            return res.status(404).send("Ruta no encontrada");
        }

        const ruta = resultadoRuta.rows[0];

        // Obtener imágenes adicionales de la ruta
        const resultadoImagenes = await req.db.query(
            'SELECT * FROM imagenes_ruta WHERE id_ruta = $1',
            [id]
        );

        const imagenes = resultadoImagenes.rows;

        //enseñar al usuario los comentarios de la ruta
        const comentariosRuta = await req.db.query(
            `SELECT c.*, u.nombre
            FROM comentario_ruta c
            JOIN historial_rutas h ON c.id_historial = h.id_historial
            JOIN usuario u ON h.email = u.email
            WHERE h.id_ruta = $1`,
            [id]
        );

        const comentarios = comentariosRuta.rows;

        // Verificar si el usuario actual es el creador de la ruta
        const esCreador = req.session.email === ruta.email;

        let es_favorita = false;
        let es_hecha = false;

        const email = req.session.email;
        if (email) {
            // Verificar si es favorita
            const resultFav = await req.db.query(
                'SELECT 1 FROM rutas_por_hacer WHERE email = $1 AND id_ruta = $2',
                [email, id]
            );
            es_favorita = resultFav.rows.length > 0;

            // Verificar si ya está hecha
            const resultHecha = await req.db.query(
                'SELECT 1 FROM historial_rutas WHERE email = $1 AND id_ruta = $2',
                [email, id]
            );
            es_hecha = resultHecha.rows.length > 0;
        }

        res.render('vistas/rutas/detalleRuta', {
            title: ruta.nombre_ruta + " | Descubre tu al rededor",
            bodyClass: 'verRutas',
            mostrarNav: true,
            nombre: req.session.nombre,
            ruta: ruta,
            id_ruta: ruta.id_ruta,
            imagenes: imagenes,
            esCreador: esCreador,
            es_favorita: es_favorita,
            es_hecha: es_hecha,
            comentarios: comentarios
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las rutas: ' + error.message);
    }
}

async function misRutas(req, res) {
    try {
        const email = req.session.email;

        const resultado = await req.db.query(
            'SELECT id_ruta, nombre_ruta, dificultad_ruta, km, descripcion, ST_AsGeoJSON(geom) as geom_json from ruta where email = $1',
            [email]
        );

        const rutasUsuario = resultado.rows;

        // Obtener ids de rutas favoritas del usuario
        let rutasFavIds = [];
        if (email) {
            const resultFav = await req.db.query('SELECT id_ruta FROM rutas_por_hacer WHERE email = $1', [email]);
            rutasFavIds = resultFav.rows.map(row => row.id_ruta);
        }

        rutasUsuario.forEach(route => {
            // Verificar si es favorita
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

        res.render('vistas/rutas/misRutas', {
            title: 'Mis rutas | Descubre tu al rededor',
            bodyClass: 'misRutas',
            mostrarNav: true,
            nombre: req.session.nombre,
            rutasUsuario: rutasUsuario
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las rutas: ' + error.message);
    }
}

async function miRuta(req, res) {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.send("ID inválido");
        }

        const resultado = await req.db.query(
            'SELECT * FROM ruta WHERE id_ruta = $1',
            [id]
        );

        const ruta = resultado.rows[0];

        res.render('vistas/rutas/miRuta', {
            title: ruta.nombre_ruta + " | Descubre tu al rededor",
            bodyClass: 'verRutas',
            mostrarNav: true,
            nombre: req.session.nombre,
            ruta: ruta
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las rutas: ' + error.message);
    }
}

module.exports = {
    anadirRuta,
    verRutas,
    verRutasIndex,
    verFormularioEditar,
    modificarRuta,
    detalleRuta,
    misRutas,
    miRuta
};