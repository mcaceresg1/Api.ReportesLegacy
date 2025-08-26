import { Router } from 'express';
import { LibroMayorController } from '../controllers/LibroMayorController';
import { container } from '../container/container';

const router = Router();
const libroMayorController = container.get<LibroMayorController>('LibroMayorController');

/**
 * @swagger
 * /api/libro-mayor/generar:
 *   post:
 *     summary: Generar reporte de Libro Mayor
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
 *               usuario:
 *                 type: string
 *                 description: Usuario que solicita el reporte
 *               fechaInicio:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio del período
 *               fechaFin:
 *                 type: string
 *                 format: date
 *                 description: Fecha de fin del período
 *               cuentaContableDesde:
 *                 type: string
 *                 description: Cuenta contable desde (opcional)
 *               cuentaContableHasta:
 *                 type: string
 *                 description: Cuenta contable hasta (opcional)
 *               saldoAntesCierre:
 *                 type: boolean
 *                 description: Incluir saldos antes del cierre
 *               page:
 *                 type: integer
 *                 description: Número de página
 *               limit:
 *                 type: integer
 *                 description: Registros por página
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
 *                     type: object
 *                     properties:
 *                       cuentaContable:
 *                         type: string
 *                       centroCosto:
 *                         type: string
 *                       descripcion:
 *                         type: string
 *                       saldoNormal:
 *                         type: string
 *                       fecha:
 *                         type: string
 *                       fechaCreacion:
 *                         type: string
 *                       tipo:
 *                         type: string
 *                       debitoLocal:
 *                         type: number
 *                       creditoLocal:
 *                         type: number
 *                       saldoInicialLocal:
 *                         type: number
 *                       saldoFinalLocal:
 *                         type: number
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       400:
 *         description: Parámetros requeridos faltantes
 *       500:
 *         description: Error interno del servidor
 */
router.post('/generar', libroMayorController.generarReporte.bind(libroMayorController));

/**
 * @swagger
 * /api/libro-mayor/obtener:
 *   get:
 *     summary: Obtener datos del Libro Mayor
 *     tags: [Libro Mayor]
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
 *         description: Usuario que solicita el reporte
 *       - in: query
 *         name: fechaInicio
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del período
 *       - in: query
 *         name: fechaFin
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin del período
 *       - in: query
 *         name: cuentaContableDesde
 *         schema:
 *           type: string
 *         description: Cuenta contable desde (opcional)
 *       - in: query
 *         name: cuentaContableHasta
 *         schema:
 *           type: string
 *         description: Cuenta contable hasta (opcional)
 *       - in: query
 *         name: saldoAntesCierre
 *         schema:
 *           type: boolean
 *         description: Incluir saldos antes del cierre
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Registros por página
 *     responses:
 *       200:
 *         description: Datos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LibroMayorResponse'
 *       400:
 *         description: Parámetros requeridos faltantes
 *       500:
 *         description: Error interno del servidor
 */
router.get('/obtener', libroMayorController.obtenerLibroMayor.bind(libroMayorController));

/**
 * @swagger
 * /api/libro-mayor/exportar-excel:
 *   get:
 *     summary: Exportar Libro Mayor a Excel
 *     tags: [Libro Mayor]
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
 *         description: Usuario que solicita el reporte
 *       - in: query
 *         name: fechaInicio
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del período
 *       - in: query
 *         name: fechaFin
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin del período
 *       - in: query
 *         name: cuentaContableDesde
 *         schema:
 *           type: string
 *         description: Cuenta contable desde (opcional)
 *       - in: query
 *         name: cuentaContableHasta
 *         schema:
 *           type: string
 *         description: Cuenta contable hasta (opcional)
 *       - in: query
 *         name: saldoAntesCierre
 *         schema:
 *           type: boolean
 *         description: Incluir saldos antes del cierre
 *     responses:
 *       200:
 *         description: Archivo Excel generado exitosamente
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Parámetros requeridos faltantes
 *       500:
 *         description: Error interno del servidor
 */
router.get('/exportar-excel', libroMayorController.exportarExcel.bind(libroMayorController));

/**
 * @swagger
 * /api/libro-mayor/exportar-pdf:
 *   get:
 *     summary: Exportar Libro Mayor a PDF
 *     tags: [Libro Mayor]
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
 *         description: Usuario que solicita el reporte
 *       - in: query
 *         name: fechaInicio
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del período
 *       - in: query
 *         name: fechaFin
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin del período
 *       - in: query
 *         name: cuentaContableDesde
 *         schema:
 *           type: string
 *         description: Cuenta contable desde (opcional)
 *       - in: query
 *         name: cuentaContableHasta
 *         schema:
 *           type: string
 *         description: Cuenta contable hasta (opcional)
 *       - in: query
 *         name: saldoAntesCierre
 *         schema:
 *           type: boolean
 *         description: Incluir saldos antes del cierre
 *     responses:
 *       200:
 *         description: Archivo PDF generado exitosamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Parámetros requeridos faltantes
 *       500:
 *         description: Error interno del servidor
 */
router.get('/exportar-pdf', libroMayorController.exportarPDF.bind(libroMayorController));

export default router;
