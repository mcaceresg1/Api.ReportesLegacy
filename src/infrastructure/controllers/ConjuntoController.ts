import { Request, Response } from 'express';
import { IConjuntoService } from '../../domain/services/IConjuntoService';

/**
 * @swagger
 * components:
 *   schemas:
 *     Conjunto:
 *       type: object
 *       required:
 *         - CONJUNTO
 *       properties:
 *         CONJUNTO:
 *           type: string
 *           maxLength: 10
 *           description: Código del conjunto (clave primaria)
 *         NOMBRE:
 *           type: string
 *           maxLength: 150
 *           description: Nombre del conjunto
 *         DIREC1:
 *           type: string
 *           maxLength: 250
 *           description: Dirección 1
 *         DIREC2:
 *           type: string
 *           maxLength: 250
 *           description: Dirección 2
 *         TELEFONO:
 *           type: string
 *           maxLength: 30
 *           description: Teléfono
 *         LOGO:
 *           type: string
 *           maxLength: 100
 *           description: Logo
 */

export class ConjuntoController {
  constructor(private conjuntoService: IConjuntoService) {}

  /**
   * @swagger
   * /api/conjuntos:
   *   get:
   *     summary: Obtener todos los conjuntos
   *     description: Retorna una lista de todos los conjuntos disponibles
   *     tags: [Conjuntos]
   *     security: []
   *     responses:
   *       200:
   *         description: Lista de conjuntos obtenida exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Conjunto'
   *                 message:
   *                   type: string
   *                   example: Conjuntos obtenidos exitosamente
   *       500:
   *         description: Error interno del servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: Error al obtener conjuntos
   */
  async getAllConjuntos(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query["limit"] as string) || 100;
      const offset = parseInt(req.query["offset"] as string) || 0;
      const page = parseInt(req.query["page"] as string) || 1;
      
      // Validar límites para evitar consultas muy grandes
      const maxLimit = 1000;
      const validatedLimit = Math.min(limit, maxLimit);
      const validatedOffset = Math.max(offset, 0);

      const [conjuntos, totalCount] = await Promise.all([
        this.conjuntoService.getAllConjuntos(validatedLimit, validatedOffset),
        this.conjuntoService.getConjuntosCount()
      ]);

      res.json({
        success: true,
        data: conjuntos,
        pagination: {
          page,
          limit: validatedLimit,
          offset: validatedOffset,
          total: totalCount,
          totalPages: Math.ceil(totalCount / validatedLimit)
        },
        message: 'Conjuntos obtenidos exitosamente'
      });
    } catch (error) {
      console.error('Error en ConjuntoController.getAllConjuntos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener conjuntos',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/conjuntos/{codigo}:
   *   get:
   *     summary: Obtener conjunto por código
   *     description: Retorna un conjunto específico por su código
   *     tags: [Conjuntos]
   *     security: []
   *     parameters:
   *       - in: path
   *         name: codigo
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto
   *     responses:
   *       200:
   *         description: Conjunto obtenido exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Conjunto'
   *                 message:
   *                   type: string
   *                   example: Conjunto obtenido exitosamente
   *       400:
   *         description: Código de conjunto requerido
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: Código de conjunto es requerido
   *       404:
   *         description: Conjunto no encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: Conjunto no encontrado
   *       500:
   *         description: Error interno del servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: Error al obtener conjunto
   */
  async getConjuntoByCodigo(req: Request, res: Response): Promise<void> {
    try {
      const { codigo } = req.params;
      
      if (!codigo) {
        res.status(400).json({
          success: false,
          message: 'Código de conjunto es requerido'
        });
        return;
      }

      const conjunto = await this.conjuntoService.getConjuntoByCodigo(codigo);
      
      if (!conjunto) {
        res.status(404).json({
          success: false,
          message: 'Conjunto no encontrado'
        });
        return;
      }

      res.json({
        success: true,
        data: conjunto,
        message: 'Conjunto obtenido exitosamente'
      });
    } catch (error) {
      console.error('Error en ConjuntoController.getConjuntoByCodigo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener conjunto',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/conjuntos/activos:
   *   get:
   *     summary: Obtener conjuntos activos
   *     description: Retorna una lista de conjuntos activos (ES_PRINCIPAL = true o null)
   *     tags: [Conjuntos]
   *     security: []
   *     responses:
   *       200:
   *         description: Lista de conjuntos activos obtenida exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Conjunto'
   *                 message:
   *                   type: string
   *                   example: Conjuntos activos obtenidos exitosamente
   *       500:
   *         description: Error interno del servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: Error al obtener conjuntos activos
   */
  async getConjuntosActivos(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query["limit"] as string) || 100;
      const offset = parseInt(req.query["offset"] as string) || 0;
      const page = parseInt(req.query["page"] as string) || 1;
      
      // Validar límites para evitar consultas muy grandes
      const maxLimit = 1000;
      const validatedLimit = Math.min(limit, maxLimit);
      const validatedOffset = Math.max(offset, 0);

      const [conjuntos, totalCount] = await Promise.all([
        this.conjuntoService.getConjuntosActivos(validatedLimit, validatedOffset),
        this.conjuntoService.getConjuntosActivosCount()
      ]);

      res.json({
        success: true,
        data: conjuntos,
        pagination: {
          page,
          limit: validatedLimit,
          offset: validatedOffset,
          total: totalCount,
          totalPages: Math.ceil(totalCount / validatedLimit)
        },
        message: 'Conjuntos activos obtenidos exitosamente'
      });
    } catch (error) {
      console.error('Error en ConjuntoController.getConjuntosActivos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener conjuntos activos',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}
