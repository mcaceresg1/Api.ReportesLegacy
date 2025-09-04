import { 
  EstadoSituacionFinanciera, 
  FiltrosEstadoSituacionFinanciera, 
  EstadoSituacionFinancieraRequest,
  EstadoSituacionFinancieraResponse,
  TipoBalanceInfo,
  PeriodoContableInfo,
  TiposBalanceResponse,
  PeriodosContablesResponse,
  GenerarEstadoSituacionFinancieraParams,
  ExportarEstadoSituacionFinancieraExcelParams,
  ExportarEstadoSituacionFinancieraPDFParams
} from '../entities/EstadoSituacionFinanciera';

export interface IEstadoSituacionFinancieraService {
  /**
   * Obtiene los tipos de balance disponibles
   */
  obtenerTiposBalance(conjunto: string, usuario?: string): Promise<TiposBalanceResponse>;

  /**
   * Obtiene los períodos contables disponibles
   */
  obtenerPeriodosContables(conjunto: string, fecha: string): Promise<PeriodosContablesResponse>;

  /**
   * Genera el reporte de Estado de Situación Financiera
   */
  generarReporte(params: GenerarEstadoSituacionFinancieraParams): Promise<boolean>;

  /**
   * Obtiene los datos del Estado de Situación Financiera
   */
  obtenerEstadoSituacionFinanciera(request: EstadoSituacionFinancieraRequest): Promise<EstadoSituacionFinancieraResponse>;

  /**
   * Exporta el reporte a Excel
   */
  exportarExcel(params: ExportarEstadoSituacionFinancieraExcelParams): Promise<Buffer>;

  /**
   * Exporta el reporte a PDF
   */
  exportarPDF(params: ExportarEstadoSituacionFinancieraPDFParams): Promise<Buffer>;
}
