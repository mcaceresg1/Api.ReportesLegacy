import express from "express";
import {
  loginUsuario,
  obtenerDatos,
  registrarUsuario,
} from "../controllers/connections.controller.js";
import { verificarToken } from "../middleware/verificarToken.js";

const router = express.Router();

router.get("/datos", obtenerDatos);
router.post("/register", registrarUsuario);
router.post("/login", loginUsuario);

router.get("/profile", verificarToken, (req, res) => {
  // Si el middleware pasa, se ejecuta esta función
  res.json({
    message: "Bienvenido a tu perfil",
    user: req.user, // La información del usuario está en `req.user` (decodificada del token)
  });
});

export default router;
