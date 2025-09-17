/**
 * Entidad para el Diario de Contabilidad
 * Representa los datos del reporte de Diario de Contabilidad que combina información
 * de las tablas MAYOR y DIARIO con sus respectivas relaciones
 */
export interface DiarioContabilidad {
  CUENTA_CONTABLE_DESC: string;
  CORRELATIVO_ASIENTO: string;
  SDESC_TIPO_ASIENTO: string;
  CUENTA_CONTABLE: string;
  CREDITO_LOCAL: number;
  CREDITO_DOLAR: number;
  CENTRO_COSTO: string;
  DEBITO_LOCAL: number;
  DEBITO_DOLAR: number;
  TIPO_ASIENTO: string;
  TIPO_REPORTE: string;
  CONSECUTIVO: string;
  REFERENCIA: string;
  TIPO_CAMBIO: number;
  NOM_USUARIO: string;
  NIT_NOMBRE: string;
  DOCUMENTO: string;
  ASIENTO: string;
  TIPO_DOC: string;
  FINICIO: Date;
  MODULO: string;
  FFINAL: Date;
  FUENTE: string;
  FECHA: Date;
  NOTAS: string;
  NIT: string;
  ROW_ORDER_BY?: number;
}

/**
 * Filtros para el reporte de Diario de Contabilidad
 */
export interface DiarioContabilidadFiltros {
  conjunto: string;
  usuario: string;
  fechaInicio: Date;
  fechaFin: Date;
  contabilidad?: string | undefined; // 'F' (Fiscal) o 'A' (Ambas) - por defecto 'F,A'
  tipoReporte?: string | undefined; // 'Preliminar' u 'Oficial' - por defecto 'Preliminar'
  cuentaContable?: string | undefined;
  centroCosto?: string | undefined;
  nit?: string | undefined;
  tipoAsiento?: string | undefined;
  asiento?: string | undefined;
  origen?: string | undefined; // 'CP', 'CB', 'CC', 'FEE', 'IC', 'CJ'
  limit?: number;
  offset?: number;
  page?: number;
}

/**
 * Respuesta paginada del Diario de Contabilidad
 */
export interface DiarioContabilidadResponse {
  success: boolean;
  data: DiarioContabilidad[];
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
export interface GenerarDiarioContabilidadParams {
  conjunto: string;
  usuario: string;
  fechaInicio: Date;
  fechaFin: Date;
  contabilidad?: string;
  tipoReporte?: string;
}

/**
 * Parámetros para exportar a Excel
 */
export interface ExportarDiarioContabilidadExcelParams {
  conjunto: string;
  usuario: string;
  fechaInicio: Date;
  fechaFin: Date;
  contabilidad?: string;
  tipoReporte?: string;
  limit?: number;
}
