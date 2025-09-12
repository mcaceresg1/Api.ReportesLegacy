/**
 * Entidad para el Análisis de Cuentas Clipper
 * Representa los datos del reporte de análisis de cuentas basado en la tabla PCGR
 */
export interface AnalisisCuentasClipper {
  cuenta: string;
  nombre: string;
  saldo_anterior: string;
  debe_mes: string;
  haber_mes: string;
  saldo_final: string;
}

/**
 * Filtros para el reporte de Análisis de Cuentas Clipper
 */
export interface AnalisisCuentasClipperFiltros {
  baseDatos: string;
  mes: number;
  nivel: number;
  cuenta?: string | undefined;
}

/**
 * Respuesta del reporte de Análisis de Cuentas Clipper
 */
export interface AnalisisCuentasClipperResponse {
  success: boolean;
  data: AnalisisCuentasClipper[];
  message: string;
}

/**
 * Parámetros para generar el reporte
 */
export interface GenerarAnalisisCuentasClipperParams {
  baseDatos: string;
  mes: number;
  nivel: number;
  cuenta?: string;
}

/**
 * Parámetros para exportar a Excel
 */
export interface ExportarAnalisisCuentasClipperExcelParams {
  baseDatos: string;
  mes: number;
  nivel: number;
  cuenta?: string;
}

/**
 * Filtros disponibles para el reporte
 */
export interface FiltrosDisponiblesAnalisisCuentas {
  cuentas: { cuenta: string; nombre: string }[];
  niveles: { nivel: number; descripcion: string }[];
  meses: { mes: number; nombre: string }[];
}

/**
 * Entidad para el análisis de cuentas por rango en Clipper
 */
export interface AnalisisCuentasRangoClipper {
  CUENTA: string;
  NOMBRE: string;
  DEBE: string;
  HABER: string;
}

/**
 * Filtros para el análisis de cuentas por rango
 */
export interface AnalisisCuentasRangoClipperFiltros {
  baseDatos: string;
  cuentaDesde: string;
  cuentaHasta: string;
}

/**
 * Respuesta del análisis de cuentas por rango
 */
export interface AnalisisCuentasRangoClipperResponse {
  success: boolean;
  data: AnalisisCuentasRangoClipper[];
  message: string;
}

/**
 * Entidad para el análisis de cuentas por fechas en Clipper
 */
export interface AnalisisCuentasFechasClipper {
  CUENTA: string;
  NOMBRE: string;
  DEBE: string;
  HABER: string;
}

/**
 * Filtros para el análisis de cuentas por fechas
 */
export interface AnalisisCuentasFechasClipperFiltros {
  baseDatos: string;
  fechaDesde: string;
  fechaHasta: string;
}

/**
 * Respuesta del análisis de cuentas por fechas
 */
export interface AnalisisCuentasFechasClipperResponse {
  success: boolean;
  data: AnalisisCuentasFechasClipper[];
  message: string;
}

/**
 * Entidad para el análisis de cuentas por fecha de vencimiento en Clipper
 */
export interface AnalisisCuentasVencimientoClipper {
  FECVEN: string;
  CUENTA: string;
  NOMBRE: string;
  DEBE: string;
}

/**
 * Filtros para el análisis de cuentas por fecha de vencimiento
 */
export interface AnalisisCuentasVencimientoClipperFiltros {
  baseDatos: string;
  cuentaDesde: string;
  cuentaHasta: string;
  fechaVencimientoDesde: string;
  fechaVencimientoHasta: string;
}

/**
 * Respuesta del análisis de cuentas por fecha de vencimiento
 */
export interface AnalisisCuentasVencimientoClipperResponse {
  success: boolean;
  data: AnalisisCuentasVencimientoClipper[];
  message: string;
}
