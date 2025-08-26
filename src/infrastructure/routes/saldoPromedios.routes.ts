import { Router } from 'express';
import { container } from '../container/container';
import { TYPES } from '../container/types';
import { SaldoPromediosController } from '../controllers/SaldoPromediosController';

/**
 * @swagger
 * components:
 *   schemas:
 *     CuentaContableOption:
 *       type: object
 *       properties:
 *         cuenta_contable:
 *           type: string
 *           description: Código de la cuenta contable
 *           example: "01.0.0.0.000"
 *         descripcion:
 *           type: string
 *           description: Descripción de la cuenta contable
 *           example: "Clientes"
 *         descripcion_ifrs:
 *           type: string
 *           nullable: true
 *           description: Descripción IFRS de la cuenta
 *           example: "Clientes IFRS"
 *         Uso_restringido:
 *           type: string
 *           description: Indica si la cuenta tiene uso restringido
 *           example: "N"
 *     
 *     FiltroSaldoPromedios:
 *       type: object
 *       properties:
 *         conjunto:
 *           type: string
 *           description: Código del conjunto contable
 *           example: "ASFSAC"
 *         cuenta_contable_desde:
 *           type: string
 *           nullable: true
 *           description: Cuenta contable desde (filtro opcional)
 *           example: "01.0.0.0.000"
 *         cuenta_contable_hasta:
 *           type: string
 *           nullable: true
 *           description: Cuenta contable hasta (filtro opcional)
 *           example: "99.9.9.9.999"
 *         fecha_desde:
 *           type: string
 *           format: date
 *           description: Fecha desde para el reporte
 *           example: "2024-01-01"
 *         fecha_hasta:
 *           type: string
 *           format: date
 *           description: Fecha hasta para el reporte
 *           example: "2024-12-31"
 *         page:
 *           type: integer
 *           minimum: 1
 *           description: Número de página para paginación
 *           example: 1
 *         limit:
 *           type: integer
 *           minimum: 1
 *           maximum: 1000
 *           description: Número de registros por página
 *           example: 25
 *     
 *     SaldoPromediosItem:
 *       type: object
 *       properties:
 *         centro_costo:
 *           type: string
 *           description: Código del centro de costo
 *           example: "ADMIN"
 *         cuenta_contable:
 *           type: string
 *           description: Código de la cuenta contable
 *           example: "01.0.0.0.000"
 *         saldo_inicial_local:
 *           type: number
 *           format: float
 *           description: Saldo inicial en moneda local
 *           example: 1000.50
 *         saldo_inicial_dolar:
 *           type: number
 *           format: float
 *           description: Saldo inicial en dólares
 *           example: 250.75
 *         saldo_inicial_corp_local:
 *           type: number
 *           format: float
 *           description: Saldo inicial corporativo en moneda local
 *           example: 1000.50
 *         saldo_inicial_corp_dolar:
 *           type: number
 *           format: float
 *           description: Saldo inicial corporativo en dólares
 *           example: 250.75
 *         saldo_inicial_fisc_und:
 *           type: number
 *           format: float
 *           description: Saldo inicial fiscal en unidades
 *           example: 100.00
 *         saldo_inicial_corp_und:
 *           type: number
 *           format: float
 *           description: Saldo inicial corporativo en unidades
 *           example: 100.00
 *         debito_fisc_local:
 *           type: number
 *           format: float
 *           description: Débito fiscal en moneda local
 *           example: 500.25
 *         credito_fisc_local:
 *           type: number
 *           format: float
 *           description: Crédito fiscal en moneda local
 *           example: 300.75
 *         debito_fisc_dolar:
 *           type: number
 *           format: float
 *           description: Débito fiscal en dólares
 *           example: 125.50
 *         credito_fisc_dolar:
 *           type: number
 *           format: float
 *           description: Crédito fiscal en dólares
 *           example: 75.25
 *         debito_corp_local:
 *           type: number
 *           format: float
 *           description: Débito corporativo en moneda local
 *           example: 500.25
 *         credito_corp_local:
 *           type: number
 *           format: float
 *           description: Crédito corporativo en moneda local
 *           example: 300.75
 *         debito_corp_dolar:
 *           type: number
 *           format: float
 *           description: Débito corporativo en dólares
 *           example: 125.50
 *         credito_corp_dolar:
 *           type: number
 *           format: float
 *           description: Crédito corporativo en dólares
 *           example: 75.25
 *         debito_fisc_und:
 *           type: number
 *           format: float
 *           description: Débito fiscal en unidades
 *           example: 50.00
 *         credito_fisc_und:
 *           type: number
 *           format: float
 *           description: Crédito fiscal en unidades
 *           example: 30.00
 *         debito_corp_und:
 *           type: number
 *           format: float
 *           description: Débito corporativo en unidades
 *           example: 50.00
 *         credito_corp_und:
 *           type: number
 *           format: float
 *           description: Crédito corporativo en unidades
 *           example: 30.00
 *         saldo_final_local:
 *           type: number
 *           format: float
 *           description: Saldo final en moneda local
 *           example: 1200.00
 *         saldo_final_dolar:
 *           type: number
 *           format: float
 *           description: Saldo final en dólares
 *           example: 300.00
 *         saldo_final_corp_local:
 *           type: number
 *           format: float
 *           description: Saldo final corporativo en moneda local
 *           example: 1200.00
 *         saldo_final_corp_dolar:
 *           type: number
 *           format: float
 *           description: Saldo final corporativo en dólares
 *           example: 300.00
 *         saldo_final_fisc_und:
 *           type: number
 *           format: float
 *           description: Saldo final fiscal en unidades
 *           example: 120.00
 *         saldo_final_corp_und:
 *           type: number
 *           format: float
 *           description: Saldo final corporativo en unidades
 *           example: 120.00
 *         saldo_promedio_local:
 *           type: number
 *           format: float
 *           description: Saldo promedio en moneda local
 *           example: 1100.25
 *         saldo_promedio_dolar:
 *           type: number
 *           format: float
 *           description: Saldo promedio en dólares
 *           example: 275.38
 *         saldo_promedio_corp_local:
 *           type: number
 *           format: float
 *           description: Saldo promedio corporativo en moneda local
 *           example: 1100.25
 *         saldo_promedio_corp_dolar:
 *           type: number
 *           format: float
 *           description: Saldo promedio corporativo en dólares
 *           example: 275.38
 *         saldo_promedio_fisc_und:
 *           type: number
 *           format: float
 *           description: Saldo promedio fiscal en unidades
 *           example: 110.00
 *         saldo_promedio_corp_und:
 *           type: number
 *           format: float
 *           description: Saldo promedio corporativo en unidades
 *           example: 110.00
 *     
 *     PaginationInfo:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           description: Página actual
 *           example: 1
 *         limit:
 *           type: integer
 *           description: Registros por página
 *           example: 25
 *         total:
 *           type: integer
 *           description: Total de registros
 *           example: 1000
 *         totalPages:
 *           type: integer
 *           description: Total de páginas
 *           example: 40
 *         hasNext:
 *           type: boolean
 *           description: Indica si hay página siguiente
 *           example: true
 *         hasPrev:
 *           type: boolean
 *           description: Indica si hay página anterior
 *           example: false
 *     
 *     SaldoPromediosResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indica si la operación fue exitosa
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SaldoPromediosItem'
 *           description: Lista de registros de saldos promedios
 *         pagination:
 *           $ref: '#/components/schemas/PaginationInfo'
 *         message:
 *           type: string
 *           description: Mensaje descriptivo de la operación
 *           example: "Reporte generado exitosamente"
 *     
 *     CuentasContablesResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indica si la operación fue exitosa
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CuentaContableOption'
 *           description: Lista de opciones de cuentas contables
 *         message:
 *           type: string
 *           description: Mensaje descriptivo de la operación
 *           example: "Cuentas contables obtenidas exitosamente"
 */

