import { ReporteLibroMayorItem, FiltrosReporteLibroMayor, ResumenLibroMayor } from '../entities/ReporteLibroMayor';

export interface IReporteLibroMayorRepository {
  /**
   * Genera el reporte de Libro Mayor de Contabilidad
   * @param filtros Filtros aplicados al reporte
   * @returns Promise con los datos del reporte
   */
  generarReporteLibroMayor(filtros: FiltrosReporteLibroMayor): Promise<ReporteLibroMayorItem[]>;
  
  /**
   * Obtiene el resumen del reporte de Libro Mayor
   * @param filtros Filtros aplicados al reporte
   * @returns Promise con el resumen del reporte
   */
  obtenerResumenLibroMayor(filtros: FiltrosReporteLibroMayor): Promise<ResumenLibroMayor>;
  
  /**
   * Limpia los datos temporales del reporte para un usuario específico
   * @param usuario Usuario que solicita la limpieza
   * @returns Promise con el resultado de la operación
   */
  limpiarDatosTemporales(usuario: string): Promise<boolean>;
  
  /**
   * Obtiene el período contable más reciente antes de una fecha específica
   * @param fecha Fecha límite para buscar el período
   * @param contabilidad Tipo de contabilidad (F=Fiscal, A=Administrativa)
   * @returns Promise con la fecha del período contable
   */
  obtenerPeriodoContableReciente(fecha: Date, contabilidad: 'F' | 'A'): Promise<Date>;
  
  /**
   * Inserta los saldos iniciales en la tabla temporal
   * @param usuario Usuario que solicita el reporte
   * @param fechaInicio Fecha de inicio del reporte
   * @param fechaFin Fecha de fin del reporte
   * @param contabilidad Tipo de contabilidad
   * @returns Promise con el resultado de la operación
   */
  insertarSaldosIniciales(
    usuario: string, 
    fechaInicio: Date, 
    fechaFin: Date, 
    contabilidad: 'F' | 'A'
  ): Promise<boolean>;
  
  /**
   * Inserta los movimientos del mayor en la tabla temporal
   * @param usuario Usuario que solicita el reporte
   * @param fechaInicio Fecha de inicio del reporte
   * @param fechaFin Fecha de fin del reporte
   * @param contabilidad Tipo de contabilidad
   * @returns Promise con el resultado de la operación
   */
  insertarMovimientosMayor(
    usuario: string, 
    fechaInicio: Date, 
    fechaFin: Date, 
    contabilidad: 'F' | 'A'
  ): Promise<boolean>;
  
  /**
   * Inserta los movimientos del diario en la tabla temporal
   * @param usuario Usuario que solicita el reporte
   * @param fechaInicio Fecha de inicio del reporte
   * @param fechaFin Fecha de fin del reporte
   * @param contabilidad Tipo de contabilidad
   * @returns Promise con el resultado de la operación
   */
  insertarMovimientosDiario(
    usuario: string, 
    fechaInicio: Date, 
    fechaFin: Date, 
    contabilidad: 'F' | 'A'
  ): Promise<boolean>;
  
  /**
   * Actualiza los períodos contables en la tabla temporal
   * @param usuario Usuario que solicita el reporte
   * @returns Promise con el resultado de la operación
   */
  actualizarPeriodosContables(usuario: string): Promise<boolean>;
  
  /**
   * Transfiere los datos de la tabla temporal a la tabla de reporte XML
   * @param usuario Usuario que solicita el reporte
   * @returns Promise con el resultado de la operación
   */
  transferirDatosATablaXML(usuario: string): Promise<boolean>;
  
  /**
   * Ejecuta el procedimiento almacenado para obtener el reporte final
   * @returns Promise con los datos del reporte
   */
  ejecutarProcedimientoReporte(): Promise<ReporteLibroMayorItem[]>;
  
  /**
   * Valida que los datos del reporte estén completos
   * @param usuario Usuario que solicita el reporte
   * @returns Promise con el resultado de la validación
   */
  validarDatosReporte(usuario: string): Promise<boolean>;
}

