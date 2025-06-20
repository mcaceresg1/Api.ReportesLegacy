import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ error: "Acceso denegado, no se proporcionó el token" });
  }

  try {
    const decoded = jwt.verify(token, "secretKey");

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
};
