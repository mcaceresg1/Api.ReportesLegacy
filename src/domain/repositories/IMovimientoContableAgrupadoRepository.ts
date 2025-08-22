import { 
  MovimientoContableAgrupadoItem,
  FiltroMovimientoContableAgrupado,
  MovimientoContableAgrupadoCreate
} from '../entities/MovimientoContableAgrupado';

export interface IMovimientoContableAgrupadoRepository {
  /**
   * Genera el reporte de movimientos contables agrupados por NIT con dimensión contable
   */
  generarReporte(filtros: FiltroMovimientoContableAgrupado): Promise<MovimientoContableAgrupadoItem[]>;

  /**
   * Obtiene los movimientos contables agrupados con paginación
   */
  obtenerMovimientos(filtros: FiltroMovimientoContableAgrupado, limit?: number, offset?: number): Promise<{
    data: MovimientoContableAgrupadoItem[];
    total: number;
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
   * Verifica el estado de salud del repositorio
   */
  health(): Promise<boolean>;
}
