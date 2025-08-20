import { Router } from 'express';
import { container } from '../container/container';
import { DiarioContabilidadController } from '../controllers/DiarioContabilidadController';

export function createDiarioContabilidadRoutes(): Router {
  const router = Router();
  const controller = new DiarioContabilidadController(
    container.get('IDiarioContabilidadRepository')
  );

  /**
   * @swagger
   * tags:
   *   name: Diario de Contabilidad
   *   description: API para el manejo del reporte de Diario de Contabilidad
   */

  /**
   * @swagger
   * components:
   *   schemas:
   *     DiarioContabilidad:
   *       type: object
   *       properties:
   *         CUENTA_CONTABLE_DESC:
   *           type: string
   *           description: Descripción de la cuenta contable
   *           example: "CAJA GENERAL"
   *         CORRELATIVO_ASIENTO:
   *           type: string
   *           description: Correlativo del asiento
   *           example: "001"
   *         SDESC_TIPO_ASIENTO:
   *           type: string
   *           description: Descripción del tipo de asiento
   *           example: "ASIENTO DE APERTURA"
   *         CUENTA_CONTABLE:
   *           type: string
   *           description: Código de la cuenta contable
   *           example: "1105001"
   *         CREDITO_LOCAL:
   *           type: number
   *           format: decimal
   *           description: Crédito en moneda local
   *           example: 0.00
   *         CREDITO_DOLAR:
   *           type: number
   *           format: decimal
   *           description: Crédito en dólares
   *           example: 0.00
   *         CENTRO_COSTO:
   *           type: string
   *           description: Código del centro de costo
   *           example: "001"
   *         DEBITO_LOCAL:
   *           type: number
   *           format: decimal
   *           description: Débito en moneda local
   *           example: 1000000.00
   *         DEBITO_DOLAR:
   *           type: number
   *           format: decimal
   *           description: Débito en dólares
   *           example: 0.00
   *         FECHA_ASIENTO:
   *           type: string
   *           format: date
   *           description: Fecha del asiento
   *           example: "2023-01-01"
   *         ASIENTO:
   *           type: string
   *           description: Número del asiento
   *           example: "000001"
   *         NIT:
   *           type: string
   *           description: NIT del tercero
   *           example: "900123456"
   *         TIPO_ASIENTO:
   *           type: string
   *           description: Tipo de asiento
   *           example: "AA"
   *         DETALLE:
   *           type: string
   *           description: Detalle del asiento
   *           example: "APERTURA DE CUENTAS"
   */

  /**
   * @swagger
   * /api/diario-contabilidad/health:
   *   get:
   *     summary: Verificar estado del servicio
   *     tags: [Diario de Contabilidad]
   *     responses:
   *       200:
   *         description: Servicio funcionando correctamente
   */
  router.get('/health', (req, res) => controller.health(req, res));

  /**
   * @swagger
   * /api/diario-contabilidad/generar:
   *   post:
   *     summary: Generar reporte de Diario de Contabilidad
   *     tags: [Diario de Contabilidad]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - conjunto
   *               - usuario
   *               - fechaInicio
   *               - fechaFin
   *             properties:
   *               conjunto:
   *                 type: string
   *                 description: Código del conjunto contable
   *                 example: "ASFSAC"
   *               usuario:
   *                 type: string
   *                 description: Usuario que solicita el reporte
   *                 example: "ADMIN"
   *               fechaInicio:
   *                 type: string
   *                 format: date
   *                 description: Fecha de inicio del período
   *                 example: "2024-01-01"
   *               fechaFin:
   *                 type: string
   *                 format: date
   *                 description: Fecha de fin del período
   *                 example: "2024-12-31"
   *               contabilidad:
   *                 type: string
   *                 description: Tipo de contabilidad
   *                 enum: ["F", "F,A"]
   *                 default: "F,A"
   *                 example: "F"
   *               tipoReporte:
   *                 type: string
   *                 description: Tipo de reporte
   *                 enum: ["Preliminar", "Oficial"]
   *                 default: "Preliminar"
   *                 example: "Preliminar"
   *     responses:
   *       200:
   *         description: Reporte generado exitosamente
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  router.post('/generar', (req, res) => controller.generarReporte(req, res));

  /**
   * @swagger
   * /api/diario-contabilidad/obtener:
   *   get:
   *     summary: Obtener datos del Diario de Contabilidad con filtros y paginación
   *     tags: [Diario de Contabilidad]
   *     parameters:
   *       - in: query
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "ASFSAC"
   *       - in: query
   *         name: usuario
   *         required: true
   *         schema:
   *           type: string
   *         description: Usuario que solicita los datos
   *         example: "ADMIN"
   *       - in: query
   *         name: fechaInicio
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha de inicio del período
   *         example: "2024-01-01"
   *       - in: query
   *         name: fechaFin
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha de fin del período
   *         example: "2024-12-31"
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Número de página
   *         example: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 100
   *           maximum: 1000
   *         description: Registros por página
   *         example: 100
   *     responses:
   *       200:
   *         description: Datos obtenidos exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     data:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/DiarioContabilidad'
   *                     total:
   *                       type: integer
   *                     pagina:
   *                       type: integer
   *                     porPagina:
   *                       type: integer
   *                     totalPaginas:
   *                       type: integer
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  router.get('/obtener', (req, res) => controller.obtenerDiarioContabilidad(req, res));

  /**
   * @swagger
   * /api/diario-contabilidad/exportar-excel:
   *   get:
   *     summary: Exportar Diario de Contabilidad a Excel
   *     tags: [Diario de Contabilidad]
   *     parameters:
   *       - in: query
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "ASFSAC"
   *       - in: query
   *         name: usuario
   *         required: true
   *         schema:
   *           type: string
   *         description: Usuario que solicita la exportación
   *         example: "ADMIN"
   *       - in: query
   *         name: fechaInicio
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha de inicio del período
   *         example: "2024-01-01"
   *       - in: query
   *         name: fechaFin
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha de fin del período
   *         example: "2024-12-31"
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 1000
   *           maximum: 10000
   *         description: Límite de registros a exportar
   *         example: 1000
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
  router.get('/exportar-excel', (req, res) => controller.exportarExcel(req, res));

  return router;
}