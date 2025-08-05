import { Router } from 'express';
import { container } from '../container/container';
import { CompaniaController } from '../controllers/CompaniaController';

const router = Router();
const companiaController = container.get<CompaniaController>('CompaniaController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Compania:
 *       type: object
 *       required:
 *         - codigo
 *         - nombre
 *         - estado
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la compañía
 *         codigo:
 *           type: string
 *           description: Código único de la compañía
 *         nombre:
 *           type: string
 *           description: Nombre de la compañía
 *         titReporte1:
 *           type: string
 *           description: Título del reporte 1
 *         nomCompania:
 *           type: string
 *           description: Nombre completo de la compañía
 *         dirCompania1:
 *           type: string
 *           description: Dirección línea 1 de la compañía
 *         dirCompania2:
 *           type: string
 *           description: Dirección línea 2 de la compañía
 *         telCompania:
 *           type: string
 *           description: Teléfono de la compañía
 *         titReporte2:
 *           type: string
 *           description: Título del reporte 2
 *         titReporte3:
 *           type: string
 *           description: Título del reporte 3
 *         titReporte4:
 *           type: string
 *           description: Título del reporte 4
 *         titDescrip:
 *           type: string
 *           description: Título descriptivo
 *         linTotales:
 *           type: string
 *           description: Línea de totales
 *         logoCompania:
 *           type: string
 *           description: Logo de la compañía
 *         estado:
 *           type: boolean
 *           description: Estado activo/inactivo de la compañía
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 */

/**
 * @swagger
 * /api/companias:
 *   get:
 *     summary: Obtener todas las compañías
 *     tags: [Compañías]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de compañías obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Compania'
 *                 message:
 *                   type: string
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', (req, res) => companiaController.getAllCompanias(req, res));

/**
 * @swagger
 * /api/companias/activas:
 *   get:
 *     summary: Obtener todas las compañías activas
 *     tags: [Compañías]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de compañías activas obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Compania'
 *                 message:
 *                   type: string
 *       500:
 *         description: Error interno del servidor
 */
router.get('/activas', (req, res) => companiaController.getCompaniasActivas(req, res));

/**
 * @swagger
 * /api/companias/codigo/{codigo}:
 *   get:
 *     summary: Obtener compañía por código
 *     tags: [Compañías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *         description: Código de la compañía
 *     responses:
 *       200:
 *         description: Compañía obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Compania'
 *                 message:
 *                   type: string
 *       404:
 *         description: Compañía no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get('/codigo/:codigo', (req, res) => companiaController.getCompaniaByCodigo(req, res));

/**
 * @swagger
 * /api/companias/filter:
 *   get:
 *     summary: Filtrar compañías
 *     tags: [Compañías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: codigo
 *         schema:
 *           type: string
 *         description: Código de la compañía para filtrar
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *         description: Nombre de la compañía para filtrar
 *       - in: query
 *         name: estado
 *         schema:
 *           type: boolean
 *         description: Estado de la compañía para filtrar
 *     responses:
 *       200:
 *         description: Compañías filtradas exitosamente
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
 *                     $ref: '#/components/schemas/Compania'
 *                 message:
 *                   type: string
 *       500:
 *         description: Error interno del servidor
 */
router.get('/filter', (req, res) => companiaController.getCompaniasByFilter(req, res));

/**
 * @swagger
 * /api/companias/{id}:
 *   get:
 *     summary: Obtener compañía por ID
 *     tags: [Compañías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la compañía
 *     responses:
 *       200:
 *         description: Compañía obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Compania'
 *                 message:
 *                   type: string
 *       404:
 *         description: Compañía no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', (req, res) => companiaController.getCompaniaById(req, res));

/**
 * @swagger
 * /api/companias:
 *   post:
 *     summary: Crear nueva compañía
 *     tags: [Compañías]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigo
 *               - nombre
 *             properties:
 *               codigo:
 *                 type: string
 *                 description: Código único de la compañía
 *               nombre:
 *                 type: string
 *                 description: Nombre de la compañía
 *               titReporte1:
 *                 type: string
 *                 description: Título del reporte 1
 *               nomCompania:
 *                 type: string
 *                 description: Nombre completo de la compañía
 *               dirCompania1:
 *                 type: string
 *                 description: Dirección línea 1 de la compañía
 *               dirCompania2:
 *                 type: string
 *                 description: Dirección línea 2 de la compañía
 *               telCompania:
 *                 type: string
 *                 description: Teléfono de la compañía
 *               titReporte2:
 *                 type: string
 *                 description: Título del reporte 2
 *               titReporte3:
 *                 type: string
 *                 description: Título del reporte 3
 *               titReporte4:
 *                 type: string
 *                 description: Título del reporte 4
 *               titDescrip:
 *                 type: string
 *                 description: Título descriptivo
 *               linTotales:
 *                 type: string
 *                 description: Línea de totales
 *               logoCompania:
 *                 type: string
 *                 description: Logo de la compañía
 *               estado:
 *                 type: boolean
 *                 description: Estado activo/inactivo de la compañía
 *     responses:
 *       201:
 *         description: Compañía creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Compania'
 *                 message:
 *                   type: string
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', (req, res) => companiaController.createCompania(req, res));

/**
 * @swagger
 * /api/companias/{id}:
 *   put:
 *     summary: Actualizar compañía
 *     tags: [Compañías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la compañía
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *                 description: Código único de la compañía
 *               nombre:
 *                 type: string
 *                 description: Nombre de la compañía
 *               titReporte1:
 *                 type: string
 *                 description: Título del reporte 1
 *               nomCompania:
 *                 type: string
 *                 description: Nombre completo de la compañía
 *               dirCompania1:
 *                 type: string
 *                 description: Dirección línea 1 de la compañía
 *               dirCompania2:
 *                 type: string
 *                 description: Dirección línea 2 de la compañía
 *               telCompania:
 *                 type: string
 *                 description: Teléfono de la compañía
 *               titReporte2:
 *                 type: string
 *                 description: Título del reporte 2
 *               titReporte3:
 *                 type: string
 *                 description: Título del reporte 3
 *               titReporte4:
 *                 type: string
 *                 description: Título del reporte 4
 *               titDescrip:
 *                 type: string
 *                 description: Título descriptivo
 *               linTotales:
 *                 type: string
 *                 description: Línea de totales
 *               logoCompania:
 *                 type: string
 *                 description: Logo de la compañía
 *               estado:
 *                 type: boolean
 *                 description: Estado activo/inactivo de la compañía
 *     responses:
 *       200:
 *         description: Compañía actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Compania'
 *                 message:
 *                   type: string
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Compañía no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id', (req, res) => companiaController.updateCompania(req, res));

/**
 * @swagger
 * /api/companias/{id}:
 *   delete:
 *     summary: Eliminar compañía
 *     tags: [Compañías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la compañía
 *     responses:
 *       200:
 *         description: Compañía eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Compañía no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', (req, res) => companiaController.deleteCompania(req, res));

export default router; 