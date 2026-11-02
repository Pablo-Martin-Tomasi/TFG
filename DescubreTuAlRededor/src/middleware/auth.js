function authMiddleware(req, res, next) {
    if (req.session.loggendin) {
        return next();
    } else {
        res.redirect('/login');
    }
}

function adminMiddleware(req, res, next) {
    if (req.session.loggendin && req.session.rol === 'Admin') {
        return next();
    } else {
        // Si no es admin, redirigir al inicio o mostrar error
        res.status(403).send('Acceso denegado: Se requieren permisos de administrador.');
    }
}

module.exports = {
    authMiddleware,
    adminMiddleware
};
