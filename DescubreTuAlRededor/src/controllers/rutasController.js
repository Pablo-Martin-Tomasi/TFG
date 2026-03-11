//funcion para 
function nuevaRuta(req, res) {
    //formulario añadir nueva ruta 
    res.render('vistas/rutas/anadirRuta', {
        title: 'Añadir nueva ruta',
        bodyClass: 'anadirRuta',
        mostrarNav: true,
        nombre: req.session.nombre
    });
}

async function anadirRuta(req, res) {
    const { nombre_ruta, dificultad_ruta, km, direccion, mapa_ruta, descripcion, desnivel_pos, desnivel_neg, altura_max, altura_min, email } = req.body;

    try {
        //verificar si ya existe una ruta con el mismo nombre
        const existe = await req.db.query(
            'SELECT * FROM ruta WHERE nombre_ruta = $1',
            [nombre_ruta]
        );

        if (existe.rows.length > 0) {
            res.render('vistas/rutas/anadirRuta', {
                title: 'Añadir nueva ruta',
                bodyClass: 'anadirRuta',
                mostrarNav: true,
                nombre: req.session.nombre,
                error: 'Ya existe una ruta con ese nombre, elige otro nombre para la ruta'
            });
        }

        //Insertar la nueva ruta
        await req.db.query(
            'INSERT INTO ruta (nombre_ruta, dificultad_ruta, km, direccion, mapa_ruta, descripcion, desnivel_pos, desnivel_neg, altura_max, altura_min, email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
            [nombre_ruta, dificultad_ruta, km, direccion, mapa_ruta, descripcion, desnivel_pos, desnivel_neg, altura_max, altura_min, email]
        );
    } catch (error) {
        console.error(error);
        res.send('Error al añadir una nueva ruta');
    }
}