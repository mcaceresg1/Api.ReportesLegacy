/**
 * Entidad para el Libro Diario Asientos
 * Representa los datos del reporte de Libro Diario Asientos basado en la tabla asiento_de_diario
 */
export interface LibroDiarioAsientos {
  asiento: string;
  paquete: string;
  descripcion: string;
  contabilidad: string;
  tipo_asiento: string;
  fecha: Date;
  origen: string;
  documento_global: string;
  total_debito_loc: number;
  total_credito_loc: number;
  total_control_loc: number;
  diferencia_local: number;
  total_debito_dol: number;
  total_credito_dol: number;
  total_control_dol: number;
  diferencia_dolar: number;
}

/**
 * Filtros para el reporte de Libro Diario Asientos
 */
export interface LibroDiarioAsientosFiltros {
  conjunto: string;
  asientoDesde?: string;
  asientoHasta?: string;
  tipoAsientoDesde?: string;
  tipoAsientoHasta?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  claseAsiento?: string[];
  origen?: string[];
  paqueteDesde?: string;
  paqueteHasta?: string;
  contabilidad?: string[];
  documentoGlobalDesde?: string;
  documentoGlobalHasta?: string;
  page?: number;
  limit?: number;
  offset?: number;
}

/**
 * Respuesta del reporte de Libro Diario Asientos
 */
export interface LibroDiarioAsientosResponse {
  success: boolean;
  data: LibroDiarioAsientos[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message: string;
}

/**
 * Parámetros para generar el reporte
 */
export interface GenerarLibroDiarioAsientosParams {
  asientoDesde?: string;
  asientoHasta?: string;
  tipoAsientoDesde?: string;
  tipoAsientoHasta?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  claseAsiento?: string[];
  origen?: string[];
  paqueteDesde?: string;
  paqueteHasta?: string;
  contabilidad?: string[];
  documentoGlobalDesde?: string;
  documentoGlobalHasta?: string;
}

/**
 * Parámetros para exportar a Excel
 */
export interface ExportarLibroDiarioAsientosExcelParams {
  asientoDesde?: string;
  asientoHasta?: string;
  tipoAsientoDesde?: string;
  tipoAsientoHasta?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  claseAsiento?: string[];
  origen?: string[];
  paqueteDesde?: string;
  paqueteHasta?: string;
  contabilidad?: string[];
  documentoGlobalDesde?: string;
  documentoGlobalHasta?: string;
  limit?: number;
}

/**
 * Filtros disponibles para el reporte
 */
export interface FiltrosDisponibles {
  asientos: { asiento: string }[];
  tiposAsiento: { tipoAsiento: string; descripcion: string }[];
  clasesAsiento: { clase: string; descripcion: string }[];
  origenes: { origen: string; descripcion: string }[];
  paquetes: { paquete: string; descripcion: string }[];
  contabilidades: { codigo: string; descripcion: string }[];
  documentosGlobales: { documento: string }[];
}
