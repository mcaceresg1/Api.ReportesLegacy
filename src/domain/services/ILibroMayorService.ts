import {
  LibroMayor,
  LibroMayorFiltros,
  LibroMayorResponse,
  GenerarLibroMayorParams,
  ExportarLibroMayorExcelParams,
  ExportarLibroMayorPDFParams,
  CuentaContableInfo,
  PeriodoContableInfo,
} from "../entities/LibroMayor";

export interface ILibroMayorService {
  /**
   * Obtiene las cuentas contables para un conjunto específico
   */
  obtenerCuentasContables(conjunto: string): Promise<CuentaContableInfo[]>;

  /**
   * Obtiene los períodos contables para un conjunto específico
   */
  obtenerPeriodosContables(conjunto: string): Promise<PeriodoContableInfo[]>;

  /**
   * Genera el reporte de Libro Mayor
   */
  generarReporte(
    conjunto: string,
    filtros: GenerarLibroMayorParams
  ): Promise<LibroMayorResponse>;

  /**
   * Obtiene los datos paginados del reporte
   */
  obtenerLibroMayor(
    conjunto: string,
    filtros: LibroMayorFiltros
  ): Promise<LibroMayorResponse>;

  /**
   * Exporta el reporte a Excel
   */
  exportarExcel(
    conjunto: string,
    filtros: ExportarLibroMayorExcelParams
  ): Promise<Buffer>;

  /**
   * Exporta el reporte a PDF
   */
  exportarPDF(
    conjunto: string,
    filtros: ExportarLibroMayorPDFParams
  ): Promise<Buffer>;
}
