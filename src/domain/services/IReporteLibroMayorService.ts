import { ReporteLibroMayorItem, FiltrosReporteLibroMayor, ResumenLibroMayor, ReporteLibroMayorResponse } from '../entities/ReporteLibroMayor';

export interface IReporteLibroMayorService {
  /**
   * Genera el reporte completo de Libro Mayor de Contabilidad
   * @param filtros Filtros aplicados al reporte
   * @returns Promise con la respuesta completa del reporte
   */
  generarReporteCompleto(filtros: FiltrosReporteLibroMayor): Promise<ReporteLibroMayorResponse>;
  
  /**
   * Genera solo los datos del reporte sin resumen
   * @param filtros Filtros aplicados al reporte
   * @returns Promise con los datos del reporte
   */
  generarDatosReporte(filtros: FiltrosReporteLibroMayor): Promise<ReporteLibroMayorItem[]>;
  
  /**
   * Obtiene solo el resumen del reporte
   * @param filtros Filtros aplicados al reporte
   * @returns Promise con el resumen del reporte
   */
  obtenerResumenReporte(filtros: FiltrosReporteLibroMayor): Promise<ResumenLibroMayor>;
  
  /**
   * Valida los filtros del reporte antes de procesar
   * @param filtros Filtros a validar
   * @returns Promise con el resultado de la validación
   */
  validarFiltros(filtros: FiltrosReporteLibroMayor): Promise<{ valido: boolean; errores: string[] }>;
  
  /**
   * Prepara los filtros para el procesamiento (conversiones, validaciones, etc.)
   * @param filtros Filtros originales
   * @returns Promise con los filtros procesados
   */
  prepararFiltros(filtros: FiltrosReporteLibroMayor): Promise<FiltrosReporteLibroMayor>;
  
  /**
   * Aplica filtros adicionales de seguridad y permisos
   * @param filtros Filtros originales
   * @param usuario Usuario que solicita el reporte
   * @returns Promise con los filtros con restricciones aplicadas
   */
  aplicarRestriccionesSeguridad(filtros: FiltrosReporteLibroMayor, usuario: string): Promise<FiltrosReporteLibroMayor>;
  
  /**
   * Genera el reporte en formato específico (Excel, PDF, etc.)
   * @param datos Datos del reporte
   * @param formato Formato de salida
   * @returns Promise con el archivo generado
   */
  exportarReporte(datos: ReporteLibroMayorItem[], formato: 'EXCEL' | 'PDF' | 'CSV' | 'HTML'): Promise<Buffer>;
  
  /**
   * Calcula totales y subtotales según la configuración de agrupación
   * @param datos Datos del reporte
   * @param agruparPor Criterio de agrupación
   * @returns Promise con los datos agrupados y totalizados
   */
  calcularTotalesYSubtotales(
    datos: ReporteLibroMayorItem[], 
    agruparPor: 'NINGUNO' | 'CUENTA' | 'CENTRO_COSTO' | 'TIPO_ASIENTO' | 'CLASE_ASIENTO' | 'FECHA' | 'USUARIO' | 'PERIODO_CONTABLE'
  ): Promise<ReporteLibroMayorItem[]>;
  
  /**
   * Ordena los datos según los criterios especificados
   * @param datos Datos a ordenar
   * @param ordenarPor Campo por el cual ordenar
   * @param orden Dirección del ordenamiento
   * @returns Promise con los datos ordenados
   */
  ordenarDatos(
    datos: ReporteLibroMayorItem[], 
    ordenarPor: 'FECHA' | 'CUENTA' | 'CENTRO_COSTO' | 'TIPO_ASIENTO' | 'CLASE_ASIENTO' | 'USUARIO' | 'VALOR' | 'PERIODO_CONTABLE',
    orden: 'ASC' | 'DESC'
  ): Promise<ReporteLibroMayorItem[]>;
  
  /**
   * Aplica filtros de rango a los datos
   * @param datos Datos a filtrar
   * @param filtros Filtros a aplicar
   * @returns Promise con los datos filtrados
   */
  aplicarFiltrosRango(datos: ReporteLibroMayorItem[], filtros: FiltrosReporteLibroMayor): Promise<ReporteLibroMayorItem[]>;
  
  /**
   * Limita el número de registros según la configuración
   * @param datos Datos a limitar
   * @param maximoRegistros Número máximo de registros
   * @returns Promise con los datos limitados
   */
  limitarRegistros(datos: ReporteLibroMayorItem[], maximoRegistros: number): Promise<ReporteLibroMayorItem[]>;
  
  /**
   * Genera metadatos del reporte (tiempo de procesamiento, etc.)
   * @param inicio Tiempo de inicio del procesamiento
   * @param datos Datos procesados
   * @returns Promise con los metadatos generados
   */
  generarMetadatos(inicio: Date, datos: ReporteLibroMayorItem[]): Promise<{
    totalRegistros: number;
    tiempoProcesamiento: number;
    fechaGeneracion: Date;
    version: string;
  }>;
}

