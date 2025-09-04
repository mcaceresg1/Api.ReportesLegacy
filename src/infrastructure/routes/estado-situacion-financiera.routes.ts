import { Router } from 'express';
import { container } from '../container/container';
import { EstadoSituacionFinancieraController } from '../controllers/EstadoSituacionFinancieraController';
import { TYPES } from '../container/types';

const router = Router();

// Obtener instancia del controlador
const controller = container.get<EstadoSituacionFinancieraController>(TYPES.EstadoSituacionFinancieraController);

/**
 * @swagger
 * tags:
 *   name: Estado Situación Financiera
 *   description: APIs para el reporte de Estado de Situación Financiera
 */

/**
 * @swagger
 * /api/estado-situacion-financiera/{conjunto}/health:
 *   get:
 *     summary: Health check del servicio
 *     tags: [Estado Situación Financiera]
 *     parameters:
 *       - in: path
 *         name: conjunto
 *         required: true
 *         schema:
 *           type: string
 *         description: Conjunto de datos
 *     responses:
 *       200:
 *         description: Servicio funcionando correctamente
 */
router.get('/:conjunto/health', (req, res) => controller.health(req, res));

/**
 * @swagger
 * /api/estado-situacion-financiera/{conjunto}/tipos-balance:
 *   get:
 *     summary: Obtiene los tipos de balance disponibles
 *     tags: [Estado Situación Financiera]
 *     parameters:
 *       - in: path
 *         name: conjunto
 *         required: true
 *         schema:
 *           type: string
 *         description: Conjunto de datos
 *       - in: query
 *         name: usuario
 *         required: false
 *         schema:
 *           type: string
 *         description: Usuario para filtrar tipos de balance
 *     responses:
 *       200:
 *         description: Tipos de balance obtenidos correctamente
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:conjunto/tipos-balance', (req, res) => controller.obtenerTiposBalance(req, res));

/**
 * @swagger
 * /api/estado-situacion-financiera/{conjunto}/periodos-contables:
 *   get:
 *     summary: Obtiene los períodos contables disponibles
 *     tags: [Estado Situación Financiera]
 *     parameters:
 *       - in: path
 *         name: conjunto
 *         required: true
 *         schema:
 *           type: string
 *         description: Conjunto de datos
 *       - in: query
 *         name: fecha
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha para filtrar períodos contables
 *     responses:
 *       200:
 *         description: Períodos contables obtenidos correctamente
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:conjunto/periodos-contables', (req, res) => controller.obtenerPeriodosContables(req, res));

/**
 * @swagger
 * /api/estado-situacion-financiera/{conjunto}/generar:
 *   post:
 *     summary: Genera el reporte de Estado de Situación Financiera
 *     tags: [Estado Situación Financiera]
 *     parameters:
 *       - in: path
 *         name: conjunto
 *         required: true
 *         schema:
 *           type: string
 *         description: Conjunto de datos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipoBalance:
 *                 type: string
 *                 description: Tipo de balance
 *               moneda:
 *                 type: string
 *                 enum: [AMBAS, NUEVO_SOL, DOLAR]
 *                 description: Moneda del reporte
 *               comparacion:
 *                 type: string
 *                 enum: [ANUAL, MENSUAL, FECHA]
 *                 description: Tipo de comparación
 *               origen:
 *                 type: string
 *                 enum: [DIARIO, MAYOR, AMBOS]
 *                 description: Origen de los datos
 *               fecha:
 *                 type: string
 *                 format: date
 *                 description: Fecha del reporte
 *               contabilidad:
 *                 type: string
 *                 enum: [FISCAL, CORPORATIVA]
 *                 description: Tipo de contabilidad
 *               excluirAsientoCierre:
 *                 type: boolean
 *                 description: Excluir asiento de cierre
 *               libroElectronico:
 *                 type: boolean
 *                 description: Incluir libro electrónico
 *               versionLibroElectronico:
 *                 type: string
 *                 description: Versión del libro electrónico
 *               centroCostoTipo:
 *                 type: string
 *                 enum: [RANGO, AGRUPACION]
 *                 description: Tipo de centro de costo
 *               centroCostoDesde:
 *                 type: string
 *                 description: Centro de costo desde
 *               centroCostoHasta:
 *                 type: string
 *                 description: Centro de costo hasta
 *               centroCostoAgrupacion:
 *                 type: string
 *                 description: Agrupación de centro de costo
 *               criterio:
 *                 type: string
 *                 description: Criterio adicional
 *               dimensionAdicional:
 *                 type: string
 *                 description: Dimensión adicional
 *               dimensionTexto:
 *                 type: string
 *                 description: Texto de dimensión
 *               tituloPrincipal:
 *                 type: string
 *                 description: Título principal
 *               titulo2:
 *                 type: string
 *                 description: Título 2
 *               titulo3:
 *                 type: string
 *                 description: Título 3
 *               titulo4:
 *                 type: string
 *                 description: Título 4
 *     responses:
 *       200:
 *         description: Reporte generado correctamente
 *       400:
 *         description: Error en los parámetros
 *       500:
 *         description: Error interno del servidor
 */
