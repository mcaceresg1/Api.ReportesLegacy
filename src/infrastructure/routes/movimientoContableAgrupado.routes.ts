import { Router } from 'express';
import { container } from '../container/container';
import { MovimientoContableAgrupadoController } from '../controllers/MovimientoContableAgrupadoController';

export function createMovimientoContableAgrupadoRoutes(): Router {
  const router = Router();
  // ✅ SOLUCIÓN: Usar el container correctamente en lugar de instanciación manual
  const controller = container.get<MovimientoContableAgrupadoController>('MovimientoContableAgrupadoController');

  /**
   * @swagger
   * tags:
   *   name: Movimientos Contables Agrupados
   *   description: API para el manejo del reporte de Movimientos Contables Agrupados por NIT con Dimensión Contable
   */

  /**
   * @swagger
   * components:
   *   schemas:
   *     MovimientoContableAgrupado:
   *       type: object
   *       properties:
   *         sNombreMonLocal:
   *           type: string
   *           description: Nombre de la moneda local
   *           example: "PESO COLOMBIANO"
   *         sNombreMonDolar:
   *           type: string
   *           description: Nombre de la moneda dólar
   *           example: "DOLAR AMERICANO"
   *         sTituloCuenta:
   *           type: string
   *           description: Título de la cuenta
   *           example: "ACTIVOS"
   *         sCuentaContableDesc:
   *           type: string
   *           description: Descripción de la cuenta contable
   *           example: "Efectivo y equivalentes al efectivo"
   *         sTituloNit:
   *           type: string
   *           description: Título del NIT
   *           example: "PROVEEDOR"
   *         sNitNombre:
   *           type: string
   *           description: Nombre o razón social del NIT
   *           example: "EMPRESA EJEMPLO S.A.S."
   *         sReferencia:
   *           type: string
   *           description: Referencia del movimiento
   *           example: "REF-001"
   *         nMontoLocal:
   *           type: number
   *           description: Monto en moneda local
   *           example: 1500000.00
   *         nMontoDolar:
   *           type: number
   *           description: Monto en dólares
   *           example: 375.50
   *         sAsiento:
   *           type: string
   *           description: Número de asiento contable
   *           example: "AS-2024-001"
   *         sCuentaContable:
   *           type: string
   *           description: Código de la cuenta contable
   *           example: "11050501"
   *         sNit:
   *           type: string
   *           description: Número de identificación tributaria
   *           example: "901234567-1"
   *         dtFecha:
   *           type: string
   *           format: date-time
   *           description: Fecha del movimiento
   *           example: "2024-01-15T00:00:00.000Z"
   *         sFuente:
   *           type: string
   *           description: Fuente del movimiento
   *           example: "DIARIO"
   *         sNotas:
   *           type: string
   *           description: Notas del asiento
   *           example: "Compra de materiales"
   *         sDimension:
   *           type: string
   *           description: Código de dimensión contable
   *           example: "DIM001"
   *         sDimensionDesc:
   *           type: string
   *           description: Descripción de la dimensión contable
   *           example: "Centro de Costo Principal"
   *         sQuiebre1:
   *           type: string
   *           description: Primer nivel de quiebre
   *           example: "Q1"
   *         sQuiebre2:
   *           type: string
   *           description: Segundo nivel de quiebre
   *           example: "Q2"
   *         sQuiebre3:
   *           type: string
   *           description: Tercer nivel de quiebre
   *           example: "Q3"
   *         sQuiebreDesc1:
   *           type: string
   *           description: Descripción del primer quiebre
   *           example: "Descripción Quiebre 1"
   *         sQuiebreDesc2:
   *           type: string
   *           description: Descripción del segundo quiebre
   *           example: "Descripción Quiebre 2"
   *         sQuiebreDesc3:
   *           type: string
   *           description: Descripción del tercer quiebre
   *           example: "Descripción Quiebre 3"
   *         ORDEN:
   *           type: number
   *           description: Orden de presentación
   *           example: 2
   *     FiltroMovimientoContableAgrupado:
   *       type: object
   *       required:
   *         - fechaDesde
   *         - fechaHasta
   *       properties:
   *         fechaDesde:
   *           type: string
   *           format: date
   *           description: Fecha de inicio del rango
   *           example: "2024-01-01"
   *         fechaHasta:
   *           type: string
   *           format: date
   *           description: Fecha de fin del rango
   *           example: "2024-12-31"
   *         contabilidad:
   *           type: array
   *           items:
   *             type: string
   *           description: Tipos de contabilidad a incluir
   *           example: ["F", "A"]
   *         cuentaContable:
   *           type: string
   *           description: Filtro por cuenta contable (permite wildcards)
   *           example: "1105"
   *         nit:
   *           type: string
   *           description: Filtro por NIT (permite wildcards)
   *           example: "901234567"
   *         dimension:
   *           type: string
   *           description: Filtro por dimensión contable
   *           example: "DIM001"
   *         asiento:
   *           type: string
   *           description: Filtro por número de asiento
   *           example: "AS-2024"
   *         fuente:
   *           type: string
   *           description: Filtro por fuente del movimiento
   *           example: "DIARIO"
   */

  /**
   * @swagger
   * /api/movimiento-contable-agrupado/health:
   *   get:
   *     summary: Verificar estado del servicio
   *     tags: [Movimientos Contables Agrupados]
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
   *                 message:
   *                   type: string
   *                 timestamp:
   *                   type: string
   *                 healthy:
   *                   type: boolean
   *       500:
   *         description: Error en el servicio
   */
  router.get('/health', (req, res) => controller.health(req, res));

  /**
   * @swagger
   * /api/movimiento-contable-agrupado/{conjunto}/generar:
   *   post:
   *     summary: Generar reporte completo de movimientos contables agrupados
   *     tags: [Movimientos Contables Agrupados]
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
   *             $ref: '#/components/schemas/FiltroMovimientoContableAgrupado'
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
   *                 message:
   *                   type: string
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/MovimientoContableAgrupado'
   *                 total:
   *                   type: number
   *                 filtros:
   *                   $ref: '#/components/schemas/FiltroMovimientoContableAgrupado'
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  router.post('/:conjunto/generar', (req, res) => controller.generarReporte(req, res));

  /**
   * @swagger
   * /api/movimiento-contable-agrupado/{conjunto}/obtener:
   *   post:
   *     summary: Obtener movimientos contables agrupados con paginación
   *     tags: [Movimientos Contables Agrupados]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "ASFSAC"
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
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/FiltroMovimientoContableAgrupado'
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
   *                         $ref: '#/components/schemas/MovimientoContableAgrupado'
   *                     total:
   *                       type: number
   *                     pagina:
   *                       type: number
   *                     porPagina:
   *                       type: number
   *                     totalPaginas:
   *                       type: number
   *                 filtros:
   *                   $ref: '#/components/schemas/FiltroMovimientoContableAgrupado'
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  router.post('/:conjunto/obtener', (req, res) => controller.obtenerMovimientos(req, res));

  /**
   * @swagger
   * /api/movimiento-contable-agrupado/{conjunto}/cuentas-contables:
   *   get:
   *     summary: Obtener cuentas contables para filtros
   *     tags: [Movimientos Contables Agrupados]
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
   *         description: Cuentas contables obtenidas exitosamente
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
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       cuenta_contable:
   *                         type: string
   *                       descripcion:
   *                         type: string
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  router.get('/:conjunto/cuentas-contables', (req, res) => controller.obtenerCuentasContables(req, res));

  /**
   * @swagger
   * /api/movimiento-contable-agrupado/{conjunto}/nits:
   *   get:
   *     summary: Obtener NITs para filtros
   *     tags: [Movimientos Contables Agrupados]
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
   *         description: NITs obtenidos exitosamente
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
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       nit:
   *                         type: string
   *                       razon_social:
   *                         type: string
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  router.get('/:conjunto/nits', (req, res) => controller.obtenerNits(req, res));

  /**
   * @swagger
   * /api/movimiento-contable-agrupado/{conjunto}/dimensiones:
   *   get:
   *     summary: Obtener dimensiones contables para filtros
   *     tags: [Movimientos Contables Agrupados]
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
   *         description: Dimensiones obtenidas exitosamente
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
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       dimension:
   *                         type: string
   *                       dimension_desc:
   *                         type: string
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  router.get('/:conjunto/dimensiones', (req, res) => controller.obtenerDimensiones(req, res));

  /**
   * @swagger
   * /api/movimiento-contable-agrupado/{conjunto}/fuentes:
   *   get:
   *     summary: Obtener fuentes para filtros
   *     tags: [Movimientos Contables Agrupados]
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
   *         description: Fuentes obtenidas exitosamente
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
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       fuente:
   *                         type: string
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  router.get('/:conjunto/fuentes', (req, res) => controller.obtenerFuentes(req, res));

  /**
   * @swagger
   * /api/movimiento-contable-agrupado/{conjunto}/nit/{nit}:
   *   get:
   *     summary: Obtener información completa de un NIT específico
   *     tags: [Movimientos Contables Agrupados]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto
   *       - in: path
   *         name: nit
   *         required: true
   *         schema:
   *           type: string
   *         description: Número de identificación tributaria
   *     responses:
   *       200:
   *         description: NIT obtenido exitosamente
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
   *                   description: Información completa del NIT
   *       404:
   *         description: NIT no encontrado
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  router.get('/:conjunto/nit/:nit', (req, res) => controller.obtenerNitCompleto(req, res));

  /**
   * @swagger
   * /api/movimiento-contable-agrupado/{conjunto}/nits-completos:
   *   get:
   *     summary: Obtener lista completa de NITs con paginación
   *     tags: [Movimientos Contables Agrupados]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Número de página
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 1000
   *           default: 1000
   *         description: Registros por página
   *       - in: query
   *         name: filtro
   *         schema:
   *           type: string
   *         description: Filtro de búsqueda por NIT o razón social
   *     responses:
   *       200:
   *         description: NITs obtenidos exitosamente
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
   *                         type: object
   *                         description: Información completa del NIT
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
  router.get('/:conjunto/nits-completos', (req, res) => controller.obtenerNitsCompletos(req, res));

  /**
   * @swagger
   * /api/movimiento-contable-agrupado/{conjunto}/limpiar:
   *   delete:
   *     summary: Limpiar datos temporales
   *     tags: [Movimientos Contables Agrupados]
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
   *         description: Datos limpiados exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  router.delete('/:conjunto/limpiar', (req, res) => controller.limpiarDatos(req, res));

  return router;
}
