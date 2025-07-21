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

// =================== CONEXIONES ===================

/**
 * @swagger
 * /conexiones:
 *   get:
 *     summary: Obtener todas las conexiones
 *     tags: [Conexiones]
 *     responses:
 *       200:
 *         description: Lista de conexiones obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Conexion'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/conexiones", obtenerConexiones);

/**
 * @swagger
 * /conexiones:
 *   post:
 *     summary: Crear nueva conexión
 *     tags: [Conexiones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Conexion'
 *     responses:
 *       201:
 *         description: Conexión creada exitosamente
 *       500:
 *         description: Error interno del servidor
 */
router.post("/conexiones", agregarConexion);

/**
 * @swagger
 * /conexiones:
 *   put:
 *     summary: Actualizar conexión existente
 *     tags: [Conexiones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Conexion'
 *     responses:
 *       200:
 *         description: Conexión actualizada exitosamente
 *       404:
 *         description: Conexión no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put("/conexiones", editarConexion);

/**
 * @swagger
 * /conexiones/{id}:
 *   delete:
 *     summary: Eliminar conexión por ID
 *     tags: [Conexiones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la conexión a eliminar
 *     responses:
 *       200:
 *         description: Conexión eliminada exitosamente
 *       404:
 *         description: Conexión no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/conexiones/:id", eliminarConexion);

/**
 * @swagger
 * /conexiones/{id}:
 *   get:
 *     summary: Obtener conexión por ID
 *     tags: [Conexiones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la conexión
 *     responses:
 *       200:
 *         description: Conexión obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Conexion'
 *       404:
 *         description: Conexión no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get("/conexiones/:id", obtenerConexionPorId);

// =================== USUARIOS ===================

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Credenciales inválidas
 *       404:
 *         description: Usuario no encontrado
 *       400:
 *         description: Faltan campos requeridos
 */
router.post("/login", loginUsuario);

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Token no válido o faltante
 *       500:
 *         description: Error interno del servidor
 */
router.get("/usuarios", verificarToken, obtenerUsuarios);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/usuarios/:id", obtenerUsuarioPorId);

/**
 * @swagger
 * /usuarios/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       500:
 *         description: Error interno del servidor
 */
router.post("/usuarios/register", agregarUsuario);

/**
 * @swagger
 * /usuarios:
 *   put:
 *     summary: Actualizar usuario existente
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/usuarios", editarUsuario);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Eliminar usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/usuarios/:id", eliminarUsuario);

// =================== ROLES ===================

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Obtener todos los roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Lista de roles obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rol'
 *       500:
 *         description: Error interno del servidor
 */
router.get("/roles", obtenerRoles);

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Crear nuevo rol
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rol'
 *     responses:
 *       201:
 *         description: Rol creado exitosamente
 *       500:
 *         description: Error interno del servidor
 */
router.post("/roles", agregarRol);

/**
 * @swagger
 * /roles:
 *   put:
 *     summary: Actualizar rol existente
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rol'
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente
 *       404:
 *         description: Rol no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/roles", editarRol);

/**
 * @swagger
 * /roles:
 *   patch:
 *     summary: Cambiar estado del rol
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               estado:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Estado del rol actualizado exitosamente
 *       404:
 *         description: Rol no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.patch("/roles", cambiarEstadoRol);

// =================== SISTEMAS ===================

/**
 * @swagger
 * /sistemas:
 *   get:
 *     summary: Obtener todos los sistemas
 *     tags: [Sistemas]
 *     responses:
 *       200:
 *         description: Lista de sistemas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sistema'
 *       500:
 *         description: Error interno del servidor
 */
router.get("/sistemas", obtenerSistemas);

/**
 * @swagger
 * /sistemas:
 *   post:
 *     summary: Crear nuevo sistema
 *     tags: [Sistemas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sistema'
 *     responses:
 *       201:
 *         description: Sistema creado exitosamente
 *       500:
 *         description: Error interno del servidor
 */
router.post("/sistemas", agregarSistema);

