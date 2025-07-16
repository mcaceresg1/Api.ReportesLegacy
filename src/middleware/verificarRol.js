export const verificarRol = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "No autenticado. Token requerido." });
    }

    const rolUsuario = req.user.rol || req.user.role || req.user.roleId;

    if (!rolUsuario || !roles.includes(rolUsuario)) {
      return res
        .status(403)
        .json({ error: "No tienes permisos para realizar esta acción" });
    }

    next();
  };
};
