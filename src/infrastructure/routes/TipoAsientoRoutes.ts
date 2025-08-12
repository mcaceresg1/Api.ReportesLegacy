import { Router } from 'express';
import { container } from '../container/container';
import { TipoAsientoController } from '../controllers/TipoAsientoController';
import { QueryOptimizationMiddleware } from '../middleware/QueryOptimizationMiddleware';

export function createTipoAsientoRoutes(): Router {
  const router = Router();
  const controller = container.get<TipoAsientoController>('TipoAsientoController');

  /**
   * @swagger
   * tags:
   *   name: Tipos de Asiento
   *   description: Endpoints para gestionar tipos de asiento contable
   */

  /**
   * @swagger
   * /api/tipos-asiento/{conjunto}:
   *   get:
   *     summary: Obtener tipos de asiento
   *     description: Obtiene la lista de tipos de asiento disponibles para un conjunto contable
   *     tags: [Tipos de Asiento]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *       - in: query
   *         name: tipoAsiento
   *         schema:
   *           type: string
   *         description: Filtro por tipo de asiento (búsqueda parcial)
   *       - in: query
   *         name: descripcion
   *         schema:
   *           type: string
   *         description: Filtro por descripción (búsqueda parcial)
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 1000
   *           default: 50
   *         description: Número máximo de registros a retornar
   *     responses:
   *       200:
   *         description: Tipos de asiento obtenidos exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Tipos de asiento obtenidos exitosamente con 25 registros"
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/TipoAsiento'
   *                 totalRegistros:
   *                   type: integer
   *                   example: 25
   *                 conjunto:
   *                   type: string
   *                   example: "ASFSAC"
   *       400:
   *         description: Error en los parámetros de entrada
   *       500:
   *         description: Error interno del servidor
   */
  router.get(
    '/:conjunto',
    QueryOptimizationMiddleware.validateQueryParams,
    (req, res) => controller.obtenerTiposAsiento(req, res)
  );

  return router;
}