/**
 * @swagger
 * /sistemas:
 *   put:
 *     summary: Actualizar sistema existente
 *     tags: [Sistemas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sistema'
 *     responses:
 *       200:
 *         description: Sistema actualizado exitosamente
 *       404:
 *         description: Sistema no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/sistemas", editarSistema);

/**
 * @swagger
 * /sistemas/{id}:
 *   delete:
 *     summary: Eliminar sistema por ID
 *     tags: [Sistemas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del sistema a eliminar
 *     responses:
 *       200:
 *         description: Sistema eliminado exitosamente
 *       404:
 *         description: Sistema no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/sistemas/:id", eliminarSistema);

// =================== MENÚS ===================

/**
 * @swagger
 * /menus:
 *   get:
 *     summary: Obtener estructura jerárquica de menús
 *     tags: [Menús]
 *     responses:
 *       200:
 *         description: Estructura de menús obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Menu'
 *       500:
 *         description: Error interno del servidor
 */
router.get("/menus", obtenerMenus);

/**
 * @swagger
 * /menus:
 *   post:
 *     summary: Crear nuevo menú
 *     tags: [Menús]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Menu'
 *     responses:
 *       201:
 *         description: Menú creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post("/menus", agregarMenu);

/**
 * @swagger
 * /menus:
 *   put:
 *     summary: Actualizar menú existente
 *     tags: [Menús]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Menu'
 *     responses:
 *       200:
 *         description: Menú actualizado exitosamente
 *       404:
 *         description: Menú no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/menus", editarMenu);

/**
 * @swagger
 * /menus/{id}:
 *   delete:
 *     summary: Eliminar menú por ID
 *     tags: [Menús]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del menú a eliminar
 *     responses:
 *       200:
 *         description: Menú eliminado exitosamente
 *       404:
 *         description: Menú no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/menus/:id", eliminarMenu);

// =================== ROL-MENÚS ===================

/**
 * @swagger
 * /rolMenu:
 *   get:
 *     summary: Obtener todas las asignaciones rol-menú
 *     tags: [Rol-Menús]
 *     responses:
 *       200:
 *         description: Lista de asignaciones rol-menú obtenida exitosamente
 *       500:
 *         description: Error interno del servidor
 */
router.get("/rolMenu", obtenerRolMenu);

/**
 * @swagger
 * /rolMenu/{id}:
 *   get:
 *     summary: Obtener menús asignados a un rol específico
 *     tags: [Rol-Menús]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del rol
 *     responses:
 *       200:
 *         description: Menús del rol obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Menu'
 *       404:
 *         description: No hay menús asignados a este rol
 *       500:
 *         description: Error interno del servidor
 */
router.get("/rolMenu/:id", obtenerMenuPorIdRol);

/**
 * @swagger
 * /rolMenu:
 *   post:
 *     summary: Asignar menú a rol
 *     tags: [Rol-Menús]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rolId:
 *                 type: integer
 *               menuId:
 *                 type: integer
 *               estado:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Menú asignado al rol exitosamente
 *       500:
 *         description: Error interno del servidor
 */
router.post("/rolMenu", agregarRolMenu);

/**
 * @swagger
 * /rolMenu:
 *   put:
 *     summary: Actualizar asignación rol-menú
 *     tags: [Rol-Menús]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               estado:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Asignación actualizada exitosamente
 *       404:
 *         description: Asignación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put("/rolMenu", editarRolMenu);

// =================== PERMISOS (ROL-SISTEMA-MENÚ) ===================

/**
 * @swagger
 * /permisos/{rolId}/{sistemaId}:
 *   get:
 *     summary: Obtener menús permitidos para un rol en un sistema específico
 *     tags: [Permisos]
 *     parameters:
 *       - in: path
 *         name: rolId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del rol
 *       - in: path
 *         name: sistemaId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del sistema
 *     responses:
 *       200:
 *         description: Menús permitidos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Menu'
 *       400:
 *         description: Faltan parámetros
 *       404:
 *         description: No hay menús asignados a este rol y sistema
 *       500:
 *         description: Error interno del servidor
 */
router.get("/permisos/:rolId/:sistemaId", obtenerMenusPorRolYSistema);

/**
 * @swagger
 * /permisos:
 *   post:
 *     summary: Asignar menús a rol por sistema
 *     tags: [Permisos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rolId:
 *                 type: integer
 *               sistemaId:
 *                 type: integer
 *               menuIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Permisos asignados exitosamente
 *       500:
 *         description: Error interno del servidor
 */
router.post("/permisos", asignarMenusPorRolYSistema);

/**
 * @swagger
 * /permisos/{id}:
 *   put:
 *     summary: Actualizar asignación específica de permiso
 *     tags: [Permisos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la asignación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Permiso actualizado exitosamente
 *       404:
 *         description: Asignación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put("/permisos/:id", actualizarAsignacionPorId);

export default router;
