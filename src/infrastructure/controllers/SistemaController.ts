import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { ISistemaService } from '../../domain/services/ISistemaService';
import { SistemaCreate, SistemaUpdate } from '../../domain/entities/Sistema';

/**
 * @swagger
 * components:
 *   schemas:
 *     Sistema:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         descripcion:
 *           type: string
 *         estado:
 *           type: boolean
 *     SistemaCreate:
 *       type: object
 *       required:
 *         - descripcion
 *       properties:
 *         descripcion:
 *           type: string
 *         estado:
 *           type: boolean
 *     SistemaUpdate:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         descripcion:
 *           type: string
 *         estado:
 *           type: boolean
 */

@injectable()
export class SistemaController {
  constructor(
    @inject('ISistemaService') private sistemaService: ISistemaService
  ) {}

  /**
   * @swagger
   * /api/sistemas:
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
  async getAllSistemas(req: Request, res: Response): Promise<void> {
    try {
      const sistemas = await this.sistemaService.getAllSistemas();
      res.json(sistemas);
    } catch (error) {
      console.error("Error al obtener sistemas:", error);
      res.status(500).json({ 
        message: "Error al obtener sistemas",
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/sistemas:
   *   post:
   *     summary: Crear nuevo sistema
   *     tags: [Sistemas]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/SistemaCreate'
   *     responses:
   *       201:
   *         description: Sistema creado exitosamente
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
  async createSistema(req: Request, res: Response): Promise<void> {
    try {
      const sistemaData: SistemaCreate = req.body;
      await this.sistemaService.createSistema(sistemaData);
      res.status(201).json({ message: "Sistema agregado exitosamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al guardar el sistema" });
    }
  }

  /**
   * @swagger
   * /api/sistemas:
   *   put:
   *     summary: Actualizar sistema
   *     tags: [Sistemas]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/SistemaUpdate'
   *     responses:
   *       200:
   *         description: Sistema actualizado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 sistema:
   *                   $ref: '#/components/schemas/Sistema'
   *       400:
   *         description: ID requerido
   *       404:
   *         description: Sistema no encontrado
   *       500:
   *         description: Error interno del servidor
   */
  async updateSistema(req: Request, res: Response): Promise<void> {
    try {
      const sistemaData: SistemaUpdate = req.body;
      const sistema = await this.sistemaService.updateSistema(sistemaData);
      
      res.json({ 
        message: "Sistema actualizado correctamente", 
        sistema 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar el sistema" });
    }
  }

  /**
   * @swagger
   * /api/sistemas/{id}:
   *   delete:
   *     summary: Eliminar sistema
   *     tags: [Sistemas]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del sistema
   *     responses:
   *       200:
   *         description: Sistema eliminado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *       404:
   *         description: Sistema no encontrado
   *       500:
   *         description: Error interno del servidor
   */
  async deleteSistema(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.sistemaService.deleteSistema(parseInt(id));
      
      if (!success) {
        res.status(404).json({ message: "Sistema no encontrado" });
        return;
      }

      res.json({ message: "Sistema eliminado correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al eliminar el sistema" });
    }
  }

  /**
   * @swagger
   * /api/sistemas/{sistemaId}/usuarios:
   *   get:
   *     summary: Obtener usuarios de un sistema específico
   *     tags: [Sistemas]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: sistemaId
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del sistema
   *     responses:
   *       200:
   *         description: Usuarios del sistema obtenidos exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                   username:
   *                     type: string
   *                   email:
   *                     type: string
   *                   empresa:
   *                     type: string
   *       500:
   *         description: Error interno del servidor
   */
  async getUsuariosPorSistema(req: Request, res: Response): Promise<void> {
    try {
      const { sistemaId } = req.params;
      const usuarios = await this.sistemaService.getUsuariosPorSistema(parseInt(sistemaId));
      res.json(usuarios);
    } catch (error) {
      console.error("Error al obtener usuarios del sistema:", error);
      res.status(500).json({ 
        message: "Error al obtener usuarios del sistema",
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/sistemas/{sistemaId}/permisos:
   *   get:
   *     summary: Obtener permisos de un sistema específico
   *     tags: [Sistemas]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: sistemaId
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del sistema
   *     responses:
   *       200:
   *         description: Permisos del sistema obtenidos exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                   rolId:
   *                     type: integer
   *                   sistemaId:
   *                     type: integer
   *                   menuId:
   *                     type: integer
   *                   menu:
   *                     type: object
   *       500:
   *         description: Error interno del servidor
   */
  async getPermisosSistema(req: Request, res: Response): Promise<void> {
    try {
      const { sistemaId } = req.params;
      const permisos = await this.sistemaService.getPermisosSistema(parseInt(sistemaId));
      res.json(permisos);
    } catch (error) {
      console.error("Error al obtener permisos del sistema:", error);
      res.status(500).json({ 
        message: "Error al obtener permisos del sistema",
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/sistemas/{sistemaId}/roles:
   *   get:
   *     summary: Obtener roles de un sistema específico
   *     tags: [Sistemas]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: sistemaId
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del sistema
   *     responses:
   *       200:
   *         description: Roles del sistema obtenidos exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Rol'
   *       500:
   *         description: Error interno del servidor
   */
  async getRolesPorSistema(req: Request, res: Response): Promise<void> {
    try {
      const { sistemaId } = req.params;
      const roles = await this.sistemaService.getRolesPorSistema(parseInt(sistemaId));
      res.json(roles);
    } catch (error) {
      console.error("Error al obtener roles del sistema:", error);
      res.status(500).json({ 
        message: "Error al obtener roles del sistema",
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/sistemas/{sistemaId}/menus:
   *   get:
   *     summary: Obtener menús de un sistema específico
   *     tags: [Sistemas]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: sistemaId
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del sistema
   *     responses:
   *       200:
   *         description: Menús del sistema obtenidos exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Menu'
   *       500:
   *         description: Error interno del servidor
   */
  async getMenusPorSistema(req: Request, res: Response): Promise<void> {
    try {
      const { sistemaId } = req.params;
      const menus = await this.sistemaService.getMenusPorSistema(parseInt(sistemaId));
      res.json(menus);
    } catch (error) {
      console.error("Error al obtener menús del sistema:", error);
      res.status(500).json({ 
        message: "Error al obtener menús del sistema",
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/sistemas/{sistemaId}/estadisticas:
   *   get:
   *     summary: Obtener estadísticas de un sistema específico
   *     tags: [Sistemas]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: sistemaId
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del sistema
   *     responses:
   *       200:
   *         description: Estadísticas del sistema obtenidas exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 totalUsuarios:
   *                   type: integer
   *                 totalPermisos:
   *                   type: integer
   *                 totalRoles:
   *                   type: integer
   *                 totalMenus:
   *                   type: integer
   *                 sistemaId:
   *                   type: integer
   *                 fechaConsulta:
   *                   type: string
   *       500:
   *         description: Error interno del servidor
   */
  async getEstadisticasSistema(req: Request, res: Response): Promise<void> {
    try {
      const { sistemaId } = req.params;
      const estadisticas = await this.sistemaService.getEstadisticasSistema(parseInt(sistemaId));
      res.json(estadisticas);
    } catch (error) {
      console.error("Error al obtener estadísticas del sistema:", error);
      res.status(500).json({ 
        message: "Error al obtener estadísticas del sistema",
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
} 