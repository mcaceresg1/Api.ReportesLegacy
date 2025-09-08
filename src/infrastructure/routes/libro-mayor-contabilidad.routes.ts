import { Router } from 'express';
import { container } from '../container/container';
import { LibroMayorContabilidadController } from '../controllers/LibroMayorContabilidadController';

const router = Router();
const libroMayorContabilidadController = container.get<LibroMayorContabilidadController>('LibroMayorContabilidadController');

/**
 * @swagger
 * components:
 *   schemas:
 *     LibroMayorContabilidad:
 *       type: object
 *       properties:
 *         saldo_acreedor_dolar:
 *           type: number
 *           description: Saldo acreedor en dólares
 *           example: 1000.00
 *         credito_dolar_mayor:
 *           type: number
 *           description: Crédito dólar mayor
 *           example: 1000.00
 *         correlativo_asiento:
 *           type: string
 *           description: Correlativo del asiento
 *           example: "001"
 *         saldo_deudor_dolar:
 *           type: number
 *           description: Saldo deudor en dólares
 *           example: 1000.00
 *         debito_dolar_mayor:
 *           type: number
 *           description: Débito dólar mayor
 *           example: 1000.00
 *         cuenta_contable:
 *           type: string
 *           description: Cuenta contable
 *           example: "01.0.0.0.000"
 *         saldo_acreedor:
 *           type: number
 *           description: Saldo acreedor
 *           example: 1000.00
 *         credito_dolar:
 *           type: number
 *           description: Crédito en dólares
 *           example: 1000.00
 *         credito_local:
 *           type: number
 *           description: Crédito en moneda local
 *           example: 1000.00
 *         saldo_deudor:
 *           type: number
 *           description: Saldo deudor
 *           example: 1000.00
 *         debito_dolar:
 *           type: number
 *           description: Débito en dólares
 *           example: 1000.00
 *         debito_local:
 *           type: number
 *           description: Débito en moneda local
 *           example: 1000.00
 *         centro_costo:
 *           type: string
 *           description: Centro de costo
 *           example: "001"
 *         tipo_asiento:
 *           type: string
 *           description: Tipo de asiento
 *           example: "N"
 *         descripcion:
 *           type: string
 *           description: Descripción
 *           example: "Descripción del asiento"
 *         consecutivo:
 *           type: number
 *           description: Consecutivo
 *           example: 1
 *         referencia:
 *           type: string
 *           description: Referencia
 *           example: "REF001"
 *         nit_nombre:
 *           type: string
 *           description: Nombre del NIT
 *           example: "Empresa ABC"
 *         documento:
 *           type: string
 *           description: Documento
 *           example: "DOC001"
 *         credito:
 *           type: number
 *           description: Crédito
 *           example: 1000.00
 *         asiento:
 *           type: string
 *           description: Asiento
 *           example: "000001"
 *         debito:
 *           type: number
 *           description: Débito
 *           example: 1000.00
 *         fecha:
 *           type: string
 *           format: date
 *           description: Fecha
 *           example: "2023-01-01"
 *         tipo:
 *           type: string
 *           description: Tipo
 *           example: "CP"
 *         nit:
 *           type: string
 *           description: NIT
 *           example: "12345678"
 *         fuente:
 *           type: string
 *           description: Fuente
 *           example: "FAC001"
 *         periodo_contable:
 *           type: string
 *           format: date
 *           description: Período contable
 *           example: "2023-01-01"
 *         tipo_linea:
 *           type: number
 *           description: Tipo de línea
 *           example: 1
 *     
 *     FiltrosLibroMayorContabilidad:
 *       type: object
 *       required:
 *         - conjunto
 *         - fechaDesde
 *         - fechaHasta
 *       properties:
 *         conjunto:
 *           type: string
 *           description: Código del conjunto contable
 *           example: "PRLTRA"
 *         fechaDesde:
 *           type: string
 *           format: date
 *           description: Fecha de inicio
 *           example: "2023-01-01"
 *         fechaHasta:
 *           type: string
 *           format: date
 *           description: Fecha de fin
 *           example: "2025-07-15"
 *         cuentaContableDesde:
 *           type: string
 *           description: Cuenta contable desde
 *           example: "01"
 *         cuentaContableHasta:
 *           type: string
 *           description: Cuenta contable hasta
 *           example: "99"
 *         centroCosto:
 *           type: string
 *           description: Centro de costo
 *           example: "001"
 *         tipoAsiento:
 *           type: string
 *           description: Tipo de asiento
 *           example: "N"
 *         origen:
 *           type: string
 *           description: Origen del asiento
 *           example: "CP"
 *         contabilidad:
 *           type: string
 *           description: Tipo de contabilidad
 *           example: "F"
 *         claseAsiento:
 *           type: string
 *           description: Clase de asiento
 *           example: "N"
 *         limit:
 *           type: integer
 *           description: Límite de registros
 *           example: 1000
 *     
 *     CuentaContableInfo:
 *       type: object
 *       properties:
 *         cuenta_contable:
 *           type: string
 *           description: Código de la cuenta contable
 *           example: "01.0.0.0.000"
 *         descripcion:
 *           type: string
 *           description: Descripción de la cuenta
 *           example: "Activos"
 *         saldo_normal:
 *           type: string
 *           description: Saldo normal (D=Débito, C=Crédito)
 *           example: "D"
 *         acepta_datos:
 *           type: string
 *           description: Acepta datos (S=Sí, N=No)
 *           example: "S"
 *     
 *     PeriodoContableInfo:
 *       type: object
 *       properties:
 *         fecha_final:
 *           type: string
 *           format: date
 *           description: Fecha final del período
 *           example: "2023-12-31"
 *         descripcion:
 *           type: string
 *           description: Descripción del período
 *           example: "Diciembre 2023"
 *         contabilidad:
 *           type: string
 *           description: Tipo de contabilidad
 *           example: "F"
 *         estado:
 *           type: string
 *           description: Estado del período
 *           example: "A"
 */

