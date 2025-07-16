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
  loginUsuario,
  obtenerUsuarioPorId,
  obtenerUsuarios,
} from "../controllers/users.controller.js";

import {
  agregarRol,
  cambiarEstadoRol,
  editarRol,
  obtenerRoles,
} from "../controllers/roles.controller.js";

import {
  obtenerSistemas,
  agregarSistema,
  editarSistema,
  eliminarSistema,
} from "../controllers/sistemas.controller.js";

import {
  obtenerMenus,
  agregarMenu,
  editarMenu,
  eliminarMenu,
} from "../controllers/menus.controller.js";


import { 
  agregarRolMenu, 
  // cambiarEstadoRolMenu, 
  editarRolMenu, 
  obtenerMenuPorIdRol, 
  obtenerRolMenu,
} from "../controllers/rolMenu.controller.js";


import { 
  actualizarAsignacionPorId,
  asignarMenusPorRolYSistema,
  obtenerMenusPorRolYSistema
 } from "../controllers/rolSistemaMenu.controller.js";

 import { verificarToken } from "../middleware/verificarToken.js";

const router = express.Router();

// 🔌 Conexiones
router.get("/conexiones", obtenerConexiones);
router.post("/conexiones", agregarConexion);
router.put("/conexiones", editarConexion);
router.delete("/conexiones/:id", eliminarConexion);
router.get("/conexiones/:id", obtenerConexionPorId);

// 👤 Usuarios
router.post("/login", loginUsuario);
router.get("/usuarios", verificarToken, obtenerUsuarios);
router.get("/usuarios/:id", obtenerUsuarioPorId);
router.post("/usuarios/register", agregarUsuario);
router.put("/usuarios", editarUsuario);
router.delete("/usuarios/:id", eliminarUsuario);

// 🧑‍💼 Roles
router.post("/roles", agregarRol);
router.get("/roles", obtenerRoles);
router.put("/roles", editarRol);
router.patch("/roles", cambiarEstadoRol);

// 🧩 Sistemas
router.get("/sistemas", obtenerSistemas);
router.post("/sistemas", agregarSistema);
router.put("/sistemas", editarSistema);
router.delete("/sistemas/:id", eliminarSistema);

// 📋 Menús
router.get("/menus", obtenerMenus);
router.post("/menus", agregarMenu);
router.put("/menus", editarMenu);
router.delete("/menus/:id", eliminarMenu);



// 📋 RolMenús
router.get("/rolMenu", obtenerRolMenu);
router.get("/rolMenu/:id", obtenerMenuPorIdRol);
router.post("/rolMenu", agregarRolMenu);
router.put("/rolMenu", editarRolMenu);

// router.patch("/rolMenu", cambiarEstadoRolMenu);

// 🛡️ Permisos (Rol-Sistema-Menu)

router.get("/permisos/:rolId/:sistemaId", obtenerMenusPorRolYSistema);
router.post("/permisos", asignarMenusPorRolYSistema);
router.put("/permisos/:id", actualizarAsignacionPorId);
export default router;
