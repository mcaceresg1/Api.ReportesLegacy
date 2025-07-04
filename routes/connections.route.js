import express from "express";
import {
  editarConexion,
  agregarConexion,
  eliminarConexion,
  obtenerConexiones,
  obtenerConexionPorId,
} from "../controllers/connections.controller.js";
import {
  agregarUsuario,
  editarUsuario,
  eliminarUsuario,
  obtenerUsuarioPorId,
  obtenerUsuarios,
} from "../controllers/users.controller.js";
import {
  agregarRol,
  editarRol,
  obtenerRoles,
} from "../controllers/roles.controller.js";

const router = express.Router();

// //!Conexiones
router.get("/conexiones", obtenerConexiones);
router.post("/conexiones", agregarConexion);
router.put("/conexiones", editarConexion);
router.delete("/conexiones/:id", eliminarConexion);
router.get("/conexiones/:id", obtenerConexionPorId);

// //!Usuarios
// router.post(
//   "/usuarios/register",
//   verificarToken,
//   verificarRol(["Admin"]),
//   registrarUsuario
// );
// router.post("/login", loginUsuario);
router.get("/usuarios", obtenerUsuarios);
router.get("/usuarios/:id", obtenerUsuarioPorId);
router.post("/usuarios/register", agregarUsuario);
router.put("/usuarios", editarUsuario);
router.delete("/usuarios/:id", eliminarUsuario);

// //!Roles
router.post("/roles", agregarRol);
router.get("/roles", obtenerRoles);
router.put("/roles", editarRol);
// router.delete("/roles/:id", cambiarEstadoRol);

export default router;
