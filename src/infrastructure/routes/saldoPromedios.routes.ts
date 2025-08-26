import { Router } from 'express';
import { container } from '../container/container';
import { TYPES } from '../container/types';
import { SaldoPromediosController } from '../controllers/SaldoPromediosController';

/**
 * Crea y configura las rutas para el módulo de Saldos Promedios
 * @returns Router configurado con todas las rutas
 */
export function createSaldoPromediosRoutes(): Router {
  const router = Router();
  const saldoPromediosController = container.get<SaldoPromediosController>(TYPES.SaldoPromediosController);

  /**
   * @swagger
   * /api/saldo-promedios/{conjunto}/cuentas-contables:
   *   get:
   *     summary: Obtiene las cuentas contables disponibles para un conjunto
   *     description: Retorna la lista de cuentas contables con sus descripciones para filtrar reportes
   *     tags: [Saldos Promedios]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "ASFSAC"
   *     responses:
   *       200:
   *         description: Lista de cuentas contables obtenida exitosamente
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
   *                     type: object
   *                     properties:
   *                       cuenta_contable:
   *                         type: string
   *                         example: "01.0.0.0.000"
   *                       descripcion:
   *                         type: string
   *                         example: "Clientes"
   *                       descripcion_ifrs:
   *                         type: string
   *                         nullable: true
   *                         example: "Clientes IFRS"
   *                       Uso_restringido:
   *                         type: string
   *                         example: "N"
   *       400:
   *         description: Error en los parámetros de la solicitud
   *       500:
   *         description: Error interno del servidor
   */
  router.get('/:conjunto/cuentas-contables', 
    saldoPromediosController.obtenerCuentasContables.bind(saldoPromediosController)
  );

  /**
   * @swagger
   * /api/saldo-promedios/{conjunto}/generar:
   *   post:
   *     summary: Genera reporte de saldos promedios con paginación
   *     description: Genera un reporte detallado de saldos promedios para un conjunto específico con filtros y paginación
   *     tags: [Saldos Promedios]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "ASFSAC"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - fecha_desde
   *               - fecha_hasta
   *             properties:
   *               fecha_desde:
   *                 type: string
   *                 format: date
   *                 description: Fecha de inicio del período (YYYY-MM-DD)
   *                 example: "2024-01-01"
   *               fecha_hasta:
   *                 type: string
   *                 format: date
   *                 description: Fecha de fin del período (YYYY-MM-DD)
   *                 example: "2024-12-31"
   *               saldosAntesCierre:
   *                 type: boolean
   *                 description: Indica si incluir saldos antes del cierre
   *                 example: false
   *               page:
   *                 type: integer
   *                 minimum: 1
   *                 description: Número de página (empieza en 1)
   *                 example: 1
   *               limit:
   *                 type: integer
   *                 minimum: 1
   *                 maximum: 1000
   *                 description: Número de registros por página
   *                 example: 25
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
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       centro_costo:
   *                         type: string
   *                         example: "ADMIN"
   *                       cuenta_contable:
   *                         type: string
   *                         example: "01.0.0.0.000"
   *                       saldo_inicial_local:
   *                         type: number
   *                         format: float
   *                         example: 1000.00
   *                       saldo_inicial_dolar:
   *                         type: number
   *                         format: float
   *                         example: 250.00
   *                       saldo_inicial_corp_local:
   *                         type: number
   *                         format: float
   *                         example: 1000.00
   *                       saldo_inicial_corp_dolar:
   *                         type: number
   *                         format: float
   *                         example: 250.00
   *                       saldo_inicial_fisc_und:
   *                         type: number
   *                         format: float
   *                         example: 0.00
   *                       saldo_inicial_corp_und:
   *                         type: number
   *                         format: float
   *                         example: 0.00
   *                       debito_fisc_local:
   *                         type: number
   *                         format: float
   *                         example: 500.00
   *                       credito_fisc_local:
   *                         type: number
   *                         format: float
   *                         example: 200.00
   *                       debito_fisc_dolar:
   *                         type: number
   *                         format: float
   *                         example: 125.00
   *                       credito_fisc_dolar:
   *                         type: number
   *                         format: float
   *                         example: 50.00
   *                       debito_corp_local:
   *                         type: number
   *                         format: float
   *                         example: 500.00
   *                       credito_corp_local:
   *                         type: number
   *                         format: float
   *                         example: 200.00
   *                       debito_corp_dolar:
   *                         type: number
   *                         format: float
   *                         example: 125.00
   *                       credito_corp_dolar:
   *                         type: number
   *                         format: float
   *                         example: 50.00
   *                       debito_fisc_und:
   *                         type: number
   *                         format: float
   *                         example: 0.00
   *                       credito_fisc_und:
   *                         type: number
   *                         format: float
   *                         example: 0.00
   *                       debito_corp_und:
   *                         type: number
   *                         format: float
   *                         example: 0.00
   *                       credito_corp_und:
   *                         type: number
   *                         format: float
   *                         example: 0.00
   *                       saldo_final_local:
   *                         type: number
   *                         format: float
   *                         example: 1300.00
   *                       saldo_final_dolar:
   *                         type: number
   *                         format: float
   *                         example: 325.00
   *                       saldo_final_corp_local:
   *                         type: number
   *                         format: float
   *                         example: 1300.00
   *                       saldo_final_corp_dolar:
   *                         type: number
   *                         format: float
   *                         example: 325.00
   *                       saldo_final_fisc_und:
   *                         type: number
   *                         format: float
   *                         example: 0.00
   *                       saldo_final_corp_und:
   *                         type: number
   *                         format: float
   *                         example: 0.00
   *                       saldo_promedio_local:
   *                         type: number
   *                         format: float
   *                         example: 1150.00
   *                       saldo_promedio_dolar:
   *                         type: number
   *                         format: float
   *                         example: 287.50
   *                       saldo_promedio_corp_local:
   *                         type: number
   *                         format: float
   *                         example: 1150.00
   *                       saldo_promedio_corp_dolar:
   *                         type: number
   *                         format: float
   *                         example: 287.50
   *                       saldo_promedio_fisc_und:
   *                         type: number
   *                         format: float
   *                         example: 0.00
   *                       saldo_promedio_corp_und:
   *                         type: number
   *                         format: float
   *                         example: 0.00
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     page:
   *                       type: integer
   *                       description: Página actual
   *                       example: 1
   *                     limit:
   *                       type: integer
   *                       description: Registros por página
   *                       example: 25
   *                     total:
   *                       type: integer
   *                       description: Total de registros disponibles
   *                       example: 1250
   *                     totalPages:
   *                       type: integer
   *                       description: Total de páginas
   *                       example: 50
   *                     hasNext:
   *                       type: boolean
   *                       description: Indica si hay página siguiente
   *                       example: true
   *                     hasPrev:
   *                       type: boolean
   *                       description: Indica si hay página anterior
   *                       example: false
   *                 message:
   *                   type: string
   *                   example: "Reporte generado exitosamente"
   *       400:
   *         description: Error en los parámetros de la solicitud
   *       500:
   *         description: Error interno del servidor
   */
  router.post('/:conjunto/generar', 
    saldoPromediosController.generarReporte.bind(saldoPromediosController)
  );

  return router;
}