/**
 * @swagger
 * tags:
 *   name: Libro Mayor de Contabilidad
 *   description: API para el manejo del Libro Mayor de Contabilidad
 */

/**
 * @swagger
 * /api/libro-mayor-contabilidad/health:
 *   get:
 *     summary: Health check para Libro Mayor de Contabilidad
 *     tags: [Libro Mayor de Contabilidad]
 *     responses:
 *       200:
 *         description: Servicio funcionando correctamente
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
 *                   example: "Libro Mayor de Contabilidad service is running"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-01-01T00:00:00.000Z"
 */
router.get('/health', (req, res) => {
  libroMayorContabilidadController.healthCheck(req, res);
});

/**
 * @swagger
 * /api/libro-mayor-contabilidad/{conjunto}/cuentas-contables:
 *   get:
 *     summary: Obtener cuentas contables disponibles
 *     tags: [Libro Mayor de Contabilidad]
 *     parameters:
 *       - in: path
 *         name: conjunto
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del conjunto contable
 *         example: "PRLTRA"
 *     responses:
 *       200:
 *         description: Cuentas contables obtenidas exitosamente
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
 *                     $ref: '#/components/schemas/CuentaContableInfo'
 *                 message:
 *                   type: string
 *                   example: "Cuentas contables obtenidas exitosamente"
 *                 total:
 *                   type: integer
 *                   example: 10
 *       400:
 *         description: Parámetros inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:conjunto/cuentas-contables', (req, res) => {
  libroMayorContabilidadController.obtenerCuentasContables(req, res);
});

/**
 * @swagger
 * /api/libro-mayor-contabilidad/{conjunto}/periodos-contables:
 *   get:
 *     summary: Obtener períodos contables disponibles
 *     tags: [Libro Mayor de Contabilidad]
 *     parameters:
 *       - in: path
 *         name: conjunto
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del conjunto contable
 *         example: "PRLTRA"
 *     responses:
 *       200:
 *         description: Períodos contables obtenidos exitosamente
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
 *                   example: "Períodos contables obtenidos exitosamente"
 *                 total:
 *                   type: integer
 *                   example: 12
 *       400:
 *         description: Parámetros inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:conjunto/periodos-contables', (req, res) => {
  libroMayorContabilidadController.obtenerPeriodosContables(req, res);
});

/**
 * @swagger
 * /api/libro-mayor-contabilidad/{conjunto}/generar:
 *   post:
 *     summary: Generar reporte de Libro Mayor de Contabilidad
 *     tags: [Libro Mayor de Contabilidad]
 *     parameters:
 *       - in: path
 *         name: conjunto
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del conjunto contable
 *         example: "PRLTRA"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FiltrosLibroMayorContabilidad'
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
 *                     $ref: '#/components/schemas/LibroMayorContabilidad'
 *                 message:
 *                   type: string
 *                   example: "Reporte generado exitosamente"
 *                 total:
 *                   type: integer
 *                   example: 150
 *       400:
 *         description: Parámetros inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/:conjunto/generar', (req, res) => {
  libroMayorContabilidadController.generarReporte(req, res);
});

/**
 * @swagger
 * /api/libro-mayor-contabilidad/{conjunto}/obtener:
 *   post:
 *     summary: Obtener reporte de Libro Mayor de Contabilidad con paginación
 *     tags: [Libro Mayor de Contabilidad]
 *     parameters:
 *       - in: path
 *         name: conjunto
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del conjunto contable
 *         example: "PRLTRA"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             allOf:
 *               - $ref: '#/components/schemas/FiltrosLibroMayorContabilidad'
 *               - type: object
 *                 properties:
 *                   page:
 *                     type: integer
 *                     description: Número de página
 *                     example: 1
 *                   pageSize:
 *                     type: integer
 *                     description: Tamaño de página
 *                     example: 100
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
 *                     $ref: '#/components/schemas/LibroMayorContabilidad'
 *                 message:
 *                   type: string
 *                   example: "Reporte obtenido exitosamente"
 *                 total:
 *                   type: integer
 *                   example: 150
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       example: 100
 *                     totalRecords:
 *                       type: integer
 *                       example: 150
 *                     totalPages:
 *                       type: integer
 *                       example: 2
 *       400:
 *         description: Parámetros inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/:conjunto/obtener', (req, res) => {
  libroMayorContabilidadController.obtenerLibroMayorContabilidad(req, res);
});

/**
 * @swagger
 * /api/libro-mayor-contabilidad/{conjunto}/exportar-excel:
 *   post:
 *     summary: Exportar reporte de Libro Mayor de Contabilidad a Excel
 *     tags: [Libro Mayor de Contabilidad]
 *     parameters:
 *       - in: path
 *         name: conjunto
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del conjunto contable
 *         example: "PRLTRA"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FiltrosLibroMayorContabilidad'
 *     responses:
 *       200:
 *         description: Archivo Excel generado exitosamente
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Parámetros inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/:conjunto/exportar-excel', (req, res) => {
  libroMayorContabilidadController.exportarExcel(req, res);
});

/**
 * @swagger
 * /api/libro-mayor-contabilidad/{conjunto}/exportar-pdf:
 *   post:
 *     summary: Exportar reporte de Libro Mayor de Contabilidad a PDF
 *     tags: [Libro Mayor de Contabilidad]
 *     parameters:
 *       - in: path
 *         name: conjunto
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del conjunto contable
 *         example: "PRLTRA"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FiltrosLibroMayorContabilidad'
 *     responses:
 *       200:
 *         description: Archivo PDF generado exitosamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Parámetros inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/:conjunto/exportar-pdf', (req, res) => {
  libroMayorContabilidadController.exportarPDF(req, res);
});

export default router;
