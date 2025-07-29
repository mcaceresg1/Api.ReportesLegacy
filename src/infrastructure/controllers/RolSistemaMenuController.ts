import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { IRolSistemaMenuService } from '../../domain/services/IRolSistemaMenuService';

/**
 * @swagger
 * components:
 *   schemas:
 *     RolSistemaMenu:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         rolId:
 *           type: integer
 *         sistemaId:
 *           type: integer
 *         menuId:
 *           type: integer
 *         estado:
 *           type: boolean
 *     RolSistemaMenuCreate:
 *       type: object
 *       required:
 *         - rolId
 *         - sistemaId
 *         - menuId
 *       properties:
 *         rolId:
 *           type: integer
 *         sistemaId:
 *           type: integer
 *         menuId:
 *           type: integer
 *         estado:
 *           type: boolean
 *     RolSistemaMenuUpdate:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         rolId:
 *           type: integer
 *         sistemaId:
 *           type: integer
 *         menuId:
 *           type: integer
 *         estado:
 *           type: boolean
 */

@injectable()
export class RolSistemaMenuController {
  constructor(
    @inject('IRolSistemaMenuService') private rolSistemaMenuService: IRolSistemaMenuService
  ) {}

  /**
   * @swagger
   * /api/rol-sistema-menu/{rolId}/{sistemaId}:
   *   get:
   *     summary: Obtener menús por rol y sistema
   *     tags: [RolSistemaMenu]
   *     parameters:
   *       - in: path
   *         name: rolId
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del rol
   *       - in: path
   *         name: sistemaId
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del sistema
   *     responses:
   *       200:
   *         description: Menús obtenidos exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Menu'
   *       400:
   *         description: Faltan parámetros
   *       404:
   *         description: Sistema no encontrado o no hay menús asignados
   *       500:
   *         description: Error interno del servidor
   */
  async getMenusByRolAndSistema(req: Request, res: Response): Promise<void> {
    try {
      const { rolId, sistemaId } = req.params;

      if (!rolId || !sistemaId) {
        return res.status(400).json({ 
          message: "rolId y sistemaId son requeridos" 
        });
      }

      const menus = await this.rolSistemaMenuService.getMenusByRolAndSistema(parseInt(rolId), parseInt(sistemaId));
      res.json(menus);
    } catch (error) {
      console.error("Error al obtener menús por rol y sistema:", error);
      res.status(500).json({ 
        message: "Error al obtener menús por rol y sistema",
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/rol-sistema-menu/asignar:
   *   post:
   *     summary: Asignar menús por rol y sistema
   *     tags: [RolSistemaMenu]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - rolId
   *               - sistemaId
   *               - menuIds
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
   *       200:
   *         description: Menús asignados correctamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *       400:
   *         description: Faltan parámetros o formato incorrecto
   *       500:
   *         description: Error interno del servidor
   */
  async asignarMenusByRolAndSistema(req: Request, res: Response): Promise<void> {
    try {
      const { rolId, sistemaId, menuIds } = req.body;

      if (!rolId || !sistemaId || !Array.isArray(menuIds)) {
        return res.status(400).json({ 
          message: 'Faltan parámetros o formato incorrecto.' 
        });
      }

      await this.rolSistemaMenuService.asignarMenusByRolAndSistema(rolId, sistemaId, menuIds);
      res.json({ message: 'Menús asignados correctamente.' });
    } catch (error) {
      console.error('Error al asignar menús:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  /**
   * @swagger
   * /api/rol-sistema-menu/{id}:
   *   put:
   *     summary: Actualizar asignación por ID
   *     tags: [RolSistemaMenu]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID de la asignación
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RolSistemaMenuUpdate'
   *     responses:
   *       200:
   *         description: Asignación actualizada correctamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 asignacion:
   *                   $ref: '#/components/schemas/RolSistemaMenu'
   *       404:
   *         description: Asignación no encontrada
   *       500:
   *         description: Error interno del servidor
   */
  async updateAsignacionById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const asignacionData = req.body;
      
      const asignacion = await this.rolSistemaMenuService.updateAsignacionById(
        parseInt(id), 
        asignacionData
      );

      res.json({
        message: 'Asignación actualizada correctamente.',
        asignacion
      });
    } catch (error) {
      console.error('Error al actualizar asignación:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
} 