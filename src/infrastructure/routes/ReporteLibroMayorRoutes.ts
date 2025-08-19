import { Router } from 'express';
import { container } from '../container/container';
import { ReporteLibroMayorController } from '../controllers/ReporteLibroMayorController';

export class ReporteLibroMayorRoutes {
  constructor(
    private readonly reporteLibroMayorController: ReporteLibroMayorController
  ) {}

  getRouter(): Router {
    const router = Router();
    
    /**
     * @swagger
     * /api/reporte-libro-mayor/{conjunto}:
     *   get:
     *     summary: Reporte Completo de Libro Mayor de Contabilidad
     *     description: Genera un reporte completo de Libro Mayor con datos, resumen y metadatos
     *     tags: [Reporte Libro Mayor]
     *     parameters:
     *       - in: path
     *         name: conjunto
     *         required: true
     *         description: "Conjunto de datos (ej: EXACTUS)"
     *         schema: { type: string }
     *       - in: query
     *         name: usuario
     *         required: true
     *         description: "Usuario que solicita el reporte"
     *         schema: { type: string }
     *       - in: query
     *         name: fechaInicio
     *         required: true
     *         description: "Fecha de inicio del reporte (YYYY-MM-DD)"
     *         schema: { type: string, format: date }
     *       - in: query
     *         name: fechaFin
     *         required: true
     *         description: "Fecha de fin del reporte (YYYY-MM-DD)"
     *         schema: { type: string, format: date }
     *       - in: query
     *         name: contabilidad
     *         required: false
     *         description: "Tipo de contabilidad (F=Fiscal, A=Administrativa, T=Todas)"
     *         schema: { type: string, enum: [F, A, T], default: T }
     *       - in: query
     *         name: cuentasContables
     *         required: false
     *         description: "Lista de cuentas contables a incluir (separadas por coma)"
     *         schema: { type: string }
     *       - in: query
     *         name: centrosCosto
     *         required: false
     *         description: "Lista de centros de costo a incluir (separados por coma)"
     *         schema: { type: string }
     *       - in: query
     *         name: nits
     *         required: false
     *         description: "Lista de NITs a incluir (separados por coma)"
     *         schema: { type: string }
     *       - in: query
     *         name: asientos
     *         required: false
     *         description: "Lista de números de asiento a incluir (separados por coma)"
     *         schema: { type: string }
     *       - in: query
     *         name: tiposAsiento
     *         required: false
     *         description: "Lista de tipos de asiento a incluir (separados por coma)"
     *         schema: { type: string }
     *       - in: query
     *         name: incluirSaldosIniciales
     *         required: false
     *         description: "Incluir saldos iniciales (true/false)"
     *         schema: { type: boolean, default: true }
     *       - in: query
     *         name: incluirMovimientos
     *         required: false
     *         description: "Incluir movimientos (true/false)"
     *         schema: { type: boolean, default: true }
     *       - in: query
     *         name: agruparPor
     *         required: false
     *         description: "Criterio de agrupación"
     *         schema: { type: string, enum: [NINGUNO, CUENTA, CENTRO_COSTO, TIPO_ASIENTO, CLASE_ASIENTO, FECHA, USUARIO, PERIODO_CONTABLE], default: NINGUNO }
     *       - in: query
     *         name: ordenarPor
     *         required: false
     *         description: "Campo por el cual ordenar"
     *         schema: { type: string, enum: [FECHA, CUENTA, CENTRO_COSTO, TIPO_ASIENTO, CLASE_ASIENTO, USUARIO, VALOR, PERIODO_CONTABLE], default: FECHA }
     *       - in: query
     *         name: orden
     *         required: false
     *         description: "Dirección del ordenamiento"
     *         schema: { type: string, enum: [ASC, DESC], default: ASC }
     *       - in: query
     *         name: maximoRegistros
     *         required: false
     *         description: "Número máximo de registros a retornar"
     *         schema: { type: integer, default: 10000 }
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
     *                   $ref: '#/components/schemas/ReporteLibroMayorResponse'
     *                 metadata:
     *                   type: object
     *       400:
     *         description: Parámetros inválidos
     *       500:
     *         description: Error interno del servidor
     */
    router.get('/:conjunto', (req, res) => this.reporteLibroMayorController.generarReporteCompleto(req, res));

    /**
     * @swagger
     * /api/reporte-libro-mayor/{conjunto}/datos:
     *   get:
     *     summary: Datos del Reporte de Libro Mayor
     *     description: Genera solo los datos del reporte sin resumen ni metadatos
     *     tags: [Reporte Libro Mayor]
     *     parameters:
     *       - in: path
     *         name: conjunto
     *         required: true
     *         description: "Conjunto de datos (ej: EXACTUS)"
     *         schema: { type: string }
     *       - in: query
     *         name: usuario
     *         required: true
     *         description: "Usuario que solicita el reporte"
     *         schema: { type: string }
     *       - in: query
     *         name: fechaInicio
     *         required: true
     *         description: "Fecha de inicio del reporte (YYYY-MM-DD)"
     *         schema: { type: string, format: date }
     *       - in: query
     *         name: fechaFin
     *         required: true
     *         description: "Fecha de fin del reporte (YYYY-MM-DD)"
     *         schema: { type: string, format: date }
     *     responses:
     *       200:
     *         description: Datos del reporte generados exitosamente
     *       400:
     *         description: Parámetros inválidos
     *       500:
     *         description: Error interno del servidor
     */
    router.get('/:conjunto/datos', (req, res) => this.reporteLibroMayorController.generarDatosReporte(req, res));

    /**
     * @swagger
     * /api/reporte-libro-mayor/{conjunto}/resumen:
     *   get:
     *     summary: Resumen del Reporte de Libro Mayor
     *     description: Obtiene solo el resumen del reporte sin los datos detallados
     *     tags: [Reporte Libro Mayor]
     *     parameters:
     *       - in: path
     *         name: conjunto
     *         required: true
     *         description: "Conjunto de datos (ej: EXACTUS)"
     *         schema: { type: string }
     *       - in: query
     *         name: usuario
     *         required: true
     *         description: "Usuario que solicita el reporte"
     *         schema: { type: string }
     *       - in: query
     *         name: fechaInicio
     *         required: true
     *         description: "Fecha de inicio del reporte (YYYY-MM-DD)"
     *         schema: { type: string, format: date }
     *       - in: query
     *         name: fechaFin
     *         required: true
     *         description: "Fecha de fin del reporte (YYYY-MM-DD)"
     *         schema: { type: string, format: date }
     *     responses:
     *       200:
     *         description: Resumen del reporte obtenido exitosamente
     *       400:
     *         description: Parámetros inválidos
     *       500:
     *         description: Error interno del servidor
     */
    router.get('/:conjunto/resumen', (req, res) => this.reporteLibroMayorController.obtenerResumenReporte(req, res));

    /**
     * @swagger
     * /api/reporte-libro-mayor/{conjunto}/exportar:
     *   get:
     *     summary: Exportar Reporte de Libro Mayor
     *     description: Exporta el reporte en formato específico (Excel, PDF, CSV, HTML)
     *     tags: [Reporte Libro Mayor]
     *     parameters:
     *       - in: path
     *         name: conjunto
     *         required: true
     *         description: "Conjunto de datos (ej: EXACTUS)"
     *         schema: { type: string }
     *       - in: query
     *         name: usuario
     *         required: true
     *         description: "Usuario que solicita el reporte"
     *         schema: { type: string }
     *       - in: query
     *         name: fechaInicio
     *         required: true
     *         description: "Fecha de inicio del reporte (YYYY-MM-DD)"
     *         schema: { type: string, format: date }
     *       - in: query
     *         name: fechaFin
     *         required: true
     *         description: "Fecha de fin del reporte (YYYY-MM-DD)"
     *         schema: { type: string, format: date }
     *       - in: query
     *         name: formato
     *         required: false
     *         description: "Formato de exportación"
     *         schema: { type: string, enum: [EXCEL, PDF, CSV, HTML], default: EXCEL }
     *     responses:
     *       200:
     *         description: Archivo exportado exitosamente
     *         content:
     *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
     *             schema:
     *               type: string
     *               format: binary
     *           application/pdf:
     *             schema:
     *               type: string
     *               format: binary
     *           text/csv:
     *             schema:
     *               type: string
     *           text/html:
     *             schema:
     *               type: string
     *       400:
     *         description: Parámetros inválidos
     *       500:
     *         description: Error interno del servidor
     */
    router.get('/:conjunto/exportar', (req, res) => this.reporteLibroMayorController.exportarReporte(req, res));

    /**
     * @swagger
     * /api/reporte-libro-mayor/validar-filtros:
     *   get:
     *     summary: Validar Filtros del Reporte
     *     description: Valida los filtros proporcionados para el reporte
     *     tags: [Reporte Libro Mayor]
     *     parameters:
     *       - in: query
     *         name: usuario
     *         required: true
     *         description: "Usuario que solicita el reporte"
     *         schema: { type: string }
     *       - in: query
     *         name: fechaInicio
     *         required: true
     *         description: "Fecha de inicio del reporte (YYYY-MM-DD)"
     *         schema: { type: string, format: date }
     *       - in: query
     *         name: fechaFin
     *         required: true
     *         description: "Fecha de fin del reporte (YYYY-MM-DD)"
     *         schema: { type: string, format: date }
     *     responses:
     *       200:
     *         description: Validación completada exitosamente
     *       400:
     *         description: Parámetros inválidos
     *       500:
     *         description: Error interno del servidor
     */
    router.get('/validar-filtros', (req, res) => this.reporteLibroMayorController.validarFiltros(req, res));

    return router;
  }
}
