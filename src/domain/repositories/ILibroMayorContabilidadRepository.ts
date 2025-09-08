import { LibroMayorContabilidad, FiltrosLibroMayorContabilidad, CuentaContableInfo, PeriodoContableInfo } from '../entities/LibroMayorContabilidad';

export interface ILibroMayorContabilidadRepository {
  /**
   * Obtiene las cuentas contables disponibles para un conjunto específico
   */
  obtenerCuentasContables(conjunto: string): Promise<CuentaContableInfo[]>;

  /**
   * Obtiene los períodos contables disponibles para un conjunto específico
   */
  obtenerPeriodosContables(conjunto: string): Promise<PeriodoContableInfo[]>;

  /**
   * Genera el reporte de Libro Mayor de Contabilidad
   */
  generarReporte(filtros: FiltrosLibroMayorContabilidad): Promise<LibroMayorContabilidad[]>;

  /**
   * Obtiene el reporte de Libro Mayor de Contabilidad con paginación
   */
  obtenerLibroMayorContabilidad(filtros: FiltrosLibroMayorContabilidad): Promise<{
    data: LibroMayorContabilidad[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>;

  /**
   * Exporta el reporte a Excel
   */
  exportarExcel(filtros: FiltrosLibroMayorContabilidad): Promise<Buffer>;

  /**
   * Exporta el reporte a PDF
   */
  exportarPDF(filtros: FiltrosLibroMayorContabilidad): Promise<Buffer>;
}
