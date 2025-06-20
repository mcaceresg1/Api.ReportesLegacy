import express from "express";
import {
  agregarDatos,
  editarDatos,
  eliminarDatos,
  obtenerDatos,
} from "../controllers/connections.controller.js";
import { verificarToken } from "../middleware/verificarToken.js";
import { verificarRol } from "../middleware/verificarRol.js";
import {
  eliminarUsuarios,
  loginUsuario,
  obtenerUsuarios,
  registrarUsuario,
} from "../controllers/users.controller.js";

const router = express.Router();

//!Conexiones
router.post("/conexiones", agregarDatos);
router.get("/conexiones", obtenerDatos);
router.put("/conexiones", editarDatos);
router.delete("/conexiones/:id", eliminarDatos);

//!Usuarios
router.post(
  "/usuarios/register",
  verificarToken,
  verificarRol(["Admin"]),
  registrarUsuario
);
router.post("/login", loginUsuario);
router.get("/usuarios", obtenerUsuarios);
router.delete("/usuarios/:id", eliminarUsuarios);
// router.put("/usuarios", editarUsuarios);

export default router;
