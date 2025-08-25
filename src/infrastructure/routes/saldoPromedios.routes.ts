import { Router } from 'express';
import { container } from '../container/container';
import { SaldoPromediosController } from '../controllers/SaldoPromediosController';

export function createSaldoPromediosRoutes(): Router {
  const router = Router();
  
  // Obtener instancia del controlador usando el contenedor
  const saldoPromediosController = container.get<SaldoPromediosController>('SaldoPromediosController');

  /**
   * @swagger
   * /api/saldo-promedios/{conjunto}/cuentas-contables:
   *   get:
   *     summary: Obtener lista de cuentas contables para filtros
   *     description: Retorna todas las cuentas contables disponibles para el conjunto especificado
   *     tags: [Saldo Promedios]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
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
   *                     $ref: '#/components/schemas/CuentaContableOption'
   *       400:
   *         description: Parámetros inválidos
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
   *     summary: Generar reporte de saldos promedios
   *     description: Genera el reporte completo de saldos promedios según los filtros especificados
   *     tags: [Saldo Promedios]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/FiltroSaldoPromedios'
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
   *                     $ref: '#/components/schemas/SaldoPromediosItem'
   *                 total:
   *                   type: integer
   *                   description: Total de registros generados
   *                 message:
   *                   type: string
   *                   example: Reporte generado exitosamente
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  router.post('/:conjunto/generar', 
    saldoPromediosController.generarReporte.bind(saldoPromediosController)
  );

  /**
   * @swagger
   * /api/saldo-promedios/{conjunto}/reporte:
   *   post:
   *     summary: Obtener reporte paginado de saldos promedios
   *     description: Obtiene el reporte de saldos promedios con paginación opcional
   *     tags: [Saldo Promedios]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *       - in: query
   *         name: pagina
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Número de página
   *       - in: query
   *         name: limite
   *         schema:
   *           type: integer
   *           default: 50
   *         description: Número de registros por página
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/FiltroSaldoPromedios'
   *     responses:
   *       200:
   *         description: Reporte obtenido exitosamente
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
   *                     $ref: '#/components/schemas/SaldoPromediosItem'
   *                 total:
   *                   type: integer
   *                   description: Total de registros disponibles
   *                 pagina:
   *                   type: integer
   *                   description: Página actual
   *                 limite:
   *                   type: integer
   *                   description: Registros por página
   *                 message:
   *                   type: string
   *                   example: Reporte obtenido exitosamente
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  router.post('/:conjunto/reporte', 
    saldoPromediosController.obtenerReporte.bind(saldoPromediosController)
  );

  /**
   * @swagger
   * /api/saldo-promedios/limpiar:
   *   delete:
   *     summary: Limpiar datos temporales
   *     description: Limpia cualquier dato temporal generado por el reporte
   *     tags: [Saldo Promedios]
   *     responses:
   *       200:
   *         description: Datos limpiados exitosamente
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
   *                   example: Datos limpiados exitosamente
   *       500:
   *         description: Error interno del servidor
   */
  router.delete('/limpiar', 
    saldoPromediosController.limpiarDatos.bind(saldoPromediosController)
  );

  return router;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     SaldoPromediosItem:
 *       type: object
 *       properties:
 *         centro_costo:
 *           type: string
 *           description: Código del centro de costo
 *           example: "01.01.01.00.00"
 *         cuenta_contable:
 *           type: string
 *           description: Código de la cuenta contable
 *           example: "01.1.1.1.001"
 *         descripcion:
 *           type: string
 *           description: Descripción de la cuenta contable
 *           example: "Caja"
 *         descripcion_ifrs:
 *           type: string
 *           description: Descripción IFRS de la cuenta
 *         uso_restringido:
 *           type: string
 *           description: Indicador de uso restringido
 *         saldo_inicial_local:
 *           type: number
 *           format: double
 *           description: Saldo inicial en moneda local
 *           example: 1000.00
 *         saldo_inicial_dolar:
 *           type: number
 *           format: double
 *           description: Saldo inicial en dólares
 *           example: 250.00
 *         saldo_inicial_corp_local:
 *           type: number
 *           format: double
 *           description: Saldo inicial corporativo en moneda local
 *         saldo_inicial_corp_dolar:
 *           type: number
 *           format: double
 *           description: Saldo inicial corporativo en dólares
 *         saldo_inicial_fisc_und:
 *           type: number
 *           format: double
 *           description: Saldo inicial fiscal en unidades
 *         saldo_inicial_corp_und:
 *           type: number
 *           format: double
 *           description: Saldo inicial corporativo en unidades
 *         debito_fisc_local:
 *           type: number
 *           format: double
 *           description: Débito fiscal en moneda local
 *           example: 500.00
 *         credito_fisc_local:
 *           type: number
 *           format: double
 *           description: Crédito fiscal en moneda local
 *           example: 300.00
 *         debito_fisc_dolar:
 *           type: number
 *           format: double
 *           description: Débito fiscal en dólares
 *         credito_fisc_dolar:
 *           type: number
 *           format: double
 *           description: Crédito fiscal en dólares
 *         debito_corp_local:
 *           type: number
 *           format: double
 *           description: Débito corporativo en moneda local
 *         credito_corp_local:
 *           type: number
 *           format: double
 *           description: Crédito corporativo en moneda local
 *         debito_corp_dolar:
 *           type: number
 *           format: double
 *           description: Débito corporativo en dólares
 *         credito_corp_dolar:
 *           type: number
 *           format: double
 *           description: Crédito corporativo en dólares
 *         debito_fisc_und:
 *           type: number
 *           format: double
 *           description: Débito fiscal en unidades
 *         credito_fisc_und:
 *           type: number
 *           format: double
 *           description: Crédito fiscal en unidades
 *         debito_corp_und:
 *           type: number
 *           format: double
 *           description: Débito corporativo en unidades
 *         credito_corp_und:
 *           type: number
 *           format: double
 *           description: Crédito corporativo en unidades
 *         saldo_final_local:
 *           type: number
 *           format: double
 *           description: Saldo final en moneda local
 *           example: 1200.00
 *         saldo_final_dolar:
 *           type: number
 *           format: double
 *           description: Saldo final en dólares
 *           example: 300.00
 *         saldo_final_corp_local:
 *           type: number
 *           format: double
 *           description: Saldo final corporativo en moneda local
 *         saldo_final_corp_dolar:
 *           type: number
 *           format: double
 *           description: Saldo final corporativo en dólares
 *         saldo_final_fisc_und:
 *           type: number
 *           format: double
 *           description: Saldo final fiscal en unidades
 *         saldo_final_corp_und:
 *           type: number
 *           format: double
 *           description: Saldo final corporativo en unidades
 *         saldo_promedio_local:
 *           type: number
 *           format: double
 *           description: Saldo promedio en moneda local
 *           example: 1100.00
 *         saldo_promedio_dolar:
 *           type: number
 *           format: double
 *           description: Saldo promedio en dólares
 *           example: 275.00
 *         saldo_promedio_corp_local:
 *           type: number
 *           format: double
 *           description: Saldo promedio corporativo en moneda local
 *         saldo_promedio_corp_dolar:
 *           type: number
 *           format: double
 *           description: Saldo promedio corporativo en dólares
 *         saldo_promedio_fisc_und:
 *           type: number
 *           format: double
 *           description: Saldo promedio fiscal en unidades
 *         saldo_promedio_corp_und:
 *           type: number
 *           format: double
 *           description: Saldo promedio corporativo en unidades
 *       required:
 *         - centro_costo
 *         - cuenta_contable
 *         - saldo_inicial_local
 *         - saldo_inicial_dolar
 *         - debito_fisc_local
 *         - credito_fisc_local
 *         - saldo_final_local
 *         - saldo_final_dolar
 *         - saldo_promedio_local
 *         - saldo_promedio_dolar
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
 *           description: Código de cuenta contable desde
 *           example: "00.0.0.0.000"
 *         cuenta_contable_hasta:
 *           type: string
 *           description: Código de cuenta contable hasta
 *           example: "ZZ.Z.Z.Z.ZZZ"
 *         fecha_desde:
 *           type: string
 *           format: date
 *           description: Fecha desde para el reporte
 *           example: "2019-01-01"
 *         fecha_hasta:
 *           type: string
 *           format: date
 *           description: Fecha hasta para el reporte
 *           example: "2023-12-31"
 *         saldosAntesCierre:
 *           type: boolean
 *           description: Incluir saldos antes del cierre
 *           example: true
 *       required:
 *         - conjunto
 *         - fecha_desde
 *         - fecha_hasta
 *     
 *     CuentaContableOption:
 *       type: object
 *       properties:
 *         cuenta_contable:
 *           type: string
 *           description: Código de la cuenta contable
 *           example: "01.1.1.1.001"
 *         descripcion:
 *           type: string
 *           description: Descripción de la cuenta contable
 *           example: "Caja"
 *         descripcion_ifrs:
 *           type: string
 *           description: Descripción IFRS de la cuenta
 *         uso_restringido:
 *           type: string
 *           description: Indicador de uso restringido
 *       required:
 *         - cuenta_contable
 *         - descripcion
 */
