import { Router } from 'express';
import { container } from '../container/container';
import { ResumenAsientosController } from '../controllers/ResumenAsientosController';
import { QueryOptimizationMiddleware } from '../middleware/QueryOptimizationMiddleware';

export function createResumenAsientosRoutes(): Router {
  const router = Router();
  
  // Obtener instancia del controlador desde el contenedor
  const controller = container.get<ResumenAsientosController>('ResumenAsientosController');

  /**
   * @swagger
   * tags:
   *   name: Resumen de Asientos
   *   description: Endpoints para generar reportes de resumen de asientos contables
   */

  /**
   * @swagger
   * /api/resumen-asientos/{conjunto}/resumen:
   *   get:
   *     summary: Obtener reporte de resumen de asientos contables
   *     description: Genera un reporte resumido de movimientos contables agrupados por tipo de asiento, cuenta contable y centro de costo
   *     tags: [Resumen de Asientos]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *       - in: query
   *         name: fechaInicio
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha de inicio del período (YYYY-MM-DD)
   *       - in: query
   *         name: fechaFin
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha final del período (YYYY-MM-DD)
   *       - in: query
   *         name: tipoAsiento
   *         schema:
   *           type: string
   *         description: Filtro por tipo de asiento específico
   *       - in: query
   *         name: cuentaContable
   *         schema:
   *           type: string
   *         description: Filtro por cuenta contable específica
   *       - in: query
   *         name: centroCosto
   *         schema:
   *           type: string
   *         description: Filtro por centro de costo específico
   *       - in: query
   *         name: usuario
   *         schema:
   *           type: string
   *         description: Filtro por usuario específico
   *       - in: query
   *         name: contabilidad
   *         schema:
   *           type: string
   *           enum: [F, A, T]
   *         description: Tipo de contabilidad (F=Fiscal, A=Administrativo, T=Todos)
   *     responses:
   *       200:
   *         description: Reporte generado exitosamente
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
   *                   example: "Reporte generado exitosamente con 150 registros"
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/ReporteResumenAsientos'
   *                 totalRegistros:
   *                   type: integer
   *                   example: 150
   *                 fechaInicio:
   *                   type: string
   *                   format: date-time
   *                 fechaFin:
   *                   type: string
   *                   format: date-time
   *                 conjunto:
   *                   type: string
   *                   example: "ASFSAC"
   *       400:
   *         description: Error en los parámetros de entrada
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
   *                   example: "El conjunto es requerido"
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
   *                   example: "Error al generar reporte: Error de conexión a la base de datos"
   */
  router.get(
    '/:conjunto/resumen',
    QueryOptimizationMiddleware.validateQueryParams,
    (req, res) => controller.obtenerResumenAsientos(req, res)
  );

  /**
   * @swagger
   * /api/resumen-asientos/{conjunto}:
   *   get:
   *     summary: Obtener reporte de resumen de asientos contables (ruta alternativa)
   *     description: Ruta alternativa para generar el reporte de resumen de asientos
   *     tags: [Resumen de Asientos]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *       - in: query
   *         name: fechaInicio
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha de inicio del período (YYYY-MM-DD)
   *       - in: query
   *         name: fechaFin
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha final del período (YYYY-MM-DD)
   *       - in: query
   *         name: tipoAsiento
   *         schema:
   *           type: string
   *         description: Filtro por tipo de asiento específico
   *       - in: query
   *         name: cuentaContable
   *         schema:
   *           type: string
   *         description: Filtro por cuenta contable específica
   *       - in: query
   *         name: centroCosto
   *         schema:
   *           type: string
   *         description: Filtro por centro de costo específico
   *       - in: query
   *         name: usuario
   *         schema:
   *           type: string
   *         description: Filtro por usuario específico
   *       - in: query
   *         name: contabilidad
   *         schema:
   *           type: string
   *           enum: [F, A, T]
   *         description: Tipo de contabilidad (F=Fiscal, A=Administrativo, T=Todos)
   *     responses:
   *       200:
   *         description: Reporte generado exitosamente
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
   *                   example: "Reporte generado exitosamente con 150 registros"
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/ReporteResumenAsientos'
   *                 totalRegistros:
   *                   type: integer
   *                   example: 150
   *                 fechaInicio:
   *                   type: string
   *                   format: date-time
   *                 fechaFin:
   *                   type: string
   *                   format: date-time
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
    (req, res) => controller.obtenerResumenAsientos(req, res)
  );

  return router;
}
