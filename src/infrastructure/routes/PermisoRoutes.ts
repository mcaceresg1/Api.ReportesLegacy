import { Router } from 'express';
import { container } from '../container/container';
import { IRolSistemaMenuService } from '../../domain/services/IRolSistemaMenuService';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

/**
 * @swagger
 * components:
 *   schemas:
 *     Permiso:
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
 *     AsignarPermisosRequest:
 *       type: object
 *       required:
 *         - rolId
 *         - sistemaId
 *         - menuIds
 *       properties:
 *         rolId:
 *           type: integer
 *           description: ID del rol
 *         sistemaId:
 *           type: integer
 *           description: ID del sistema
 *         menuIds:
 *           type: array
 *           items:
 *             type: integer
 *           description: Array de IDs de menús
 */

export class PermisoRoutes {
  private router: Router;
  private rolSistemaMenuService: IRolSistemaMenuService;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.rolSistemaMenuService = container.get<IRolSistemaMenuService>('IRolSistemaMenuService');
    this.authMiddleware = container.get<AuthMiddleware>('AuthMiddleware');
    this.setupRoutes();
  }

  private setupRoutes(): void {
    /**
     * @swagger
     * /api/permisos/{rolId}/{sistemaId}:
     *   get:
     *     summary: Obtener permisos de un rol en un sistema específico
     *     tags: [Permisos]
     *     security:
     *       - bearerAuth: []
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
     *         description: Permisos obtenidos correctamente
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Permiso'
     *       400:
     *         description: Parámetros inválidos
     *       500:
     *         description: Error interno del servidor
     */
    this.router.get('/:rolId/:sistemaId', this.authMiddleware.verifyToken, async (req, res) => {
      try {
        const rolId = req.params['rolId'];
        const sistemaId = req.params['sistemaId'];
        
        if (!rolId || !sistemaId) {
          res.status(400).json({
            success: false,
            message: 'rolId y sistemaId son requeridos'
          });
          return;
        }
        
        const rolIdNum = parseInt(rolId);
        const sistemaIdNum = parseInt(sistemaId);
        
        if (isNaN(rolIdNum) || isNaN(sistemaIdNum)) {
          res.status(400).json({
            success: false,
            message: 'rolId y sistemaId deben ser números válidos'
          });
          return;
        }

        const permisos = await this.rolSistemaMenuService.getMenusByRolAndSistema(rolIdNum, sistemaIdNum);
        res.json(permisos);
      } catch (error) {
        console.error('Error al obtener permisos:', error);
        res.status(500).json({
          success: false,
          message: 'Error al obtener permisos',
          error: error instanceof Error ? error.message : 'Error desconocido'
        });
      }
    });

    /**
     * @swagger
     * /api/permisos:
     *   post:
     *     summary: Asignar permisos a un rol en un sistema
     *     tags: [Permisos]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/AsignarPermisosRequest'
     *     responses:
     *       200:
     *         description: Permisos asignados correctamente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 message:
     *                   type: string
     *       400:
     *         description: Datos inválidos
     *       401:
     *         description: No autorizado
     *       500:
     *         description: Error interno del servidor
     */
    this.router.post('/', this.authMiddleware.verifyToken, async (req, res) => {
      try {
        const { rolId, sistemaId, menuIds } = req.body;
        
        if (!rolId || !sistemaId || !Array.isArray(menuIds)) {
          res.status(400).json({
            success: false,
            message: 'rolId, sistemaId y menuIds (array) son requeridos'
          });
          return;
        }
        
        await this.rolSistemaMenuService.asignarMenusByRolAndSistema(rolId, sistemaId, menuIds);
        
        res.json({
          success: true,
          message: 'Permisos asignados correctamente'
        });
      } catch (error) {
        console.error('Error al asignar permisos:', error);
        res.status(500).json({
          success: false,
          message: 'Error al asignar permisos',
          error: error instanceof Error ? error.message : 'Error desconocido'
        });
      }
    });

    /**
     * @swagger
     * /api/permisos/{id}:
     *   put:
     *     summary: Actualizar un permiso específico
     *     tags: [Permisos]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID de la asignación de permiso
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Permiso'
     *     responses:
     *       200:
     *         description: Permiso actualizado correctamente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 data:
     *                   $ref: '#/components/schemas/Permiso'
     *       400:
     *         description: ID requerido
     *       401:
     *         description: No autorizado
     *       500:
     *         description: Error interno del servidor
     */
    this.router.put('/:id', this.authMiddleware.verifyToken, async (req, res) => {
      try {
        const id = req.params['id'];
        if (!id) {
          res.status(400).json({
            success: false,
            message: 'ID de asignación requerido'
          });
          return;
        }
        
        const asignacionData = req.body;
        const asignacion = await this.rolSistemaMenuService.updateAsignacionById(parseInt(id), asignacionData);
        res.json({
          success: true,
          data: asignacion
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Error al actualizar permiso',
          error: error instanceof Error ? error.message : 'Error desconocido'
        });
      }
    });
  }

  public getRouter(): Router {
    return this.router;
  }
} 