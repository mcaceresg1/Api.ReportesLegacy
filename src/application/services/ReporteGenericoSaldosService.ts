import { injectable, inject } from 'inversify';
import { IReporteGenericoSaldosService } from '../../domain/services/IReporteGenericoSaldosService';
import { IReporteGenericoSaldosRepository } from '../../domain/repositories/IReporteGenericoSaldosRepository';
import { 
  FiltrosReporteGenericoSaldos, 
  ReporteGenericoSaldos, 
  ReporteGenericoSaldosResponse,
  FiltroCuentaContable, 
  DetalleCuentaContable,
  FiltroTipoDocumento,
  FiltroTipoAsiento,
  FiltroClaseAsiento
} from '../../domain/entities/ReporteGenericoSaldos';

@injectable()
export class ReporteGenericoSaldosService implements IReporteGenericoSaldosService {
  constructor(
    @inject('IReporteGenericoSaldosRepository') 
    private reporteGenericoSaldosRepository: IReporteGenericoSaldosRepository
  ) {}

  /**
   * Obtiene el filtro de cuentas contables
   */
  async obtenerFiltroCuentasContables(conjunto: string): Promise<FiltroCuentaContable[]> {
    try {
      return await this.reporteGenericoSaldosRepository.obtenerFiltroCuentasContables(conjunto);
    } catch (error) {
      console.error('Error en ReporteGenericoSaldosService.obtenerFiltroCuentasContables:', error);
      throw new Error(`Error al obtener filtro de cuentas contables: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Obtiene el detalle de una cuenta contable específica
   */
  async obtenerDetalleCuentaContable(conjunto: string, cuentaContable: string): Promise<DetalleCuentaContable | null> {
    try {
      return await this.reporteGenericoSaldosRepository.obtenerDetalleCuentaContable(conjunto, cuentaContable);
    } catch (error) {
      console.error('Error en ReporteGenericoSaldosService.obtenerDetalleCuentaContable:', error);
      throw new Error(`Error al obtener detalle de cuenta contable: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Obtiene el filtro de tipos de documento
   */
  async obtenerFiltroTiposDocumento(conjunto: string): Promise<FiltroTipoDocumento[]> {
    try {
      return await this.reporteGenericoSaldosRepository.obtenerFiltroTiposDocumento(conjunto);
    } catch (error) {
      console.error('Error en ReporteGenericoSaldosService.obtenerFiltroTiposDocumento:', error);
      throw new Error(`Error al obtener filtro de tipos de documento: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Obtiene el filtro de tipos de asiento
   */
  async obtenerFiltroTiposAsiento(conjunto: string): Promise<FiltroTipoAsiento[]> {
    try {
      return await this.reporteGenericoSaldosRepository.obtenerFiltroTiposAsiento(conjunto);
    } catch (error) {
      console.error('Error en ReporteGenericoSaldosService.obtenerFiltroTiposAsiento:', error);
      throw new Error(`Error al obtener filtro de tipos de asiento: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Obtiene el filtro de clases de asiento
   */
  async obtenerFiltroClasesAsiento(conjunto: string): Promise<FiltroClaseAsiento[]> {
    try {
      return await this.reporteGenericoSaldosRepository.obtenerFiltroClasesAsiento(conjunto);
    } catch (error) {
      console.error('Error en ReporteGenericoSaldosService.obtenerFiltroClasesAsiento:', error);
      throw new Error(`Error al obtener filtro de clases de asiento: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Genera el reporte genérico de saldos
   */
  async generarReporteGenericoSaldos(
    conjunto: string,
    filtros: FiltrosReporteGenericoSaldos
  ): Promise<ReporteGenericoSaldosResponse> {
    try {
      // Validar parámetros requeridos
      if (!conjunto) {
        throw new Error('El parámetro conjunto es requerido');
      }

      if (!filtros.fechaInicio || !filtros.fechaFin) {
        throw new Error('Las fechas de inicio y fin son requeridas');
      }

      // Validar formato de fechas
      const fechaInicio = new Date(filtros.fechaInicio);
      const fechaFin = new Date(filtros.fechaFin);

      if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
        throw new Error('Las fechas deben tener un formato válido');
      }

      if (fechaInicio >= fechaFin) {
        throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
      }

      return await this.reporteGenericoSaldosRepository.generarReporteGenericoSaldos(conjunto, filtros);
    } catch (error) {
      console.error('Error en ReporteGenericoSaldosService.generarReporteGenericoSaldos:', error);
      throw new Error(`Error al generar reporte genérico de saldos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Exporta el reporte a Excel
   */
  async exportarExcel(conjunto: string, filtros: FiltrosReporteGenericoSaldos): Promise<Buffer> {
    try {
      // Validar parámetros requeridos
      if (!conjunto) {
        throw new Error('El parámetro conjunto es requerido');
      }

      if (!filtros.fechaInicio || !filtros.fechaFin) {
        throw new Error('Las fechas de inicio y fin son requeridas');
      }

      return await this.reporteGenericoSaldosRepository.exportarExcel(conjunto, filtros);
    } catch (error) {
      console.error('Error en ReporteGenericoSaldosService.exportarExcel:', error);
      throw new Error(`Error al exportar Excel: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Exporta el reporte a PDF
   */
  async exportarPDF(conjunto: string, filtros: FiltrosReporteGenericoSaldos): Promise<Buffer> {
    try {
      // Validar parámetros requeridos
      if (!conjunto) {
        throw new Error('El parámetro conjunto es requerido');
      }

      if (!filtros.fechaInicio || !filtros.fechaFin) {
        throw new Error('Las fechas de inicio y fin son requeridas');
      }

      return await this.reporteGenericoSaldosRepository.exportarPDF(conjunto, filtros);
    } catch (error) {
      console.error('Error en ReporteGenericoSaldosService.exportarPDF:', error);
      throw new Error(`Error al exportar PDF: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Limpia el caché de tablas temporales
   */
  async limpiarCache(): Promise<void> {
    try {
      await this.reporteGenericoSaldosRepository.limpiarCache();
    } catch (error) {
      console.error('Error en ReporteGenericoSaldosService.limpiarCache:', error);
      throw new Error(`Error al limpiar caché: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Obtiene estadísticas del caché
   */
  obtenerEstadisticasCache(): { totalTablas: number; tablas: any[] } {
    try {
      return this.reporteGenericoSaldosRepository.obtenerEstadisticasCache();
    } catch (error) {
      console.error('Error en ReporteGenericoSaldosService.obtenerEstadisticasCache:', error);
      throw new Error(`Error al obtener estadísticas del caché: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}
