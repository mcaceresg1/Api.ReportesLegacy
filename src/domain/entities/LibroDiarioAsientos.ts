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
  diferencia_local: number; // total_debito_loc - total_credito_loc
  total_debito_dol: number;
  total_credito_dol: number;
  total_control_dol: number;
  diferencia_dolar: number; // total_debito_dol - total_credito_dol
}

/**
 * Filtros para el reporte de Libro Diario Asientos
 */
export interface LibroDiarioAsientosFiltros {
  conjunto: string;
  asiento?: string;
  tipoAsiento?: string;
  paquete?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  page?: number;
  limit?: number;
}

/**
 * Respuesta paginada para Libro Diario Asientos
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
 * Parámetros para generar el reporte de Libro Diario Asientos
 */
export interface GenerarLibroDiarioAsientosParams {
  asiento?: string;
  tipoAsiento?: string;
  paquete?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

/**
 * Parámetros para exportar a Excel
 */
export interface ExportarLibroDiarioAsientosExcelParams {
  asiento?: string;
  tipoAsiento?: string;
  paquete?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}
