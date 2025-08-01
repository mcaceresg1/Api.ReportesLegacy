import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { IRolService } from '../../domain/services/IRolService';
import { RolCreate, RolUpdate } from '../../domain/entities/Rol';

/**
 * @swagger
 * components:
 *   schemas:
 *     Rol:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         descripcion:
 *           type: string
 *         descripcion_completa:
 *           type: string
 *         estado:
 *           type: boolean
 *     RolCreate:
 *       type: object
 *       required:
 *         - descripcion
 *       properties:
 *         descripcion:
 *           type: string
 *         descripcion_completa:
 *           type: string
 *         estado:
 *           type: boolean
 *     RolUpdate:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         descripcion:
 *           type: string
 *         descripcion_completa:
 *           type: string
 *         estado:
 *           type: boolean
 */

@injectable()
export class RolController {
  constructor(
    @inject('IRolService') private rolService: IRolService
  ) {}

  /**
   * @swagger
   * /api/roles:
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
  async getAllRoles(req: Request, res: Response): Promise<void> {
    try {
      const roles = await this.rolService.getAllRoles();
      res.json(roles);
    } catch (error) {
      console.error("Error al obtener roles:", error);
      res.status(500).json({ 
        message: "Error al obtener roles",
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/roles:
   *   post:
   *     summary: Crear nuevo rol
   *     tags: [Roles]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RolCreate'
   *     responses:
   *       201:
   *         description: Rol creado exitosamente
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
  async createRol(req: Request, res: Response): Promise<void> {
    try {
      const rolData: RolCreate = req.body;
      await this.rolService.createRol(rolData);
      res.status(201).json({ message: "Rol agregado exitosamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al guardar el rol" });
    }
  }

  /**
   * @swagger
   * /api/roles:
   *   put:
   *     summary: Actualizar rol
   *     tags: [Roles]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RolUpdate'
   *     responses:
   *       200:
   *         description: Rol actualizado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 dato:
   *                   $ref: '#/components/schemas/Rol'
   *       400:
   *         description: ID requerido
   *       404:
   *         description: Rol no encontrado
   *       500:
   *         description: Error interno del servidor
   */
  async updateRol(req: Request, res: Response): Promise<void> {
    try {
      const rolData: RolUpdate = req.body;
      const rol = await this.rolService.updateRol(rolData);
      
      res.json({ 
        message: "Rol actualizado correctamente", 
        dato: rol 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar al rol" });
    }
  }

  /**
   * @swagger
   * /api/roles/estado:
   *   patch:
   *     summary: Cambiar estado del rol
   *     tags: [Roles]
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
   *         description: Estado del rol actualizado exitosamente
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
   *         description: Rol no encontrado
   *       500:
   *         description: Error interno del servidor
   */
  async changeRolEstado(req: Request, res: Response): Promise<void> {
    try {
      const { id, estado } = req.body;
      const rol = await this.rolService.changeRolEstado(id, estado);
      
      res.json({
        message: "Estado del rol actualizado correctamente",
        datoEstado: rol.estado
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al cambiar el estado del rol" });
    }
  }
} 