import { Router } from 'express';
import { container } from '../container/container';
import { DiarioContabilidadController } from '../controllers/DiarioContabilidadController';

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
 *           example: 1000.00
 *         DEBITO_DOLAR:
 *           type: number
 *           format: decimal
 *           description: Débito en dólares
 *           example: 250.00
 *         TIPO_ASIENTO:
 *           type: string
 *           description: Código del tipo de asiento
 *           example: "01"
 *         TIPO_REPORTE:
 *           type: string
 *           description: Tipo de reporte (Preliminar/Oficial)
 *           example: "Preliminar"
 *         CONSECUTIVO:
 *           type: string
 *           description: Número consecutivo
 *           example: "000001"
 *         REFERENCIA:
 *           type: string
 *           description: Referencia del movimiento
 *           example: "APERTURA 2024"
 *         TIPO_CAMBIO:
 *           type: number
 *           format: decimal
 *           description: Tipo de cambio
 *           example: 3.75
 *         NOM_USUARIO:
 *           type: string
 *           description: Nombre del usuario
 *           example: "ADMIN"
 *         NIT_NOMBRE:
 *           type: string
 *           description: Razón social del NIT
 *           example: "EMPRESA DEMO S.A.S."
 *         DOCUMENTO:
 *           type: string
 *           description: Número de documento
 *           example: "DOC001"
 *         ASIENTO:
 *           type: string
 *           description: Número de asiento
 *           example: "000001"
 *         TIPO_DOC:
 *           type: string
 *           description: Tipo de documento
 *           example: "FAC"
 *         FINICIO:
 *           type: string
 *           format: date-time
 *           description: Fecha de inicio del período
 *           example: "2024-01-01T00:00:00.000Z"
 *         MODULO:
 *           type: string
 *           description: Módulo de origen
 *           example: "CP"
 *         FFINAL:
 *           type: string
 *           format: date-time
 *           description: Fecha final del período
 *           example: "2024-12-31T23:59:59.000Z"
 *         FUENTE:
 *           type: string
 *           description: Fuente del movimiento
 *           example: "CPDOC001"
 *         FECHA:
 *           type: string
 *           format: date-time
 *           description: Fecha del movimiento
 *           example: "2024-01-15T00:00:00.000Z"
 *         NOTAS:
 *           type: string
 *           description: Notas del asiento
 *           example: "Asiento de apertura del ejercicio contable 2024"
 *         NIT:
 *           type: string
 *           description: Número de identificación tributaria
 *           example: "900123456"
 *         ROW_ORDER_BY:
 *           type: integer
 *           description: Orden de la fila
 *           example: 1
 * 
 *     DiarioContabilidadResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DiarioContabilidad'
 *         total:
 *           type: integer
 *           description: Total de registros
 *           example: 150
 *         pagina:
 *           type: integer
 *           description: Página actual
 *           example: 1
 *         porPagina:
 *           type: integer
 *           description: Registros por página
 *           example: 25
 *         totalPaginas:
 *           type: integer
 *           description: Total de páginas
 *           example: 6
 * 
 *     DiarioContabilidadFiltros:
 *       type: object
 *       required:
 *         - conjunto
 *         - usuario
 *         - fechaInicio
 *         - fechaFin
 *       properties:
 *         conjunto:
 *           type: string
 *           description: Código del conjunto contable
 *           example: "001"
 *         usuario:
 *           type: string
 *           description: Usuario del reporte
 *           example: "ADMIN"
 *         fechaInicio:
 *           type: string
 *           format: date
 *           description: Fecha de inicio del período
 *           example: "2024-01-01"
 *         fechaFin:
 *           type: string
 *           format: date
 *           description: Fecha de fin del período
 *           example: "2024-12-31"
 *         contabilidad:
 *           type: string
 *           description: Tipo de contabilidad
 *           enum: ["F", "A", "F,A"]
 *           default: "F,A"
 *           example: "F"
 *         tipoReporte:
 *           type: string
 *           description: Tipo de reporte
 *           enum: ["Preliminar", "Oficial"]
 *           default: "Preliminar"
 *           example: "Preliminar"
 *         cuentaContable:
 *           type: string
 *           description: Filtro por cuenta contable (búsqueda parcial)
 *           example: "1105"
 *         centroCosto:
 *           type: string
 *           description: Filtro por centro de costo (búsqueda parcial)
 *           example: "001"
 *         nit:
 *           type: string
 *           description: Filtro por NIT (búsqueda parcial)
 *           example: "900123"
 *         tipoAsiento:
 *           type: string
 *           description: Filtro por tipo de asiento
 *           example: "01"
 *         asiento:
 *           type: string
 *           description: Filtro por número de asiento
 *           example: "000001"
 *         origen:
 *           type: string
 *           description: Filtro por origen/módulo
 *           enum: ["CP", "CB", "CC", "FEE", "IC", "CJ"]
 *           example: "CP"
 *         limit:
 *           type: integer
 *           minimum: 1
 *           maximum: 1000
 *           description: Registros por página
 *           example: 25
 *         offset:
 *           type: integer
 *           minimum: 0
 *           description: Offset para paginación
 *           example: 0
 *         page:
 *           type: integer
 *           minimum: 1
 *           description: Número de página
 *           example: 1
 */