router.post('/:conjunto/generar', (req, res) => controller.generarReporte(req, res));

/**
 * @swagger
 * /api/estado-situacion-financiera/{conjunto}/obtener:
 *   get:
 *     summary: Obtiene los datos del Estado de Situación Financiera
 *     tags: [Estado Situación Financiera]
 *     parameters:
 *       - in: path
 *         name: conjunto
 *         required: true
 *         schema:
 *           type: string
 *         description: Conjunto de datos
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 25
 *         description: Registros por página
 *       - in: query
 *         name: tipoBalance
 *         required: false
 *         schema:
 *           type: string
 *         description: Tipo de balance
 *       - in: query
 *         name: moneda
 *         required: false
 *         schema:
 *           type: string
 *         description: Moneda del reporte
 *       - in: query
 *         name: comparacion
 *         required: false
 *         schema:
 *           type: string
 *         description: Tipo de comparación
 *       - in: query
 *         name: origen
 *         required: false
 *         schema:
 *           type: string
 *         description: Origen de los datos
 *       - in: query
 *         name: fecha
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha del reporte
 *       - in: query
 *         name: contabilidad
 *         required: false
 *         schema:
 *           type: string
 *         description: Tipo de contabilidad
 *       - in: query
 *         name: excluirAsientoCierre
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Excluir asiento de cierre
 *       - in: query
 *         name: libroElectronico
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Incluir libro electrónico
 *       - in: query
 *         name: versionLibroElectronico
 *         required: false
 *         schema:
 *           type: string
 *         description: Versión del libro electrónico
 *       - in: query
 *         name: centroCostoTipo
 *         required: false
 *         schema:
 *           type: string
 *         description: Tipo de centro de costo
 *       - in: query
 *         name: centroCostoDesde
 *         required: false
 *         schema:
 *           type: string
 *         description: Centro de costo desde
 *       - in: query
 *         name: centroCostoHasta
 *         required: false
 *         schema:
 *           type: string
 *         description: Centro de costo hasta
 *       - in: query
 *         name: centroCostoAgrupacion
 *         required: false
 *         schema:
 *           type: string
 *         description: Agrupación de centro de costo
 *       - in: query
 *         name: criterio
 *         required: false
 *         schema:
 *           type: string
 *         description: Criterio adicional
 *       - in: query
 *         name: dimensionAdicional
 *         required: false
 *         schema:
 *           type: string
 *         description: Dimensión adicional
 *       - in: query
 *         name: dimensionTexto
 *         required: false
 *         schema:
 *           type: string
 *         description: Texto de dimensión
 *       - in: query
 *         name: tituloPrincipal
 *         required: false
 *         schema:
 *           type: string
 *         description: Título principal
 *       - in: query
 *         name: titulo2
 *         required: false
 *         schema:
 *           type: string
 *         description: Título 2
 *       - in: query
 *         name: titulo3
 *         required: false
 *         schema:
 *           type: string
 *         description: Título 3
 *       - in: query
 *         name: titulo4
 *         required: false
 *         schema:
 *           type: string
 *         description: Título 4
 *     responses:
 *       200:
 *         description: Datos obtenidos correctamente
 *       400:
 *         description: Error en los parámetros
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:conjunto/obtener', (req, res) => controller.obtenerEstadoSituacionFinanciera(req, res));

/**
 * @swagger
 * /api/estado-situacion-financiera/{conjunto}/exportar-excel:
 *   get:
 *     summary: Exporta el reporte a Excel
 *     tags: [Estado Situación Financiera]
 *     parameters:
 *       - in: path
 *         name: conjunto
 *         required: true
 *         schema:
 *           type: string
 *         description: Conjunto de datos
 *       - in: query
 *         name: tipoBalance
 *         required: false
 *         schema:
 *           type: string
 *         description: Tipo de balance
 *       - in: query
 *         name: moneda
 *         required: false
 *         schema:
 *           type: string
 *         description: Moneda del reporte
 *       - in: query
 *         name: comparacion
 *         required: false
 *         schema:
 *           type: string
 *         description: Tipo de comparación
 *       - in: query
 *         name: origen
 *         required: false
 *         schema:
 *           type: string
 *         description: Origen de los datos
 *       - in: query
 *         name: fecha
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha del reporte
 *       - in: query
 *         name: contabilidad
 *         required: false
 *         schema:
 *           type: string
 *         description: Tipo de contabilidad
 *       - in: query
 *         name: excluirAsientoCierre
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Excluir asiento de cierre
 *       - in: query
 *         name: libroElectronico
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Incluir libro electrónico
 *       - in: query
 *         name: versionLibroElectronico
 *         required: false
 *         schema:
 *           type: string
 *         description: Versión del libro electrónico
 *       - in: query
 *         name: centroCostoTipo
 *         required: false
 *         schema:
 *           type: string
 *         description: Tipo de centro de costo
 *       - in: query
 *         name: centroCostoDesde
 *         required: false
 *         schema:
 *           type: string
 *         description: Centro de costo desde
 *       - in: query
 *         name: centroCostoHasta
 *         required: false
 *         schema:
 *           type: string
 *         description: Centro de costo hasta
 *       - in: query
 *         name: centroCostoAgrupacion
 *         required: false
 *         schema:
 *           type: string
 *         description: Agrupación de centro de costo
 *       - in: query
 *         name: criterio
 *         required: false
 *         schema:
 *           type: string
 *         description: Criterio adicional
 *       - in: query
 *         name: dimensionAdicional
 *         required: false
 *         schema:
 *           type: string
 *         description: Dimensión adicional
 *       - in: query
 *         name: dimensionTexto
 *         required: false
 *         schema:
 *           type: string
 *         description: Texto de dimensión
 *       - in: query
 *         name: tituloPrincipal
 *         required: false
 *         schema:
 *           type: string
 *         description: Título principal
 *       - in: query
 *         name: titulo2
 *         required: false
 *         schema:
 *           type: string
 *         description: Título 2
 *       - in: query
 *         name: titulo3
 *         required: false
 *         schema:
 *           type: string
 *         description: Título 3
 *       - in: query
 *         name: titulo4
 *         required: false
 *         schema:
 *           type: string
 *         description: Título 4
 *     responses:
 *       200:
 *         description: Archivo Excel generado correctamente
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Error en los parámetros
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:conjunto/exportar-excel', (req, res) => controller.exportarExcel(req, res));

/**
 * @swagger
 * /api/estado-situacion-financiera/{conjunto}/exportar-pdf:
 *   get:
 *     summary: Exporta el reporte a PDF
 *     tags: [Estado Situación Financiera]
 *     parameters:
 *       - in: path
 *         name: conjunto
 *         required: true
 *         schema:
 *           type: string
 *         description: Conjunto de datos
 *       - in: query
 *         name: tipoBalance
 *         required: false
 *         schema:
 *           type: string
 *         description: Tipo de balance
 *       - in: query
 *         name: moneda
 *         required: false
 *         schema:
 *           type: string
 *         description: Moneda del reporte
 *       - in: query
 *         name: comparacion
 *         required: false
 *         schema:
 *           type: string
 *         description: Tipo de comparación
 *       - in: query
 *         name: origen
 *         required: false
 *         schema:
 *           type: string
 *         description: Origen de los datos
 *       - in: query
 *         name: fecha
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha del reporte
 *       - in: query
 *         name: contabilidad
 *         required: false
 *         schema:
 *           type: string
 *         description: Tipo de contabilidad
 *       - in: query
 *         name: excluirAsientoCierre
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Excluir asiento de cierre
 *       - in: query
 *         name: libroElectronico
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Incluir libro electrónico
 *       - in: query
 *         name: versionLibroElectronico
 *         required: false
 *         schema:
 *           type: string
 *         description: Versión del libro electrónico
 *       - in: query
 *         name: centroCostoTipo
 *         required: false
 *         schema:
 *           type: string
 *         description: Tipo de centro de costo
 *       - in: query
 *         name: centroCostoDesde
 *         required: false
 *         schema:
 *           type: string
 *         description: Centro de costo desde
 *       - in: query
 *         name: centroCostoHasta
 *         required: false
 *         schema:
 *           type: string
 *         description: Centro de costo hasta
 *       - in: query
 *         name: centroCostoAgrupacion
 *         required: false
 *         schema:
 *           type: string
 *         description: Agrupación de centro de costo
 *       - in: query
 *         name: criterio
 *         required: false
 *         schema:
 *           type: string
 *         description: Criterio adicional
 *       - in: query
 *         name: dimensionAdicional
 *         required: false
 *         schema:
 *           type: string
 *         description: Dimensión adicional
 *       - in: query
 *         name: dimensionTexto
 *         required: false
 *         schema:
 *           type: string
 *         description: Texto de dimensión
 *       - in: query
 *         name: tituloPrincipal
 *         required: false
 *         schema:
 *           type: string
 *         description: Título principal
 *       - in: query
 *         name: titulo2
 *         required: false
 *         schema:
 *           type: string
 *         description: Título 2
 *       - in: query
 *         name: titulo3
 *         required: false
 *         schema:
 *           type: string
 *         description: Título 3
 *       - in: query
 *         name: titulo4
 *         required: false
 *         schema:
 *           type: string
 *         description: Título 4
 *     responses:
 *       200:
 *         description: Archivo PDF generado correctamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Error en los parámetros
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:conjunto/exportar-pdf', (req, res) => controller.exportarPDF(req, res));

export default router;
