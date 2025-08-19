import { Router } from 'express';
import { container } from '../container/container';
import { ReporteMovimientosContablesController } from '../controllers/ReporteMovimientosContablesController';

export class ReporteMovimientosContablesRoutes {
  constructor(
    private readonly reporteMovimientosContablesController: ReporteMovimientosContablesController
  ) {}

  getRouter(): Router {
    const router = Router();
    
    /**
     * @swagger
     * /api/reporte-movimientos-contables/{conjunto}:
     *   get:
     *     summary: Reporte de Movimientos Contables
     *     description: Genera un reporte completo de movimientos contables con filtros avanzados
     *     tags: [Reporte Movimientos Contables]
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
     *         name: asientos
     *         required: false
     *         description: "Lista de números de asiento a incluir"
     *         schema: { type: array, items: { type: number } }
     *       - in: query
     *         name: asientosExcluir
     *         required: false
     *         description: "Lista de números de asiento a excluir"
     *         schema: { type: array, items: { type: number } }
     *       - in: query
     *         name: rangoAsientos
     *         required: false
     *         description: "Rango de asientos (JSON: {\"desde\": 1, \"hasta\": 100})"
     *         schema: { type: string }
     *       - in: query
     *         name: tiposAsiento
     *         required: false
     *         description: "Lista de tipos de asiento a incluir"
     *         schema: { type: array, items: { type: string } }
     *       - in: query
     *         name: tiposAsientoExcluir
     *         required: false
     *         description: "Lista de tipos de asiento a excluir"
     *         schema: { type: array, items: { type: string } }
     *       - in: query
     *         name: clasesAsiento
     *         required: false
     *         description: "Lista de clases de asiento a incluir"
     *         schema: { type: array, items: { type: string } }
     *       - in: query
     *         name: clasesAsientoExcluir
     *         required: false
     *         description: "Lista de clases de asiento a excluir"
     *         schema: { type: array, items: { type: string } }
     *       - in: query
     *         name: nits
     *         required: false
     *         description: "Lista de NITs a incluir"
     *         schema: { type: array, items: { type: string } }
     *       - in: query
     *         name: nitsExcluir
     *         required: false
     *         description: "Lista de NITs a excluir"
     *         schema: { type: array, items: { type: string } }
     *       - in: query
     *         name: centrosCosto
     *         required: false
     *         description: "Lista de centros de costo a incluir"
     *         schema: { type: array, items: { type: string } }
     *       - in: query
     *         name: centrosCostoExcluir
     *         required: false
     *         description: "Lista de centros de costo a excluir"
     *         schema: { type: array, items: { type: string } }
     *       - in: query
     *         name: referencias
     *         required: false
     *         description: "Lista de referencias a incluir"
     *         schema: { type: array, items: { type: string } }
     *       - in: query
     *         name: referenciasExcluir
     *         required: false
     *         description: "Lista de referencias a excluir"
     *         schema: { type: array, items: { type: string } }
     *       - in: query
     *         name: documentos
     *         required: false
     *         description: "Lista de documentos a incluir"
     *         schema: { type: array, items: { type: string } }
     *       - in: query
     *         name: documentosExcluir
     *         required: false
     *         description: "Lista de documentos a excluir"
     *         schema: { type: array, items: { type: string } }
     *       - in: query
     *         name: cuentasContables
     *         required: false
     *         description: "Lista de cuentas contables a incluir"
     *         schema: { type: array, items: { type: string } }
     *       - in: query
     *         name: cuentasContablesExcluir
     *         required: false
     *         description: "Lista de cuentas contables a excluir"
     *         schema: { type: array, items: { type: string } }
     *       - in: query
     *         name: criteriosCuentaContable
     *         required: false
     *         description: "Criterios avanzados de cuenta contable (JSON)"
     *         schema: { type: string }
     *       - in: query
     *         name: titulo
     *         required: false
     *         description: "Título del reporte"
     *         schema: { type: string }
     *       - in: query
     *         name: subtitulo
     *         required: false
     *         description: "Subtítulo del reporte"
     *         schema: { type: string }
     *       - in: query
     *         name: piePagina
     *         required: false
     *         description: "Pie de página del reporte"
     *         schema: { type: string }
     *       - in: query
     *         name: mostrarTitulo
     *         required: false
     *         description: "Mostrar título en el reporte"
     *         schema: { type: boolean, default: true }
     *       - in: query
     *         name: mostrarSubtitulo
     *         required: false
     *         description: "Mostrar subtítulo en el reporte"
     *         schema: { type: boolean, default: true }
     *       - in: query
     *         name: mostrarPiePagina
     *         required: false
     *         description: "Mostrar pie de página en el reporte"
     *         schema: { type: boolean, default: true }
     *       - in: query
     *         name: camposPersonalizados
     *         required: false
     *         description: "Campos personalizados del reporte (JSON)"
     *         schema: { type: string }
     *       - in: query
     *         name: formatoExportacion
     *         required: false
     *         description: "Formato de exportación del reporte"
     *         schema: { type: string, enum: [EXCEL, PDF, CSV, HTML], default: EXCEL }
     *       - in: query
     *         name: incluirTotales
     *         required: false
     *         description: "Incluir totales en el reporte"
     *         schema: { type: boolean, default: true }
     *       - in: query
     *         name: incluirSubtotales
     *         required: false
     *         description: "Incluir subtotales en el reporte"
     *         schema: { type: boolean, default: true }
     *       - in: query
     *         name: agruparPor
     *         required: false
     *         description: "Campo por el cual agrupar los resultados"
     *         schema: { type: string, enum: [NINGUNO, CUENTA, CENTRO_COSTO, TIPO_ASIENTO, CLASE_ASIENTO, FECHA, USUARIO], default: NINGUNO }
     *       - in: query
     *         name: ordenarPor
     *         required: false
     *         description: "Campo por el cual ordenar los resultados"
     *         schema: { type: string, enum: [FECHA, CUENTA, CENTRO_COSTO, TIPO_ASIENTO, CLASE_ASIENTO, USUARIO, VALOR], default: FECHA }
     *       - in: query
     *         name: orden
     *         required: false
     *         description: "Orden de los resultados"
     *         schema: { type: string, enum: [ASC, DESC], default: ASC }
     *       - in: query
     *         name: mostrarFiltros
     *         required: false
     *         description: "Mostrar filtros aplicados en el reporte"
     *         schema: { type: boolean, default: true }
     *       - in: query
     *         name: mostrarResumen
     *         required: false
     *         description: "Mostrar resumen en el reporte"
     *         schema: { type: boolean, default: true }
     *       - in: query
     *         name: maximoRegistros
     *         required: false
     *         description: "Número máximo de registros a retornar"
     *         schema: { type: number, minimum: 1, maximum: 100000, default: 1000 }
     *       - in: query
     *         name: incluirGraficos
     *         required: false
     *         description: "Incluir gráficos en el reporte"
     *         schema: { type: boolean, default: false }
     *       - in: query
     *         name: incluirCalculos
     *         required: false
     *         description: "Incluir cálculos adicionales en el reporte"
     *         schema: { type: boolean, default: true }
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
     *                     $ref: '#/components/schemas/ReporteMovimientoContableItem'
     *                 totalRegistros:
     *                   type: number
     *                   example: 150
     *                 filtrosAplicados:
     *                   $ref: '#/components/schemas/FiltrosReporteMovimientosContables'
     *                 metadata:
     *                   type: object
     *                   properties:
     *                     conjunto:
     *                       type: string
     *                       example: "EXACTUS"
     *                     fechaGeneracion:
     *                       type: string
     *                       format: date-time
     *                       example: "2024-01-15T10:30:00.000Z"
     *                     usuario:
     *                       type: string
     *                       example: "admin"
     *                     formatoExportacion:
     *                       type: string
     *                       example: "EXCEL"
     *                     agrupamiento:
     *                       type: string
     *                       example: "NINGUNO"
     *                     ordenamiento:
     *                       type: string
     *                       example: "FECHA"
     *                     orden:
     *                       type: string
     *                       example: "ASC"
     *                     incluyeTotales:
     *                       type: boolean
     *                       example: true
     *                     incluyeSubtotales:
     *                       type: boolean
     *                       example: true
     *                     incluyeGraficos:
     *                       type: boolean
     *                       example: false
     *                     incluyeCalculos:
     *                       type: boolean
     *                       example: true
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
     *                   example: "El parámetro conjunto es obligatorio"
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
     *                   example: "Error al generar el reporte de movimientos contables"
     *                 error:
     *                   type: string
     *                   example: "Error en la consulta SQL"
     */
    router.get('/:conjunto', this.reporteMovimientosContablesController.obtenerReporteMovimientosContables.bind(this.reporteMovimientosContablesController));
    
    // POST /api/reporte-movimientos-contables/:conjunto/exportar-excel - Exportar a Excel
    router.post('/:conjunto/exportar-excel', this.reporteMovimientosContablesController.exportarExcel.bind(this.reporteMovimientosContablesController));
    
    return router;
  }
}

export function createReporteMovimientosContablesRoutes(): Router {
  const controller = container.get<ReporteMovimientosContablesController>('ReporteMovimientosContablesController');
  const routes = new ReporteMovimientosContablesRoutes(controller);
  return routes.getRouter();
}
