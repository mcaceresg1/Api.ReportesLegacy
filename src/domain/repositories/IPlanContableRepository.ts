import { PlanContableItem, PlanContableFiltros, PlanContableResponse, GlobalConfig, PlanContableCreate } from '../entities/PlanContable';

/**
 * Interfaz del repositorio para Plan Contable
 * Define las operaciones de acceso a datos para el Plan Contable
 */
export interface IPlanContableRepository {
  /**
   * Genera el reporte del Plan Contable
   * Crea la tabla temporal y ejecuta el procedimiento almacenado
   * @param conjunto Código del conjunto contable
   * @param usuario Usuario que solicita el reporte
   */
  generarReportePlanContable(conjunto: string, usuario: string): Promise<void>;

  /**
   * Obtiene las cuentas contables con filtros y paginación
   * @param filtros Filtros para la consulta
   */
  obtenerPlanContable(filtros: PlanContableFiltros): Promise<PlanContableResponse>;

  /**
   * Obtiene la configuración global del Plan Contable
   * @param conjunto Código del conjunto contable
   */
  obtenerConfiguracionGlobal(conjunto: string): Promise<GlobalConfig | null>;

  /**
   * Obtiene todas las cuentas contables básicas (sin filtros)
   * @param conjunto Código del conjunto contable
   */
  obtenerCuentasContables(conjunto: string): Promise<{ cuenta_contable: string; descripcion: string }[]>;

  /**
   * Crea una nueva cuenta contable en la tabla temporal
   * @param conjunto Código del conjunto contable
   * @param cuenta Datos de la cuenta contable a crear
   */
  crearCuentaContable(conjunto: string, cuenta: PlanContableCreate): Promise<PlanContableItem>;

  /**
   * Exporta el Plan Contable a Excel
   * @param conjunto Código del conjunto contable
   * @param usuario Usuario que solicita la exportación
   * @param filtros Filtros aplicados
   * @param limite Límite de registros a exportar
   */
  exportarExcel(conjunto: string, usuario: string, filtros: PlanContableFiltros, limite?: number): Promise<Buffer>;

  /**
   * Limpia los datos temporales del Plan Contable
   * @param conjunto Código del conjunto contable
   */
  limpiarDatosTemporales(conjunto: string): Promise<void>;

  /**
   * Verifica si existe la tabla temporal del Plan Contable
   * @param conjunto Código del conjunto contable
   */
  existeTablaReporte(conjunto: string): Promise<boolean>;

  /**
   * Crea la tabla temporal del Plan Contable
   * @param conjunto Código del conjunto contable
   */
  crearTablaReporte(conjunto: string): Promise<void>;

  /**
   * Obtiene el total de registros sin paginación
   * @param filtros Filtros para la consulta
   */
  obtenerTotalRegistros(filtros: PlanContableFiltros): Promise<number>;
}
