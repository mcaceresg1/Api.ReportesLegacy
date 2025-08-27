import { Router } from 'express';
import { LibroMayorAsientosController } from '../controllers/LibroMayorAsientosController';

export function createLibroMayorAsientosRoutes(libroMayorAsientosController: LibroMayorAsientosController): Router {
  const router = Router();

  /**
   * @swagger
   * /api/libro-mayor-asientos/{conjunto}/filtros:
   *   get:
   *     summary: Obtiene los filtros disponibles para el reporte de Libro Mayor Asientos
   *     description: Retorna la lista de asientos y referencias disponibles para filtrar
   *     tags: [Libro Mayor Asientos]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *     responses:
   *       200:
   *         description: Filtros obtenidos exitosamente
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
   *                     type: object
   *                     properties:
   *                       asiento:
   *                         type: string
   *                         example: "001"
   *                       referencia:
   *                         type: string
   *                         example: "Factura 001"
   *                 message:
   *                   type: string
   *                   example: "Filtros obtenidos exitosamente"
   *       400:
   *         description: Parámetro conjunto requerido
   *       500:
   *         description: Error interno del servidor
   */
  router.get('/:conjunto/filtros', libroMayorAsientosController.obtenerFiltros.bind(libroMayorAsientosController));

  /**
   * @swagger
   * /api/libro-mayor-asientos/{conjunto}/generar:
   *   get:
   *     summary: Genera el reporte de Libro Mayor Asientos
   *     description: Genera y retorna el reporte de asientos con paginación
   *     tags: [Libro Mayor Asientos]
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
   *         name: referencia
   *         schema:
   *           type: string
   *         description: Filtro por referencia
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
   *           default: 25
   *         description: Registros por página
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
   *                     $ref: '#/components/schemas/LibroMayorAsientos'
   *                 pagination:
   *                   $ref: '#/components/schemas/Pagination'
   *                 message:
   *                   type: string
   *                   example: "Reporte generado exitosamente"
   *       400:
   *         description: Parámetro conjunto requerido
   *       500:
   *         description: Error interno del servidor
   */
  router.get('/:conjunto/generar', libroMayorAsientosController.generarReporte.bind(libroMayorAsientosController));

  /**
   * @swagger
   * /api/libro-mayor-asientos/{conjunto}/obtener:
   *   get:
   *     summary: Obtiene los datos paginados del reporte de Libro Mayor Asientos
   *     description: Retorna los datos del reporte con paginación
   *     tags: [Libro Mayor Asientos]
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
   *         name: referencia
   *         schema:
   *           type: string
   *         description: Filtro por referencia
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
   *           default: 25
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
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/LibroMayorAsientos'
   *                 pagination:
   *                   $ref: '#/components/schemas/Pagination'
   *                 message:
   *                   type: string
   *                   example: "Datos obtenidos exitosamente"
   *       400:
   *         description: Parámetro conjunto requerido
   *       500:
   *         description: Error interno del servidor
   */
  router.get('/:conjunto/obtener', libroMayorAsientosController.obtenerAsientos.bind(libroMayorAsientosController));

  /**
   * @swagger
   * /api/libro-mayor-asientos/{conjunto}/excel:
   *   get:
   *     summary: Exporta el reporte de Libro Mayor Asientos a Excel
   *     description: Genera y descarga un archivo Excel con los datos del reporte
   *     tags: [Libro Mayor Asientos]
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
   *         name: referencia
   *         schema:
   *           type: string
   *         description: Filtro por referencia
   *     responses:
   *       200:
   *         description: Archivo Excel generado exitosamente
   *         content:
   *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
   *             schema:
   *               type: string
   *               format: binary
   *       400:
   *         description: Parámetro conjunto requerido
   *       500:
   *         description: Error interno del servidor
   */
  router.get('/:conjunto/excel', libroMayorAsientosController.exportarExcel.bind(libroMayorAsientosController));

  /**
   * @swagger
   * /api/libro-mayor-asientos/{conjunto}/pdf:
   *   get:
   *     summary: Exporta el reporte de Libro Mayor Asientos a PDF
   *     description: Genera y descarga un archivo PDF con los datos del reporte
   *     tags: [Libro Mayor Asientos]
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
   *         name: referencia
   *         schema:
   *           type: string
   *         description: Filtro por referencia
   *     responses:
   *       200:
   *         description: Archivo PDF generado exitosamente
   *         content:
   *           application/pdf:
   *             schema:
   *               type: string
   *               format: binary
   *       400:
   *         description: Parámetro conjunto requerido
   *       500:
   *         description: Error interno del servidor
   */
  router.get('/:conjunto/pdf', libroMayorAsientosController.exportarPDF.bind(libroMayorAsientosController));

  return router;
}
