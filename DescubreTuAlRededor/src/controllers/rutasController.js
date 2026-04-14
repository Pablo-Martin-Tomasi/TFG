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
        altura_min
    } = req.body;

    const email = req.session.email;

    try {
        const existe = await req.db.query(
            'SELECT 1 FROM ruta WHERE nombre_ruta = $1',
            [nombre_ruta]
        );

        if (existe.rows.length > 0) {
            return res.render('vistas/rutas/anadirRuta', {
                title: 'Añadir nueva ruta',
                bodyClass: 'anadirRuta',
                mostrarNav: true,
                nombre: req.session.nombre,
                error: 'Ya existe una ruta con ese nombre'
            });
        }

        if (altura_min > altura_max) {
            return res.render('vistas/rutas/anadirRuta', {
                title: 'Añadir nueva ruta',
                bodyClass: 'anadirRuta',
                mostrarNav: true,
                nombre: req.session.nombre,
                error: 'La altura minima no puede superior a la altura maxima'
            });
        }

        if (desnivel_neg < 0 || desnivel_neg < 0) {
            return res.render('vistas/rutas/anadirRuta', {
                title: 'Añadir nueva ruta',
                bodyClass: 'anadirRuta',
                mostrarNav: true,
                nombre: req.session.nombre,
                error: 'Los desniveles no pueden ser negativos'
            });
        }

        // 🔥 GEOMETRÍA FIJA (para pruebas)
        const lineaDummy = 'LINESTRING(-3.7038 40.4168, -3.7040 40.4170)';

        //mapa de la ruta
        const mapaRuta = '/mapasRutas/' + req.file.filename;

        await req.db.query(
            `INSERT INTO ruta 
            (nombre_ruta, dificultad_ruta, km, direccion, mapa_ruta, descripcion, desnivel_pos, desnivel_neg, altura_max, altura_min, geom, email) 
            VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, ST_GeomFromText($11, 4326), $12)`,
            [
                nombre_ruta,
                dificultad_ruta,
                km,
                direccion,
                mapaRuta,
                descripcion,
                desnivel_pos,
                desnivel_neg,
                altura_max,
                altura_min,
                lineaDummy,
                email
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
        const result = await req.db.query('SELECT * FROM ruta');
        const routes = result.rows;

        res.render('vistas/rutas/verRutas', {
            title: 'Ver rutas',
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

async function modificarRuta(req, res) {

}

async function detalleRuta(req, res) {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.send("ID inválido");
        }

        // Obtener datos de la ruta
        const resultadoRuta = await req.db.query(
            'SELECT * FROM ruta WHERE id_ruta = $1',
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

        res.render('vistas/rutas/detalleRuta', {
            title: ruta.nombre_ruta,
            bodyClass: 'verRutas',
            mostrarNav: true,
            nombre: req.session.nombre,
            ruta: ruta,
            imagenes: imagenes
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
            'select * from ruta where email = $1',
            [email]
        );

        const rutasUsuario = resultado.rows;

        res.render('vistas/rutas/misRutas', {
            title: 'Mis rutas',
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
            title: ruta.nombre_ruta,
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
    modificarRuta,
    detalleRuta,
    misRutas,
    miRuta
};