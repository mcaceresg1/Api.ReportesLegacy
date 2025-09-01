/**
 * Entidad para el Libro Mayor Asientos
 * Representa los datos del reporte de Libro Mayor Asientos basado en la tabla asiento_mayorizado
 */
export interface LibroMayorAsientos {
  asiento: string;
  contabilidad: string;
  tipo_asiento: string;
  fecha: Date;
  origen: string;
  documento_global: string;
  monto_total_local: number;
  monto_total_dolar: number;
  mayor_auditoria: string;
  exportado: string;
  tipo_ingreso_mayor: string;
}

/**
 * Filtros para el reporte de Libro Mayor Asientos
 */
export interface LibroMayorAsientosFiltros {
  conjunto: string;
  asiento?: string;
  referencia?: string;
  fechaInicio?: Date;
  fechaFin?: Date;
  contabilidad?: string;
  tipoAsiento?: string;
  origen?: string;
  exportado?: string;
  mayorizacion?: string;
  documentoGlobal?: string;
  page?: number;
  limit?: number;
  offset?: number;
}

/**
 * Respuesta paginada del Libro Mayor Asientos
 */
export interface LibroMayorAsientosResponse {
  success: boolean;
  data: LibroMayorAsientos[];
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
export interface GenerarLibroMayorAsientosParams {
  conjunto: string;
  asiento?: string;
  referencia?: string;
  fechaInicio?: Date;
  fechaFin?: Date;
  contabilidad?: string;
  tipoAsiento?: string;
  origen?: string;
  exportado?: string;
  mayorizacion?: string;
  documentoGlobal?: string;
}

/**
 * Parámetros para exportar a Excel
 */
export interface ExportarLibroMayorAsientosExcelParams {
  conjunto: string;
  asiento?: string;
  referencia?: string;
  fechaInicio?: Date;
  fechaFin?: Date;
  contabilidad?: string;
  tipoAsiento?: string;
  origen?: string;
  exportado?: string;
  mayorizacion?: string;
  documentoGlobal?: string;
  limit?: number;
}
