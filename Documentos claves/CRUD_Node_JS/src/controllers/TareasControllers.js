function index(req, res) {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM tareas', (err, tareas) => {
            if(err){
                res.json(err);
            }
            res.render('tareas/index', {tareas})
        })
    });
}

function create(req, res){
    
    res.render('tareas/create');
}

function store(req, res) {
    const { nombre_tarea, estado, descripcion_tarea, fecha } = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            console.error(err);
            res.json(err);
            return;
        }

        conn.query(
            'INSERT INTO tareas (nombre_tarea, estado, descripcion_tarea, fecha) VALUES (?, ?, ?, ?)',
            [nombre_tarea, estado, descripcion_tarea, fecha],
            (err, rows) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Tarea insertada correctamente');
                }
            }
        );
    });

    res.redirect('/tareas');
}

function destroy(req, res){
    const id_tarea = req.body.id_tarea;

    req.getConnection((err, conn) => {
        conn.query('DELETE FROM tareas WHERE id_tarea = ?',
            [id_tarea], (err, rows) => {
                res.redirect('/tareas');
            }
        )
    })
}

function edit(req, res) {
  console.log('ID:', req.params.id_tarea);

  req.getConnection((err, conn) => {
    conn.query(
      'SELECT * FROM tareas WHERE id_tarea = ?',
      [req.params.id_tarea],
      (err, tareas) => {
        console.log('Tareas:', tareas);
        res.render('tareas/edit', { tareas });
      }
    );
  });
}

function update(req, res) {
  const id_tarea = req.params.id_tarea;
  const { nombre_tarea, estado, descripcion_tarea, fecha } = req.body;

  req.getConnection((err, conn) => {
    conn.query(
      'UPDATE tareas SET nombre_tarea = ?, estado = ?, descripcion_tarea = ?, fecha = ? WHERE id_tarea = ?',
      [nombre_tarea, estado, descripcion_tarea, fecha, id_tarea],
      (err, rows) => {
        if (err) {
          console.error(err);
        }
        res.redirect('/tareas');
      }
    );
  });
}

module.exports = {
    index: index,
    create: create,
    store: store,
    destroy: destroy,
    edit: edit,
    update: update,
};