const express = require ('express');
const TareasControllers = require('../controllers/TareasControllers');

const router = express.Router();

//mostrar listado de tareas
router.get('/tareas', TareasControllers.index);

//mostrar formulario
router.get('/create', TareasControllers.create);

//guardar la tarea
router.post('/tareas/agregar', TareasControllers.store);

//eliminar la tarea
router.post('/tareas/eliminar', TareasControllers.destroy);

//editar la tarea
router.get('/tareas/edit/:id_tarea', TareasControllers.edit)
router.post('/tareas/edit/:id_tarea', TareasControllers.update)

module.exports = router;