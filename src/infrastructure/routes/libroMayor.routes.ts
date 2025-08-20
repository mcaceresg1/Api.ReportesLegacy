import { Router } from 'express';
import { container } from '../container/container';
import { LibroMayorController } from '../controllers/LibroMayorController';

const router = Router();
const libroMayorController = container.get<LibroMayorController>('LibroMayorController');

/**
 * @swagger
 * /api/libro-mayor/health:
 *   get:
 *     summary: Verificar estado del servicio
 *     tags: [Libro Mayor]
 *     responses:
 *       200:
 *         description: Servicio funcionando correctamente
 */
router.get('/health', (req, res) => libroMayorController.health(req, res));

/**
 * @swagger
 * /api/libro-mayor/generar:
 *   post:
 *     summary: Generar reporte completo del libro mayor
 *     tags: [Libro Mayor]
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
 *                 example: "PRLTRA"
 *               usuario:
 *                 type: string
 *                 description: Usuario que solicita el reporte
 *                 example: "ADMPQUES"
 *               fechaInicio:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio del período
 *                 example: "2023-01-01"
 *               fechaFin:
 *                 type: string
 *                 format: date
 *                 description: Fecha de fin del período
 *                 example: "2025-07-15"
 *     responses:
 *       200:
 *         description: Reporte generado exitosamente
 *       400:
 *         description: Parámetros inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/generar', (req, res) => libroMayorController.generarReporte(req, res));

/**
 * @swagger
 * /api/libro-mayor/obtener:
 *   get:
 *     summary: Obtener datos del libro mayor con filtros y paginación
 *     tags: [Libro Mayor]
 *     parameters:
 *       - in: query
 *         name: conjunto
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del conjunto contable
 *         example: "PRLTRA"
 *       - in: query
 *         name: usuario
 *         required: true
 *         schema:
 *           type: string
 *         description: Usuario que solicita los datos
 *         example: "ADMPQUES"
 *       - in: query
 *         name: fechaInicio
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del período
 *         example: "2023-01-01"
 *       - in: query
 *         name: fechaFin
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin del período
 *         example: "2025-07-15"
 *       - in: query
 *         name: cuentaContable
 *         schema:
 *           type: string
 *         description: Filtro por cuenta contable
 *         example: "11"
 *       - in: query
 *         name: centroCosto
 *         schema:
 *           type: string
 *         description: Filtro por centro de costo
 *         example: "ADMIN"
 *       - in: query
 *         name: nit
 *         schema:
 *           type: string
 *         description: Filtro por NIT
 *         example: "12345678"
 *       - in: query
 *         name: tipoAsiento
 *         schema:
 *           type: string
 *         description: Filtro por tipo de asiento
 *         example: "FA"
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
 *                         $ref: '#/components/schemas/LibroMayor'
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
router.get('/obtener', (req, res) => libroMayorController.obtenerLibroMayor(req, res));

/**
 * @swagger
 * /api/libro-mayor/exportar-excel:
 *   get:
 *     summary: Exportar libro mayor a Excel
 *     tags: [Libro Mayor]
 *     parameters:
 *       - in: query
 *         name: conjunto
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del conjunto contable
 *         example: "PRLTRA"
 *       - in: query
 *         name: usuario
 *         required: true
 *         schema:
 *           type: string
 *         description: Usuario que solicita la exportación
 *         example: "ADMPQUES"
 *       - in: query
 *         name: fechaInicio
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del período
 *         example: "2023-01-01"
 *       - in: query
 *         name: fechaFin
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin del período
 *         example: "2025-07-15"
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
router.get('/exportar-excel', (req, res) => libroMayorController.exportarExcel(req, res));

export default router;
