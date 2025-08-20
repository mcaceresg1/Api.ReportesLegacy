import { 
  DiarioContabilidad, 
  DiarioContabilidadFiltros, 
  DiarioContabilidadResponse,
  GenerarDiarioContabilidadParams,
  ExportarDiarioContabilidadExcelParams
} from '../entities/DiarioContabilidad';

/**
 * Interface para el repositorio de Diario de Contabilidad
 * Define los contratos para todas las operaciones relacionadas con el reporte de Diario de Contabilidad
 */
export interface IDiarioContabilidadRepository {
  /**
   * Genera el reporte de Diario de Contabilidad
   * Crea la tabla temporal y ejecuta los inserts desde MAYOR y DIARIO
   * @param conjunto - Código del conjunto contable
   * @param usuario - Usuario que genera el reporte
   * @param fechaInicio - Fecha de inicio del período
   * @param fechaFin - Fecha de fin del período
   * @param contabilidad - Tipo de contabilidad ('F', 'A')
   * @param tipoReporte - Tipo de reporte ('Preliminar', 'Oficial')
   */
  generarReporteDiarioContabilidad(
    conjunto: string,
    usuario: string,
    fechaInicio: Date,
    fechaFin: Date,
    contabilidad?: string,
    tipoReporte?: string
  ): Promise<void>;

  /**
   * Obtiene los datos del Diario de Contabilidad con filtros y paginación
   * @param filtros - Filtros para la consulta
   * @returns Respuesta paginada con los datos del diario
   */
  obtenerDiarioContabilidad(filtros: DiarioContabilidadFiltros): Promise<DiarioContabilidadResponse>;

  /**
   * Obtiene el total de registros que coinciden con los filtros
   * @param filtros - Filtros para contar registros
   * @returns Número total de registros
   */
  obtenerTotalRegistros(filtros: Omit<DiarioContabilidadFiltros, 'limit' | 'offset' | 'page'>): Promise<number>;

  /**
   * Limpia los datos temporales del reporte
   * @param conjunto - Código del conjunto contable
   * @param usuario - Usuario propietario de los datos
   */
  limpiarDatosTemporales(conjunto: string, usuario: string): Promise<void>;

  /**
   * Verifica si existe la tabla temporal para el reporte
   * @param conjunto - Código del conjunto contable
   * @returns true si la tabla existe, false en caso contrario
   */
  existeTablaReporte(conjunto: string): Promise<boolean>;

  /**
   * Crea la tabla temporal para el reporte si no existe
   * @param conjunto - Código del conjunto contable
   */
  crearTablaReporte(conjunto: string): Promise<void>;

  /**
   * Exporta los datos del Diario de Contabilidad a Excel
   * @param conjunto - Código del conjunto contable
   * @param usuario - Usuario que exporta
   * @param fechaInicio - Fecha de inicio del período
   * @param fechaFin - Fecha de fin del período
   * @param contabilidad - Tipo de contabilidad
   * @param tipoReporte - Tipo de reporte
   * @param limit - Límite de registros a exportar
   * @returns Buffer con el archivo Excel
   */
  exportarExcel(
    conjunto: string,
    usuario: string,
    fechaInicio: Date,
    fechaFin: Date,
    contabilidad?: string,
    tipoReporte?: string,
    limit?: number
  ): Promise<Buffer>;

  /**
   * Obtiene información de auditoría del reporte
   * @param conjunto - Código del conjunto contable
   * @param usuario - Usuario del reporte
   * @returns Información de auditoría (fechas, registros, etc.)
   */
  obtenerInformacionAuditoria(conjunto: string, usuario: string): Promise<{
    fechaGeneracion?: Date;
    totalRegistros: number;
    fechaInicio?: Date;
    fechaFin?: Date;
    usuario: string;
  }>;
}
