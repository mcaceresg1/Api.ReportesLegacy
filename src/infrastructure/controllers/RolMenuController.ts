import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { IRolMenuService } from '../../domain/services/IRolMenuService';

/**
 * @swagger
 * components:
 *   schemas:
 *     RolMenu:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         rolId:
 *           type: integer
 *         menuId:
 *           type: integer
 *         estado:
 *           type: boolean
 *     RolMenuCreate:
 *       type: object
 *       required:
 *         - rolId
 *         - menuId
 *       properties:
 *         rolId:
 *           type: integer
 *         menuId:
 *           type: integer
 *         estado:
 *           type: boolean
 *     RolMenuUpdate:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         rolId:
 *           type: integer
 *         menuId:
 *           type: integer
 *         estado:
 *           type: boolean
 */

@injectable()
export class RolMenuController {
  constructor(
    @inject('IRolMenuService') private rolMenuService: IRolMenuService
  ) {}

  /**
   * @swagger
   * /api/rol-menu:
   *   get:
   *     summary: Obtener todas las relaciones rol-menu
   *     tags: [RolMenu]
   *     responses:
   *       200:
   *         description: Lista de relaciones rol-menu obtenida exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/RolMenu'
   *       500:
   *         description: Error interno del servidor
   */
  async getAllRolMenu(req: Request, res: Response): Promise<void> {
    try {
      const rolMenus = await this.rolMenuService.getAllRolMenu();
      res.json(rolMenus);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener los roles" });
    }
  }

  /**
   * @swagger
   * /api/rol-menu:
   *   post:
   *     summary: Crear nueva relación rol-menu
   *     tags: [RolMenu]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RolMenuCreate'
   *     responses:
   *       201:
   *         description: Relación rol-menu creada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *       500:
   *         description: Error interno del servidor
   */
  async createRolMenu(req: Request, res: Response): Promise<void> {
    try {
      const rolMenuData = req.body;
      await this.rolMenuService.createRolMenu(rolMenuData);
      res.status(201).json({ message: "Agregado exitosamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al guardar el rol" });
    }
  }

  /**
   * @swagger
   * /api/rol-menu:
   *   put:
   *     summary: Actualizar relación rol-menu
   *     tags: [RolMenu]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RolMenuUpdate'
   *     responses:
   *       200:
   *         description: Relación rol-menu actualizada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 dato:
   *                   $ref: '#/components/schemas/RolMenu'
   *       400:
   *         description: ID requerido
   *       404:
   *         description: Relación no encontrada
   *       500:
   *         description: Error interno del servidor
   */
  async updateRolMenu(req: Request, res: Response): Promise<void> {
    try {
      const rolMenuData = req.body;
      const rolMenu = await this.rolMenuService.updateRolMenu(rolMenuData);
      
      res.json({ 
        message: "Rol actualizado correctamente", 
        dato: rolMenu 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar al rol" });
    }
  }

  /**
   * @swagger
   * /api/rol-menu/estado:
   *   patch:
   *     summary: Cambiar estado de relación rol-menu
   *     tags: [RolMenu]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - id
   *               - estado
   *             properties:
   *               id:
   *                 type: integer
   *               estado:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Estado actualizado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 datoEstado:
   *                   type: boolean
   *       400:
   *         description: ID requerido
   *       404:
   *         description: Relación no encontrada
   *       500:
   *         description: Error interno del servidor
   */
  async changeRolMenuEstado(req: Request, res: Response): Promise<void> {
    try {
      const { id, estado } = req.body;
      const rolMenu = await this.rolMenuService.changeRolMenuEstado(id, estado);
      
      res.json({
        message: "Estado del rol actualizado correctamente",
        datoEstado: rolMenu.estado
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al cambiar el estado del rol" });
    }
  }

  /**
   * @swagger
   * /api/rol-menu/rol/{id}:
   *   get:
   *     summary: Obtener menús por ID de rol
   *     tags: [RolMenu]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
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
  async getMenusByRolId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const menus = await this.rolMenuService.getMenusByRolId(parseInt(id));
      res.json(menus);
    } catch (error) {
      console.error("Error al obtener menús por rol:", error);
      res.status(500).json({ message: "Error al obtener los menús" });
    }
  }

  /**
   * @swagger
   * /api/rol-menu/rol/{id}/permisos:
   *   delete:
   *     summary: Eliminar todos los permisos de un rol
   *     tags: [RolMenu]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del rol
   *     responses:
   *       200:
   *         description: Permisos eliminados exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *       400:
   *         description: ID del rol requerido
   *       500:
   *         description: Error interno del servidor
   */
  async deleteRolPermisos(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.rolMenuService.deleteRolPermisos(parseInt(id));
      res.json({ message: "Permisos eliminados correctamente" });
    } catch (error) {
      console.error("Error al eliminar permisos del rol:", error);
      res.status(500).json({ message: "Error al eliminar los permisos" });
    }
  }

  /**
   * @swagger
   * /api/rol-menu/rol/{id}/permisos:
   *   post:
   *     summary: Agregar múltiples permisos a un rol
   *     tags: [RolMenu]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del rol
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: array
   *             items:
   *               $ref: '#/components/schemas/RolMenuCreate'
   *     responses:
   *       201:
   *         description: Permisos agregados exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *       400:
   *         description: Se requiere un array de permisos
   *       500:
   *         description: Error interno del servidor
   */
  async addRolPermisos(req: Request, res: Response): Promise<void> {
    try {
      const permisos = req.body;
      await this.rolMenuService.addRolPermisos(permisos);
      res.status(201).json({ message: "Permisos agregados correctamente" });
    } catch (error) {
      console.error("Error al agregar permisos:", error);
      res.status(500).json({ message: "Error al agregar los permisos" });
    }
  }
} 