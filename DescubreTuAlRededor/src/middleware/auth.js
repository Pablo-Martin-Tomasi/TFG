function authMiddleware(req, res, next) {
    if (req.session.loggendin) {
        return next();
    } else {
        res.redirect('/login');
    }
}

module.exports = authMiddleware;
