import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { IReporteLibroMayorService } from '../../domain/services/IReporteLibroMayorService';
import { FiltrosReporteLibroMayor } from '../../domain/entities/ReporteLibroMayor';

@injectable()
export class ReporteLibroMayorController {
  constructor(
    @inject('IReporteLibroMayorService') private readonly reporteLibroMayorService: IReporteLibroMayorService
  ) {}

  /**
   * Genera el reporte completo de Libro Mayor de Contabilidad
   */
  async generarReporteCompleto(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const filtros = this.extraerFiltrosDeQuery(req.query);
      
      // Validar que se proporcione el conjunto
      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido',
          error: 'MISSING_CONJUNTO'
        });
        return;
      }

      // Validar filtros básicos
      if (!filtros.usuario || !filtros.fechaInicio || !filtros.fechaFin) {
        res.status(400).json({
          success: false,
          message: 'Los parámetros usuario, fechaInicio y fechaFin son requeridos',
          error: 'MISSING_REQUIRED_PARAMS'
        });
        return;
      }

      const inicio = new Date();
      const reporte = await this.reporteLibroMayorService.generarReporteCompleto(filtros);

      res.json({
        success: true,
        message: 'Reporte de Libro Mayor generado exitosamente',
        data: reporte,
        metadata: {
          conjunto,
          tiempoProcesamiento: new Date().getTime() - inicio.getTime(),
          fechaGeneracion: new Date()
        }
      });
    } catch (error) {
      console.error('Error en generarReporteCompleto:', error);
      res.status(500).json({
        success: false,
        message: 'Error al generar reporte de Libro Mayor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Genera solo los datos del reporte sin resumen
   */
  async generarDatosReporte(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const filtros = this.extraerFiltrosDeQuery(req.query);
      
      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido',
          error: 'MISSING_CONJUNTO'
        });
        return;
      }

      if (!filtros.usuario || !filtros.fechaInicio || !filtros.fechaFin) {
        res.status(400).json({
          success: false,
          message: 'Los parámetros usuario, fechaInicio y fechaFin son requeridos',
          error: 'MISSING_REQUIRED_PARAMS'
        });
        return;
      }

      const inicio = new Date();
      const datos = await this.reporteLibroMayorService.generarDatosReporte(filtros);

      res.json({
        success: true,
        message: 'Datos del reporte de Libro Mayor generados exitosamente',
        data: {
          items: datos,
          totalRegistros: datos.length
        },
        metadata: {
          conjunto,
          tiempoProcesamiento: new Date().getTime() - inicio.getTime(),
          fechaGeneracion: new Date()
        }
      });
    } catch (error) {
      console.error('Error en generarDatosReporte:', error);
      res.status(500).json({
        success: false,
        message: 'Error al generar datos del reporte de Libro Mayor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Obtiene solo el resumen del reporte
   */
  async obtenerResumenReporte(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const filtros = this.extraerFiltrosDeQuery(req.query);
      
      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido',
          error: 'MISSING_CONJUNTO'
        });
        return;
      }

      if (!filtros.usuario || !filtros.fechaInicio || !filtros.fechaFin) {
        res.status(400).json({
          success: false,
          message: 'Los parámetros usuario, fechaInicio y fechaFin son requeridos',
          error: 'MISSING_REQUIRED_PARAMS'
        });
        return;
      }

      const inicio = new Date();
      const resumen = await this.reporteLibroMayorService.obtenerResumenReporte(filtros);

      res.json({
        success: true,
        message: 'Resumen del reporte de Libro Mayor obtenido exitosamente',
        data: resumen,
        metadata: {
          conjunto,
          tiempoProcesamiento: new Date().getTime() - inicio.getTime(),
          fechaGeneracion: new Date()
        }
      });
    } catch (error) {
      console.error('Error en obtenerResumenReporte:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener resumen del reporte de Libro Mayor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Exporta el reporte en formato específico
   */
  async exportarReporte(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const { formato = 'EXCEL' } = req.query;
      const filtros = this.extraerFiltrosDeQuery(req.query);
      
      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido',
          error: 'MISSING_CONJUNTO'
        });
        return;
      }

      if (!filtros.usuario || !filtros.fechaInicio || !filtros.fechaFin) {
        res.status(400).json({
          success: false,
          message: 'Los parámetros usuario, fechaInicio y fechaFin son requeridos',
          error: 'MISSING_REQUIRED_PARAMS'
        });
        return;
      }

      if (!['EXCEL', 'PDF', 'CSV', 'HTML'].includes(formato as string)) {
        res.status(400).json({
          success: false,
          message: 'Formato de exportación no válido',
          error: 'INVALID_FORMAT'
        });
        return;
      }

      const inicio = new Date();
      const datos = await this.reporteLibroMayorService.generarDatosReporte(filtros);
      const archivo = await this.reporteLibroMayorService.exportarReporte(datos, formato as 'EXCEL' | 'PDF' | 'CSV' | 'HTML');

      // Configurar headers para descarga
      const nombreArchivo = `LibroMayor_${conjunto}_${filtros.fechaInicio.toISOString().split('T')[0]}_${filtros.fechaFin.toISOString().split('T')[0]}.${typeof formato === 'string' ? formato.toLowerCase() : 'xlsx'}`;
      
      res.setHeader('Content-Type', this.obtenerContentType(formato as string));
      res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
      res.setHeader('Content-Length', archivo.length.toString());

      res.send(archivo);
    } catch (error) {
      console.error('Error en exportarReporte:', error);
      res.status(500).json({
        success: false,
        message: 'Error al exportar reporte de Libro Mayor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Valida los filtros del reporte
   */
  async validarFiltros(req: Request, res: Response): Promise<void> {
    try {
      const filtros = this.extraerFiltrosDeQuery(req.query);
      const validacion = await this.reporteLibroMayorService.validarFiltros(filtros);

      res.json({
        success: true,
        message: 'Validación de filtros completada',
        data: validacion
      });
    } catch (error) {
      console.error('Error en validarFiltros:', error);
      res.status(500).json({
        success: false,
        message: 'Error al validar filtros',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Extrae y convierte los filtros de la query string
   */
  private extraerFiltrosDeQuery(query: any): FiltrosReporteLibroMayor {
    const filtros: FiltrosReporteLibroMayor = {
      usuario: query.usuario || '',
      fechaInicio: query.fechaInicio ? new Date(query.fechaInicio) : new Date(),
      fechaFin: query.fechaFin ? new Date(query.fechaFin) : new Date(),
      contabilidad: (query.contabilidad as 'F' | 'A' | 'T') || 'T',
      
      // Filtros de cuenta contable
      cuentasContables: this.parseArrayParam(query.cuentasContables),
      cuentasContablesExcluir: this.parseArrayParam(query.cuentasContablesExcluir),
      criteriosCuentaContable: [],
      
      // Filtros de centro de costo
      centrosCosto: this.parseArrayParam(query.centrosCosto),
      centrosCostoExcluir: this.parseArrayParam(query.centrosCostoExcluir),
      
      // Filtros de NIT
      nits: this.parseArrayParam(query.nits),
      nitsExcluir: this.parseArrayParam(query.nitsExcluir),
      
      // Filtros de asiento
      asientos: this.parseArrayParam(query.asientos),
      asientosExcluir: this.parseArrayParam(query.asientosExcluir),
      rangoAsientos: {
        desde: query.rangoAsientosDesde || '',
        hasta: query.rangoAsientosHasta || ''
      },
      
      // Filtros de tipo de asiento
      tiposAsiento: this.parseArrayParam(query.tiposAsiento),
      tiposAsientoExcluir: this.parseArrayParam(query.tiposAsientoExcluir),
      
      // Filtros de clase asiento
      clasesAsiento: this.parseArrayParam(query.clasesAsiento),
      clasesAsientoExcluir: this.parseArrayParam(query.clasesAsientoExcluir),
      
      // Filtros de origen
      origenes: this.parseArrayParam(query.origenes),
      origenesExcluir: this.parseArrayParam(query.origenesExcluir),
      
      // Filtros de fuente
      fuentes: this.parseArrayParam(query.fuentes),
      fuentesExcluir: this.parseArrayParam(query.fuentesExcluir),
      
      // Filtros de referencia
      referencias: this.parseArrayParam(query.referencias),
      referenciasExcluir: this.parseArrayParam(query.referenciasExcluir),
      
      // Filtros de documento
      documentos: this.parseArrayParam(query.documentos),
      documentosExcluir: this.parseArrayParam(query.documentosExcluir),
      
      // Filtros de período contable
      periodosContables: this.parseArrayParam(query.periodosContables),
      periodosContablesExcluir: this.parseArrayParam(query.periodosContablesExcluir),
      
      // Filtros de saldos
      saldoMinimo: query.saldoMinimo ? parseFloat(query.saldoMinimo) : 0,
      saldoMaximo: query.saldoMaximo ? parseFloat(query.saldoMaximo) : 0,
      saldoMinimoDolar: query.saldoMinimoDolar ? parseFloat(query.saldoMinimoDolar) : 0,
      saldoMaximoDolar: query.saldoMaximoDolar ? parseFloat(query.saldoMaximoDolar) : 0,
      
      // Filtros de movimientos
      movimientoMinimo: query.movimientoMinimo ? parseFloat(query.movimientoMinimo) : 0,
      movimientoMaximo: query.movimientoMaximo ? parseFloat(query.movimientoMaximo) : 0,
      movimientoMinimoDolar: query.movimientoMinimoDolar ? parseFloat(query.movimientoMinimoDolar) : 0,
      movimientoMaximoDolar: query.movimientoMaximoDolar ? parseFloat(query.movimientoMaximoDolar) : 0,
      
      // Filtros de títulos
      titulo: query.titulo || '',
      subtitulo: query.subtitulo || '',
      piePagina: query.piePagina || '',
      mostrarTitulo: query.mostrarTitulo !== 'false',
      mostrarSubtitulo: query.mostrarSubtitulo !== 'false',
      mostrarPiePagina: query.mostrarPiePagina !== 'false',
      
      // Filtros de formato
      formatoExportacion: (query.formatoExportacion as 'EXCEL' | 'PDF' | 'CSV' | 'HTML') || 'EXCEL',
      incluirTotales: query.incluirTotales !== 'false',
      incluirSubtotales: query.incluirSubtotales !== 'false',
      agruparPor: (query.agruparPor as any) || 'NINGUNO',
      ordenarPor: (query.ordenarPor as any) || 'FECHA',
      orden: (query.orden as 'ASC' | 'DESC') || 'ASC',
      mostrarFiltros: query.mostrarFiltros !== 'false',
      mostrarResumen: query.mostrarResumen !== 'false',
      maximoRegistros: query.maximoRegistros ? parseInt(query.maximoRegistros) : 10000,
      incluirGraficos: query.incluirGraficos === 'true',
      incluirCalculos: query.incluirCalculos !== 'false',
      
      // Filtros específicos del Libro Mayor
      incluirSaldosIniciales: query.incluirSaldosIniciales !== 'false',
      incluirMovimientos: query.incluirMovimientos !== 'false',
      incluirSaldosFinales: query.incluirSaldosFinales !== 'false',
      mostrarSoloCuentasConMovimiento: query.mostrarSoloCuentasConMovimiento === 'true',
      mostrarSoloCuentasConSaldo: query.mostrarSoloCuentasConSaldo === 'true',
      agruparPorPeriodoContable: query.agruparPorPeriodoContable === 'true',
      incluirTotalesPorCuenta: query.incluirTotalesPorCuenta !== 'false',
      incluirTotalesPorCentroCosto: query.incluirTotalesPorCentroCosto !== 'false',
      incluirTotalesPorPeriodo: query.incluirTotalesPorPeriodo !== 'false'
    };

    return filtros;
  }

  /**
   * Parsea parámetros de array desde la query string
   */
  private parseArrayParam(param: any): string[] {
    if (!param) return [];
    if (Array.isArray(param)) return param;
    if (typeof param === 'string') {
      return param.split(',').map(item => item.trim()).filter(item => item.length > 0);
    }
    return [];
  }

  /**
   * Obtiene el Content-Type para el formato de exportación
   */
  private obtenerContentType(formato: string): string {
    switch (formato.toUpperCase()) {
      case 'EXCEL':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'PDF':
        return 'application/pdf';
      case 'CSV':
        return 'text/csv';
      case 'HTML':
        return 'text/html';
      default:
        return 'application/octet-stream';
    }
  }
}