export function createSaldoPromediosRoutes(): Router {
  const router = Router();
  const saldoPromediosController = container.get<SaldoPromediosController>(TYPES.SaldoPromediosController);

  /**
   * @swagger
   * /api/saldo-promedios/{conjunto}/cuentas-contables:
   *   get:
   *     summary: Obtener opciones de cuentas contables para filtros
   *     description: Retorna la lista de cuentas contables disponibles para el conjunto especificado
   *     tags:
   *       - Saldos Promedios
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
   *               $ref: '#/components/schemas/CuentasContablesResponse'
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
   *     summary: Generar reporte de saldos promedios con paginación
   *     description: Genera un reporte de saldos promedios para el conjunto especificado con filtros y paginación
   *     tags:
   *       - Saldos Promedios
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
   *             $ref: '#/components/schemas/FiltroSaldoPromedios'
   *           example:
   *             conjunto: "ASFSAC"
   *             cuenta_contable_desde: "01.0.0.0.000"
   *             cuenta_contable_hasta: "99.9.9.9.999"
   *             fecha_desde: "2024-01-01"
   *             fecha_hasta: "2024-12-31"
   *             page: 1
   *             limit: 25
   *     responses:
   *       200:
   *         description: Reporte generado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SaldoPromediosResponse'
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
