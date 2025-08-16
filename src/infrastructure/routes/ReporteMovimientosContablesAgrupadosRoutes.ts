import { Router } from 'express';
import { container } from '../container/container';
import { ReporteMovimientosContablesAgrupadosController } from '../controllers/ReporteMovimientosContablesAgrupadosController';

export class ReporteMovimientosContablesAgrupadosRoutes {
  constructor(
    private readonly reporteMovimientosContablesAgrupadosController: ReporteMovimientosContablesAgrupadosController
  ) {}

  getRouter(): Router {
    const router = Router();
    
    /**
     * @swagger
     * /api/reporte-movimientos-contables-agrupados/{conjunto}:
     *   get:
     *     summary: Reporte de Movimientos Contables Agrupados por NIT y Dimensión Contable
     *     description: Genera un reporte de movimientos contables agrupados por NIT y dimensión contable, combinando datos del diario y mayor
     *     tags: [Reporte Movimientos Contables Agrupados]
     *     parameters:
     *       - in: path
     *         name: conjunto
     *         required: true
     *         description: "Conjunto de datos (ej: ASFSAC)"
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
     *         name: cuentaContableDesde
     *         required: false
     *         description: "Cuenta contable desde"
     *         schema: { type: string }
     *       - in: query
     *         name: cuentaContableHasta
     *         required: false
     *         description: "Cuenta contable hasta"
     *         schema: { type: string }
     *       - in: query
     *         name: nitDesde
     *         required: false
     *         description: "NIT desde"
     *         schema: { type: string }
     *       - in: query
     *         name: nitHasta
     *         required: false
     *         description: "NIT hasta"
     *         schema: { type: string }
     *       - in: query
     *         name: asientoDesde
     *         required: false
     *         description: "Número de asiento desde"
     *         schema: { type: string }
     *       - in: query
     *         name: asientoHasta
     *         required: false
     *         description: "Número de asiento hasta"
     *         schema: { type: string }
     *       - in: query
     *         name: fuentes
     *         required: false
     *         description: "Fuentes separadas por coma"
     *         schema: { type: string }
     *       - in: query
     *         name: incluirDiario
     *         required: false
     *         description: "Incluir movimientos del diario"
     *         schema: { type: boolean, default: true }
     *       - in: query
     *         name: incluirMayor
     *         required: false
     *         description: "Incluir movimientos del mayor"
     *         schema: { type: boolean, default: true }
     *       - in: query
     *         name: agruparPor
     *         required: false
     *         description: "Campo por el cual agrupar los resultados"
     *         schema: { type: string, enum: [CUENTA, NIT, DIMENSION, FECHA, NINGUNO], default: NINGUNO }
     *       - in: query
     *         name: ordenarPor
     *         required: false
     *         description: "Campo por el cual ordenar los resultados"
     *         schema: { type: string, enum: [CUENTA, NIT, DIMENSION, FECHA, MONTO], default: CUENTA }
     *       - in: query
     *         name: orden
     *         required: false
     *         description: "Orden de los resultados"
     *         schema: { type: string, enum: [ASC, DESC], default: ASC }
     *       - in: query
     *         name: pagina
     *         required: false
     *         description: "Número de página"
     *         schema: { type: integer, minimum: 1, default: 1 }
     *       - in: query
     *         name: registrosPorPagina
     *         required: false
     *         description: "Registros por página"
     *         schema: { type: integer, minimum: 1, maximum: 10000, default: 1000 }
     *       - in: query
     *         name: incluirTotales
     *         required: false
     *         description: "Incluir totales en el reporte"
     *         schema: { type: boolean, default: false }
     *       - in: query
     *         name: incluirSubtotales
     *         required: false
     *         description: "Incluir subtotales en el reporte"
     *         schema: { type: boolean, default: false }
     *     responses:
     *       200:
     *         description: "Reporte generado exitosamente"
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: "Reporte generado exitosamente"
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/ReporteMovimientoContableAgrupadoItem'
     *                 totalRegistros:
     *                   type: number
     *                   example: 150
     *                 totalPaginas:
     *                   type: number
     *                   example: 1
     *                 paginaActual:
     *                   type: number
     *                   example: 1
     *                 registrosPorPagina:
     *                   type: number
     *                   example: 1000
     *                 filtrosAplicados:
     *                   $ref: '#/components/schemas/FiltrosReporteMovimientosContablesAgrupados'
     *                 metadata:
     *                   type: object
     *                   properties:
     *                     conjunto:
     *                       type: string
     *                       example: "ASFSAC"
     *                     fechaGeneracion:
     *                       type: string
     *                       format: date-time
     *                       example: "2024-01-15T10:30:00.000Z"
     *                     usuario:
     *                       type: string
     *                       example: "system"
     *                     formatoExportacion:
     *                       type: string
     *                       example: "JSON"
     *                     agrupamiento:
     *                       type: string
     *                       example: "NINGUNO"
     *                     ordenamiento:
     *                       type: string
     *                       example: "CUENTA"
     *                     orden:
     *                       type: string
     *                       example: "ASC"
     *                     incluyeTotales:
     *                       type: boolean
     *                       example: false
     *                     incluyeSubtotales:
     *                       type: boolean
     *                       example: false
     *                     tiempoEjecucion:
     *                       type: number
     *                       example: 150
     *       400:
     *         description: "Parámetros inválidos o faltantes"
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     *                   example: "Errores de validación en los filtros"
     *                 errors:
     *                   type: array
     *                   items:
     *                     type: string
     *                   example: ["La fecha de inicio es obligatoria", "La fecha de fin es obligatoria"]
     *       500:
     *         description: "Error interno del servidor"
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     *                   example: "Error al generar el reporte de movimientos contables agrupados"
     *                 error:
     *                   type: string
     *                   example: "Error en la consulta SQL"
     */
    router.get('/:conjunto', this.reporteMovimientosContablesAgrupadosController.obtenerReporte.bind(this.reporteMovimientosContablesAgrupadosController));
    
    /**
     * @swagger
     * /api/reporte-movimientos-contables-agrupados/{conjunto}/exportar:
     *   get:
     *     summary: Exportar Reporte de Movimientos Contables Agrupados
     *     description: Exporta el reporte en el formato especificado (EXCEL, PDF, CSV)
     *     tags: [Reporte Movimientos Contables Agrupados]
     *     parameters:
     *       - in: path
     *         name: conjunto
     *         required: true
     *         description: "Conjunto de datos"
     *         schema: { type: string }
     *       - in: query
     *         name: formato
     *         required: true
     *         description: "Formato de exportación"
     *         schema: { type: string, enum: [EXCEL, PDF, CSV] }
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
     *         description: "Tipo de contabilidad"
     *         schema: { type: string, enum: [F, A, T], default: T }
     *     responses:
     *       200:
     *         description: "Archivo exportado exitosamente"
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
     *               format: binary
     *       400:
     *         description: "Formato no válido o errores de validación"
     *       500:
     *         description: "Error interno del servidor"
     */
    router.get('/:conjunto/exportar', this.reporteMovimientosContablesAgrupadosController.exportarReporte.bind(this.reporteMovimientosContablesAgrupadosController));
    
    /**
     * @swagger
     * /api/reporte-movimientos-contables-agrupados/{conjunto}/estadisticas:
     *   get:
     *     summary: Obtener Estadísticas del Reporte
     *     description: Obtiene estadísticas y totales del reporte de movimientos contables agrupados
     *     tags: [Reporte Movimientos Contables Agrupados]
     *     parameters:
     *       - in: path
     *         name: conjunto
     *         required: true
     *         description: "Conjunto de datos"
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
     *         description: "Tipo de contabilidad"
     *         schema: { type: string, enum: [F, A, T], default: T }
     *       - in: query
     *         name: agruparPor
     *         required: false
     *         description: "Campo por el cual agrupar para estadísticas"
     *         schema: { type: string, enum: [CUENTA, NIT, DIMENSION, FECHA, NINGUNO], default: NINGUNO }
     *     responses:
     *       200:
     *         description: "Estadísticas obtenidas exitosamente"
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: "Estadísticas obtenidas exitosamente"
     *                 data:
     *                   type: object
     *                   properties:
     *                     totalLocal:
     *                       type: number
     *                       example: 1500000.00
     *                     totalDolar:
     *                       type: number
     *                       example: 50000.00
     *                     totalRegistros:
     *                       type: number
     *                       example: 150
     *                     subtotales:
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           grupo:
     *                             type: string
     *                             example: "CUENTA"
     *                           valor:
     *                             type: string
     *                             example: "01.0.0.0.000"
     *                           totalLocal:
     *                             type: number
     *                             example: 500000.00
     *                           totalDolar:
     *                             type: number
     *                             example: 15000.00
     *                           cantidadRegistros:
     *                             type: number
     *                             example: 50
     *       400:
     *         description: "Errores de validación"
     *       500:
     *         description: "Error interno del servidor"
     */
    router.get('/:conjunto/estadisticas', this.reporteMovimientosContablesAgrupadosController.obtenerEstadisticas.bind(this.reporteMovimientosContablesAgrupadosController));
    
    return router;
  }
}

export function createReporteMovimientosContablesAgrupadosRoutes(): Router {
  const controller = container.get<ReporteMovimientosContablesAgrupadosController>('ReporteMovimientosContablesAgrupadosController');
  const routes = new ReporteMovimientosContablesAgrupadosRoutes(controller);
  return routes.getRouter();
}
