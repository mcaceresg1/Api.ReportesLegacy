import { LibroMayor, LibroMayorFiltros, LibroMayorResponse } from '../entities/LibroMayor';

export interface ILibroMayorRepository {
  /**
   * Genera el reporte completo del libro mayor
   * Incluye saldos iniciales y movimientos del período
   */
  generarReporteLibroMayor(
    conjunto: string,
    usuario: string,
    fechaInicio: Date,
    fechaFin: Date
  ): Promise<void>;

  /**
   * Obtiene los datos del libro mayor con filtros y paginación
   */
  obtenerLibroMayor(
    filtros: LibroMayorFiltros
  ): Promise<LibroMayorResponse>;

  /**
   * Obtiene el conteo total de registros para paginación
   */
  obtenerTotalRegistros(
    conjunto: string,
    usuario: string,
    fechaInicio?: Date,
    fechaFin?: Date
  ): Promise<number>;

  /**
   * Limpia los datos temporales del usuario
   */
  limpiarDatosTemporales(
    conjunto: string,
    usuario: string
  ): Promise<void>;

  /**
   * Obtiene el período contable más reciente
   */
  obtenerPeriodoContableReciente(
    conjunto: string,
    fechaLimite: Date
  ): Promise<Date | null>;

  /**
   * Actualiza los períodos contables en los registros
   */
  actualizarPeriodosContables(
    conjunto: string,
    usuario: string
  ): Promise<void>;

  /**
   * Exporta el libro mayor a Excel
   */
  exportarExcel(
    conjunto: string,
    usuario: string,
    fechaInicio: Date,
    fechaFin: Date,
    limit?: number
  ): Promise<Buffer>;

  /**
   * Obtiene las cuentas contables para el filtro
   */
  obtenerCuentasContables(conjunto: string): Promise<any[]>;
}
