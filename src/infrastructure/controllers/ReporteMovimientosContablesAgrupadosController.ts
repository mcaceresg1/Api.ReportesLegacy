import { Request, Response } from 'express';
import { IReporteMovimientosContablesAgrupadosService } from '../../domain/services/IReporteMovimientosContablesAgrupadosService';
import { FiltrosReporteMovimientosContablesAgrupados } from '../../domain/entities/ReporteMovimientosContablesAgrupados';

export class ReporteMovimientosContablesAgrupadosController {
  constructor(
    private readonly reporteService: IReporteMovimientosContablesAgrupadosService
  ) {}

  /**
   * Obtiene el reporte de movimientos contables agrupados
   */
  async obtenerReporte(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const queryParams = req.query;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      // Construir filtros desde query parameters
      const filtros: FiltrosReporteMovimientosContablesAgrupados = {
        conjunto,
        fechaInicio: queryParams['fechaInicio'] as string || '',
        fechaFin: queryParams['fechaFin'] as string || '',
        contabilidad: (queryParams['contabilidad'] as 'F' | 'A' | 'T') || 'T',
        cuentaContableDesde: queryParams['cuentaContableDesde'] as string || '',
        cuentaContableHasta: queryParams['cuentaContableHasta'] as string || '',
        nitDesde: queryParams['nitDesde'] as string || '',
        nitHasta: queryParams['nitHasta'] as string || '',
        asientoDesde: queryParams['asientoDesde'] as string || '',
        asientoHasta: queryParams['asientoHasta'] as string || '',
        fuentes: queryParams['fuentes'] ? (queryParams['fuentes'] as string).split(',') : [],
        dimensiones: queryParams['dimensiones'] ? (queryParams['dimensiones'] as string).split(',') : [],
        incluirDiario: queryParams['incluirDiario'] !== 'false',
        incluirMayor: queryParams['incluirMayor'] !== 'false',
        agruparPor: (queryParams['agruparPor'] as any) || 'NINGUNO',
        ordenarPor: (queryParams['ordenarPor'] as any) || 'CUENTA',
        orden: (queryParams['orden'] as 'ASC' | 'DESC') || 'ASC',
        pagina: queryParams['pagina'] ? parseInt(queryParams['pagina'] as string) : 1,
        registrosPorPagina: queryParams['registrosPorPagina'] ? parseInt(queryParams['registrosPorPagina'] as string) : 1000,
        formatoExportacion: (queryParams['formatoExportacion'] as any) || 'JSON',
        incluirTotales: queryParams['incluirTotales'] !== 'false',
        incluirSubtotales: queryParams['incluirSubtotales'] !== 'false'
      };

      // Validar filtros
      const errores = this.reporteService.validarFiltros(filtros);
      if (errores.length > 0) {
        res.status(400).json({
          success: false,
          message: 'Errores de validación en los filtros',
          errors: errores
        });
        return;
      }

      // Generar reporte
      const reporte = await this.reporteService.generarReporte(filtros);

      res.status(200).json(reporte);

    } catch (error) {
      console.error('Error en ReporteMovimientosContablesAgrupadosController.obtenerReporte:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error al generar el reporte de movimientos contables agrupados',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Exporta el reporte en el formato especificado
   */
  async exportarReporte(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const { formato } = req.query;
      const queryParams = req.query;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      if (!formato || !['EXCEL', 'PDF', 'CSV'].includes(formato as string)) {
        res.status(400).json({
          success: false,
          message: 'Formato de exportación no válido. Debe ser EXCEL, PDF o CSV'
        });
        return;
      }

      // Construir filtros
      const filtros: FiltrosReporteMovimientosContablesAgrupados = {
        conjunto,
        fechaInicio: queryParams['fechaInicio'] as string || '',
        fechaFin: queryParams['fechaFin'] as string || '',
        contabilidad: (queryParams['contabilidad'] as 'F' | 'A' | 'T') || 'T',
        cuentaContableDesde: queryParams['cuentaContableDesde'] as string || '',
        cuentaContableHasta: queryParams['cuentaContableHasta'] as string || '',
        nitDesde: queryParams['nitDesde'] as string || '',
        nitHasta: queryParams['nitHasta'] as string || '',
        asientoDesde: queryParams['asientoDesde'] as string || '',
        asientoHasta: queryParams['asientoHasta'] as string || '',
        fuentes: queryParams['fuentes'] ? (queryParams['fuentes'] as string).split(',') : [],
        dimensiones: queryParams['dimensiones'] ? (queryParams['dimensiones'] as string).split(',') : [],
        incluirDiario: queryParams['incluirDiario'] !== 'false',
        incluirMayor: queryParams['incluirMayor'] !== 'false',
        agruparPor: (queryParams['agruparPor'] as any) || 'NINGUNO',
        ordenarPor: (queryParams['ordenarPor'] as any) || 'CUENTA',
        orden: (queryParams['orden'] as 'ASC' | 'DESC') || 'ASC',
        incluirTotales: queryParams['incluirTotales'] !== 'false',
        incluirSubtotales: queryParams['incluirSubtotales'] !== 'false'
      };

      // Validar filtros
      const errores = this.reporteService.validarFiltros(filtros);
      if (errores.length > 0) {
        res.status(400).json({
          success: false,
          message: 'Errores de validación en los filtros',
          errors: errores
        });
        return;
      }

      // Exportar reporte
      const buffer = await this.reporteService.exportarReporte(filtros, formato as 'EXCEL' | 'PDF' | 'CSV');

      // Configurar headers de descarga
      const nombreArchivo = `reporte_movimientos_contables_agrupados_${conjunto}_${new Date().toISOString().split('T')[0]}.${(formato as string).toLowerCase()}`;
      
      res.setHeader('Content-Type', this.getContentType(formato as string));
      res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
      res.setHeader('Content-Length', buffer.length.toString());

      res.send(buffer);

    } catch (error) {
      console.error('Error en ReporteMovimientosContablesAgrupadosController.exportarReporte:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error al exportar el reporte de movimientos contables agrupados',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Obtiene estadísticas del reporte
   */
  async obtenerEstadisticas(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const queryParams = req.query;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      // Construir filtros
      const filtros: FiltrosReporteMovimientosContablesAgrupados = {
        conjunto,
        fechaInicio: queryParams['fechaInicio'] as string || '',
        fechaFin: queryParams['fechaFin'] as string || '',
        contabilidad: (queryParams['contabilidad'] as 'F' | 'A' | 'T') || 'T',
        cuentaContableDesde: queryParams['cuentaContableDesde'] as string || '',
        cuentaContableHasta: queryParams['cuentaContableHasta'] as string || '',
        nitDesde: queryParams['nitDesde'] as string || '',
        nitHasta: queryParams['nitHasta'] as string || '',
        asientoDesde: queryParams['asientoDesde'] as string || '',
        asientoHasta: queryParams['asientoHasta'] as string || '',
        fuentes: queryParams['fuentes'] ? (queryParams['fuentes'] as string).split(',') : [],
        dimensiones: queryParams['dimensiones'] ? (queryParams['dimensiones'] as string).split(',') : [],
        incluirDiario: queryParams['incluirDiario'] !== 'false',
        incluirMayor: queryParams['incluirMayor'] !== 'false',
        agruparPor: (queryParams['agruparPor'] as any) || 'NINGUNO',
        ordenarPor: (queryParams['ordenarPor'] as any) || 'CUENTA',
        orden: (queryParams['orden'] as 'ASC' | 'DESC') || 'ASC'
      };

      // Validar filtros
      const errores = this.reporteService.validarFiltros(filtros);
      if (errores.length > 0) {
        res.status(400).json({
          success: false,
          message: 'Errores de validación en los filtros',
          errors: errores
        });
        return;
      }

      // Obtener estadísticas
      const estadisticas = await this.reporteService.obtenerEstadisticas(filtros);

      res.status(200).json({
        success: true,
        message: 'Estadísticas obtenidas exitosamente',
        data: estadisticas
      });

    } catch (error) {
      console.error('Error en ReporteMovimientosContablesAgrupadosController.obtenerEstadisticas:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error al obtener estadísticas del reporte',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  private getContentType(formato: string): string {
    switch (formato.toUpperCase()) {
      case 'EXCEL':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'PDF':
        return 'application/pdf';
      case 'CSV':
        return 'text/csv';
      default:
        return 'application/octet-stream';
    }
  }
}
