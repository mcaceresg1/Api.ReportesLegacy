import { 
  MovimientoContableAgrupadoItem,
  FiltroMovimientoContableAgrupado,
  MovimientoContableAgrupadoCreate,
  NitCompleto
} from '../entities/MovimientoContableAgrupado';

export interface IMovimientoContableAgrupadoRepository {
  /**
   * Genera el reporte de movimientos contables agrupados por NIT con dimensión contable
   */
  generarReporte(filtros: FiltroMovimientoContableAgrupado, page?: number, limit?: number): Promise<{
    success: boolean;
    data: MovimientoContableAgrupadoItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    message: string;
  }>;

  /**
   * Obtiene los movimientos contables agrupados con paginación estandarizada
   * Si no se especifica limit, retorna todos los registros
   */
  obtenerMovimientos(filtros: FiltroMovimientoContableAgrupado, page?: number, limit?: number): Promise<{
    success: boolean;
    data: MovimientoContableAgrupadoItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    message: string;
  }>;

  /**
   * Limpia la tabla temporal de resultados
   */
  limpiarTablaTemp(conjunto: string): Promise<void>;

  /**
   * Obtiene las cuentas contables disponibles para filtros
   */
  obtenerCuentasContables(conjunto: string): Promise<Array<{
    cuenta_contable: string;
    descripcion: string;
  }>>;

  /**
   * Obtiene los NITs disponibles para filtros
   */
  obtenerNits(conjunto: string): Promise<Array<{
    nit: string;
    razon_social: string;
  }>>;

  /**
   * Obtiene las dimensiones contables disponibles
   */
  obtenerDimensiones(conjunto: string): Promise<Array<{
    dimension: string;
    dimension_desc: string;
  }>>;

  /**
   * Obtiene las fuentes disponibles
   */
  obtenerFuentes(conjunto: string): Promise<Array<{
    fuente: string;
  }>>;

  /**
   * Obtiene información completa de un NIT específico
   */
  obtenerNitCompleto(conjunto: string, nit: string): Promise<NitCompleto | null>;

  /**
   * Obtiene lista de NITs completos con paginación estandarizada
   * Si no se especifica limit, retorna todos los registros
   */
  obtenerNitsCompletos(conjunto: string, page?: number, limit?: number, filtro?: string): Promise<{
    success: boolean;
    data: NitCompleto[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    message: string;
  }>;

  /**
   * Verifica el estado de salud del repositorio
   */
  health(): Promise<boolean>;
}
