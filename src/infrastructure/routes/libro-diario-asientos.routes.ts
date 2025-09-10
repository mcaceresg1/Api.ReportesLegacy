import { Router } from "express";
import { container } from "../container/container";
import { LibroDiarioAsientosController } from "../controllers/LibroDiarioAsientosController";

const router = Router();
const libroDiarioAsientosController =
  container.get<LibroDiarioAsientosController>("LibroDiarioAsientosController");

/**
 * @swagger
 * components:
 *   schemas:
 *     LibroDiarioAsientos:
 *       type: object
 *       properties:
 *         asiento:
 *           type: string
 *           description: Número del asiento
 *           example: "0700000483"
 *         paquete:
 *           type: string
 *           description: Código del paquete
 *           example: "PAQ001"
 *         descripcion:
 *           type: string
 *           description: Descripción del paquete
 *           example: "Paquete de prueba"
 *         contabilidad:
 *           type: string
 *           description: Tipo de contabilidad
 *           example: "F"
 *         tipo_asiento:
 *           type: string
 *           description: Tipo de asiento
 *           example: "N"
 *         fecha:
 *           type: string
 *           format: date
 *           description: Fecha del asiento
 *           example: "2024-01-15"
 *         origen:
 *           type: string
 *           description: Origen del asiento
 *           example: "01"
 *         documento_global:
 *           type: string
 *           description: Documento global
 *           example: "DOC001"
 *         total_debito_loc:
 *           type: number
 *           description: Total débito en moneda local
 *           example: 1000.00
 *         total_credito_loc:
 *           type: number
 *           description: Total crédito en moneda local
 *           example: 1000.00
 *         total_control_loc:
 *           type: number
 *           description: Total control en moneda local
 *           example: 0.00
 *         diferencia_local:
 *           type: number
 *           description: Diferencia en moneda local (débito - crédito)
 *           example: 0.00
 *         total_debito_dol:
 *           type: number
 *           description: Total débito en dólares
 *           example: 1000.00
 *         total_credito_dol:
 *           type: number
 *           description: Total crédito en dólares
 *           example: 1000.00
 *         total_control_dol:
 *           type: number
 *           description: Total control en dólares
 *           example: 0.00
 *         diferencia_dolar:
 *           type: number
 *           description: Diferencia en dólares (débito - crédito)
 *           example: 0.00
 */

// Health check
router.get(
  "/health",
  libroDiarioAsientosController.health.bind(libroDiarioAsientosController)
);

// Obtener filtros disponibles
router.get(
  "/:conjunto/filtros",
  libroDiarioAsientosController.obtenerFiltros.bind(libroDiarioAsientosController)
);

/**
 * @swagger
 * /api/libro-diario-asientos/{conjunto}/generar:
 *   post:
 *     summary: Genera el reporte de Libro Diario Asientos
 *     tags: [Libro Diario Asientos]
 *     parameters:
 *       - in: path
 *         name: conjunto
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del conjunto contable
 *       - in: query
 *         name: asiento
 *         schema:
 *           type: string
 *         description: Filtro por número de asiento
 *       - in: query
 *         name: tipoAsiento
 *         schema:
 *           type: string
 *         description: Filtro por tipo de asiento
 *       - in: query
 *         name: paquete
 *         schema:
 *           type: string
 *         description: Filtro por código de paquete
 *       - in: query
 *         name: fechaDesde
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha desde (YYYY-MM-DD)
 *       - in: query
 *         name: fechaHasta
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha hasta (YYYY-MM-DD)
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
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/LibroDiarioAsientos'
 *                 message:
 *                   type: string
 *       400:
 *         description: Parámetros inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post(
  "/:conjunto/generar",
  libroDiarioAsientosController.generarReporte.bind(libroDiarioAsientosController)
);

/**
 * @swagger
 * /api/libro-diario-asientos/{conjunto}/obtener:
 *   get:
 *     summary: Obtiene los datos paginados del Libro Diario Asientos
 *     tags: [Libro Diario Asientos]
 *     parameters:
 *       - in: path
 *         name: conjunto
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del conjunto contable
 *       - in: query
 *         name: asiento
 *         schema:
 *           type: string
 *         description: Filtro por número de asiento
 *       - in: query
 *         name: tipoAsiento
 *         schema:
 *           type: string
 *         description: Filtro por tipo de asiento
 *       - in: query
 *         name: paquete
 *         schema:
 *           type: string
 *         description: Filtro por código de paquete
 *       - in: query
 *         name: fechaDesde
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha desde (YYYY-MM-DD)
 *       - in: query
 *         name: fechaHasta
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha hasta (YYYY-MM-DD)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
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
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/LibroDiarioAsientos'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     hasNext:
 *                       type: boolean
 *                     hasPrev:
 *                       type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Parámetros inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.get(
  "/:conjunto/obtener",
  libroDiarioAsientosController.obtenerAsientos.bind(libroDiarioAsientosController)
);

/**
 * @swagger
 * /api/libro-diario-asientos/{conjunto}/exportar-excel:
 *   get:
 *     summary: Exporta el reporte de Libro Diario Asientos a Excel
 *     tags: [Libro Diario Asientos]
 *     parameters:
 *       - in: path
 *         name: conjunto
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del conjunto contable
 *       - in: query
 *         name: asiento
 *         schema:
 *           type: string
 *         description: Filtro por número de asiento
 *       - in: query
 *         name: tipoAsiento
 *         schema:
 *           type: string
 *         description: Filtro por tipo de asiento
 *       - in: query
 *         name: paquete
 *         schema:
 *           type: string
 *         description: Filtro por código de paquete
 *       - in: query
 *         name: fechaDesde
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha desde (YYYY-MM-DD)
 *       - in: query
 *         name: fechaHasta
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha hasta (YYYY-MM-DD)
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
router.get(
  "/:conjunto/exportar-excel",
  libroDiarioAsientosController.exportarExcel.bind(libroDiarioAsientosController)
);

export default router;
