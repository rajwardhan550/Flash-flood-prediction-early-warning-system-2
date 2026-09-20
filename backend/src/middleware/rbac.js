/**
 * Role-Based Access Control (RBAC) middleware.
 * Usage: authorize('authority', 'admin')
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthenticated request.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access forbidden: Role '${req.user.role}' lacks sufficient authorization.`
      });
    }

    next();
  };
};

module.exports = { authorize };