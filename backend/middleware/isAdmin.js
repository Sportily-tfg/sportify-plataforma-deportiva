module.exports = function isAdmin(req, res, next) {
  if (req.user && req.user.rol === 'admin') {
    return next();
  } else {
    return res.status(403).json({ error: 'Acceso denegado: se requiere rol de administrador' });
  }
};
