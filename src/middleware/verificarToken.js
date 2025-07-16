import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Carga las variables de entorno

// export const verificarToken = (req, res, next) => {
//   const authHeader = req.header("Authorization");

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ error: "Token no proporcionado o mal formado" });
//   }

//   const token = authHeader.replace("Bearer ", "");

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Usa .env

//     req.user = decoded; // Ahora tienes acceso a info del usuario en `req.user`
//     next();
//   } catch (err) {
//     return res.status(401).json({ error: "Token inválido o expirado" });
//   }
// };

// middleware/auth.js
export const verificarToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token faltante' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