export class DiarioContabilidadRoutes {
  private router: Router;
  private controller: DiarioContabilidadController;

  constructor() {
    this.router = Router();
    this.controller = container.get<DiarioContabilidadController>('DiarioContabilidadController');
    this.setupRoutes();
  }

  private setupRoutes(): void {
    /**
     * @swagger
     * /api/diario-contabilidad/health:
     *   get:
     *     summary: Health check del servicio
     *     tags: [Diario de Contabilidad]
     *     responses:
     *       200:
     *         description: Servicio funcionando correctamente
     */
    this.router.get('/health', this.controller.health.bind(this.controller));

    /**
     * @swagger
     * /api/diario-contabilidad/generar:
     *   post:
     *     summary: Genera el reporte de Diario de Contabilidad
     *     tags: [Diario de Contabilidad]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/DiarioContabilidadFiltros'
     *     responses:
     *       200:
     *         description: Reporte generado exitosamente
     *       400:
     *         description: Parámetros inválidos
     *       500:
     *         description: Error interno del servidor
     */
    this.router.post('/generar', this.controller.generarReporte.bind(this.controller));

    /**
     * @swagger
     * /api/diario-contabilidad/obtener:
     *   get:
     *     summary: Obtiene los datos del Diario de Contabilidad
     *     tags: [Diario de Contabilidad]
     *     parameters:
     *       - in: query
     *         name: conjunto
     *         required: true
     *         schema:
     *           type: string
     *         description: Código del conjunto contable
     *       - in: query
     *         name: usuario
     *         required: true
     *         schema:
     *           type: string
     *         description: Usuario del reporte
     *       - in: query
     *         name: fechaInicio
     *         required: true
     *         schema:
     *           type: string
     *           format: date
     *         description: Fecha de inicio
     *       - in: query
     *         name: fechaFin
     *         required: true
     *         schema:
     *           type: string
     *           format: date
     *         description: Fecha de fin
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: Número de página
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           minimum: 1
     *           maximum: 1000
     *         description: Registros por página
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
     *                   $ref: '#/components/schemas/DiarioContabilidadResponse'
     *                 paginacion:
     *                   type: object
     *                   properties:
     *                     pagina:
     *                       type: integer
     *                     porPagina:
     *                       type: integer
     *                     total:
     *                       type: integer
     *                     totalPaginas:
     *                       type: integer
     *       400:
     *         description: Parámetros inválidos
     *       500:
     *         description: Error interno del servidor
     */
    this.router.get('/obtener', this.controller.obtenerDiarioContabilidad.bind(this.controller));

    /**
     * @swagger
     * /api/diario-contabilidad/exportar-excel:
     *   get:
     *     summary: Exporta el Diario de Contabilidad a Excel
     *     tags: [Diario de Contabilidad]
     *     parameters:
     *       - in: query
     *         name: conjunto
     *         required: true
     *         schema:
     *           type: string
     *         description: Código del conjunto contable
     *       - in: query
     *         name: usuario
     *         required: true
     *         schema:
     *           type: string
     *         description: Usuario que exporta
     *       - in: query
     *         name: fechaInicio
     *         required: true
     *         schema:
     *           type: string
     *           format: date
     *         description: Fecha de inicio
     *       - in: query
     *         name: fechaFin
     *         required: true
     *         schema:
     *           type: string
     *           format: date
     *         description: Fecha de fin
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           minimum: 1
     *           maximum: 50000
     *         description: Límite de registros a exportar
     *     responses:
     *       200:
     *         description: Archivo Excel generado
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
    this.router.get('/exportar-excel', this.controller.exportarExcel.bind(this.controller));
  }

  public getRouter(): Router {
    return this.router;
  }
}

// Crear instancia y exportar router
const diarioContabilidadRoutes = new DiarioContabilidadRoutes();
export default diarioContabilidadRoutes.getRouter();
