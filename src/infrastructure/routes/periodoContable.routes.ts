import { Router } from 'express';
import { container } from '../container/container';
import { PeriodoContableController } from '../controllers/PeriodoContableController';

export function createPeriodoContableRoutes(): Router {
  const router = Router();
  const controller = new PeriodoContableController(
    container.get('IPeriodoContableRepository')
  );

  /**
   * @swagger
   * tags:
   *   name: Periodo Contable
   *   description: API para el manejo de periodos contables
   */

  /**
   * @swagger
   * components:
   *   schemas:
   *     CentroCosto:
   *       type: object
   *       properties:
   *         centro_costo:
   *           type: string
   *           description: Código del centro de costo
   *           example: "01.01.01.01.00"
   *         descripcion:
   *           type: string
   *           description: Descripción del centro de costo
   *           example: "Centro de Costo Principal"
   *     
   *     PeriodoContableInfo:
   *       type: object
   *       properties:
   *         FECHA_FINAL:
   *           type: string
   *           format: date
   *           description: Fecha final del periodo
   *           example: "2024-12-31"
   *         DESCRIPCION:
   *           type: string
   *           description: Descripción del periodo
   *           example: "Periodo Diciembre 2024"
   *         CONTABILIDAD:
   *           type: string
   *           description: Tipo de contabilidad
   *           example: "F"
   *         FIN_PERIODO_ANUAL:
   *           type: string
   *           format: date
   *           description: Fecha de fin del periodo anual
   *           example: "2024-12-31"
   *         ESTADO:
   *           type: string
   *           description: Estado del periodo
   *           example: "A"
   *         NoteExistsFlag:
   *           type: boolean
   *           description: Bandera de existencia de notas
   *           example: false
   *         RecordDate:
   *           type: string
   *           format: date-time
   *           description: Fecha de registro
   *           example: "2024-01-01T00:00:00.000Z"
   *         RowPointer:
   *           type: string
   *           description: Puntero único del registro
   *           example: "ABC123"
   *         CreatedBy:
   *           type: string
   *           description: Usuario que creó el registro
   *           example: "ADMIN"
   *         UpdatedBy:
   *           type: string
   *           description: Usuario que actualizó el registro
   *           example: "ADMIN"
   *         CreateDate:
   *           type: string
   *           format: date-time
   *           description: Fecha de creación
   *           example: "2024-01-01T00:00:00.000Z"
   *     
   *     PeriodoContable:
   *       type: object
   *       properties:
   *         centro_costo:
   *           type: string
   *           description: Código del centro de costo
   *           example: "01.01.01.01.00"
   *         cuenta_contable:
   *           type: string
   *           description: Código de la cuenta contable
   *           example: "11000000"
   *         fecha:
   *           type: string
   *           description: Fecha del periodo (YYYYMMDD)
   *           example: "20240101"
   *         saldo_normal:
   *           type: string
   *           description: Tipo de saldo (D=Débito, C=Crédito)
   *           example: "D"
   *         descripcion:
   *           type: string
   *           description: Descripción de la cuenta
   *           example: "Caja"
   *         saldo_inicial_local:
   *           type: number
   *           format: decimal
   *           description: Saldo inicial en moneda local
   *           example: 1000000.00
   *         debito_fisc_local:
   *           type: number
   *           format: decimal
   *           description: Débitos en moneda local
   *           example: 500000.00
   *         credito_fisc_local:
   *           type: number
   *           format: decimal
   *           description: Créditos en moneda local
   *           example: 200000.00
   *         saldo_fisc_local:
   *           type: number
   *           format: decimal
   *           description: Saldo final en moneda local
   *           example: 1300000.00
   *         saldo_inicial_dolar:
   *           type: number
   *           format: decimal
   *           description: Saldo inicial en dólares
   *           example: 250000.00
   *         debito_fisc_dolar:
   *           type: number
   *           format: decimal
   *           description: Débitos en dólares
   *           example: 125000.00
   *         credito_fisc_dolar:
   *           type: number
   *           format: decimal
   *           description: Créditos en dólares
   *           example: 50000.00
   *         saldo_fisc_dolar:
   *           type: number
   *           format: decimal
   *           description: Saldo final en dólares
   *           example: 325000.00
   *         saldo_inicial_und:
   *           type: number
   *           format: decimal
   *           description: Saldo inicial en unidades
   *           example: 1000.00
   *         debito_fisc_und:
   *           type: number
   *           format: decimal
   *           description: Débitos en unidades
   *           example: 500.00
   *         credito_fisc_und:
   *           type: number
   *           format: decimal
   *           description: Créditos en unidades
   *           example: 200.00
   *         saldo_fisc_und:
   *           type: number
   *           format: decimal
   *           description: Saldo final en unidades
   *           example: 1300.00
   *     
   *     FiltroPeriodoContable:
   *       type: object
   *       required:
   *         - fechaDesde
   *         - fechaHasta
   *       properties:
   *         centro_costo:
   *           type: string
   *           description: Código del centro de costo (opcional)
   *           example: "01.01.01.01.00"
   *         fechaDesde:
   *           type: string
   *           format: date
   *           description: Fecha de inicio (YYYY-MM-DD)
   *           example: "2021-01-01"
   *         fechaHasta:
   *           type: string
   *           format: date
   *           description: Fecha de fin (YYYY-MM-DD)
   *           example: "2024-05-12"
   *         saldosAntesCierre:
   *           type: boolean
   *           description: Incluir saldos antes del cierre
   *           example: false
   *         SoloCuentasMovimientos:
   *           type: boolean
   *           description: Solo cuentas con movimientos
   *           example: false
   */

  /**
   * @swagger
   * /api/reporte-periodo-contable/{conjunto}/centros-costo:
   *   get:
   *     summary: Obtener centros de costo
   *     description: Obtiene la lista de centros de costo disponibles para un conjunto específico
   *     tags: [Periodo Contable]
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
   *         description: Centros de costo obtenidos exitosamente
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
   *                     $ref: '#/components/schemas/CentroCosto'
   *                 message:
   *                   type: string
   *                   example: "Centros de costo obtenidos exitosamente"
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  router.get('/:conjunto/centros-costo', (req, res) => {
    controller.obtenerCentrosCosto(req, res);
  });

  /**
   * @swagger
   * /api/reporte-periodo-contable/{conjunto}/periodos:
   *   get:
   *     summary: Obtener periodos contables
   *     description: Obtiene la lista de periodos contables disponibles para un conjunto específico
   *     tags: [Periodo Contable]
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
   *         description: Periodos contables obtenidos exitosamente
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
   *                     $ref: '#/components/schemas/PeriodoContableInfo'
   *                 message:
   *                   type: string
   *                   example: "Periodos contables obtenidos exitosamente"
   *                 total:
   *                   type: integer
   *                   description: Número total de registros
   *                   example: 12
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  router.get('/:conjunto/periodos', (req, res) => {
    controller.obtenerPeriodosContables(req, res);
  });

  /**
   * @swagger
   * /api/reporte-periodo-contable/{conjunto}/generar:
   *   post:
   *     summary: Generar reporte de periodos contables
   *     description: Genera el reporte de periodos contables basado en los filtros proporcionados
   *     tags: [Periodo Contable]
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
   *             $ref: '#/components/schemas/FiltroPeriodoContable'
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
   *                     $ref: '#/components/schemas/PeriodoContable'
   *                 message:
   *                   type: string
   *                   example: "Reporte generado exitosamente"
   *                 total:
   *                   type: integer
   *                   description: Número total de registros en el reporte
   *                   example: 150
   *       400:
   *         description: Parámetros inválidos o faltantes
   *       500:
   *         description: Error interno del servidor
   */
  router.post('/:conjunto/generar', (req, res) => {
    controller.generarReporte(req, res);
  });

  return router;
}
