/**
 * Entidad para el Libro Mayor
 * Representa los datos del reporte de Libro Mayor basado en las tablas MAYOR y SALDO
 */
export interface LibroMayor {
  centro_costo: string;
  cuenta_contable: string;
  descripcion_cuenta: string;
  saldo_fisc_local: number;
  saldo_fisc_dolar: number;
  saldo_corp_local: number;
  saldo_corp_dolar: number;
  saldo_fisc_und: number;
  saldo_corp_und: number;
  debito_fisc_local: number;
  credito_fisc_local: number;
  debito_fisc_dolar: number;
  credito_fisc_dolar: number;
  debito_corp_local: number;
  credito_corp_local: number;
  debito_corp_dolar: number;
  credito_corp_dolar: number;
  debito_fisc_und: number;
  credito_fisc_und: number;
  debito_corp_und: number;
  credito_corp_und: number;
}

/**
 * Filtros para el reporte de Libro Mayor
 */
export interface LibroMayorFiltros {
  conjunto: string;
  cuentaContableDesde?: string;
  cuentaContableHasta?: string;
  fechaDesde: string;
  fechaHasta: string;
  centroCosto?: string;
  page?: number;
  limit?: number;
  offset?: number;
}

/**
 * Respuesta paginada del Libro Mayor
 */
export interface LibroMayorResponse {
  success: boolean;
  data: LibroMayor[];
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
export interface GenerarLibroMayorParams {
  conjunto: string;
  cuentaContableDesde?: string;
  cuentaContableHasta?: string;
  fechaDesde: string;
  fechaHasta: string;
  centroCosto?: string;
}

/**
 * Parámetros para exportar a Excel
 */
export interface ExportarLibroMayorExcelParams {
  conjunto: string;
  cuentaContableDesde?: string;
  cuentaContableHasta?: string;
  fechaDesde: string;
  fechaHasta: string;
  centroCosto?: string;
  limit?: number;
}

/**
 * Parámetros para exportar a PDF
 */
export interface ExportarLibroMayorPDFParams {
  conjunto: string;
  cuentaContableDesde?: string;
  cuentaContableHasta?: string;
  fechaDesde: string;
  fechaHasta: string;
  centroCosto?: string;
  limit?: number;
}

/**
 * Información de cuenta contable
 */
export interface CuentaContableInfo {
  cuenta_contable: string;
  descripcion: string;
  descripcion_ifrs: string;
  tipo: string;
  tipo_detallado: string;
  conversion: string;
  saldo_normal: string;
  tipo_cambio: string;
  acepta_datos: string;
  tipo_oaf: string;
  consolida: string;
  usa_centro_costo: string;
  usuario: string;
  fecha_hora: Date;
  usuario_ult_mod: string;
  fch_hora_ult_mod: Date;
  notas: string;
  acepta_unidades: string;
  unidad: string;
  uso_restringido: string;
  seccion_cuenta: string;
  origen_conversion: string;
  valida_presup_cr: string;
  cuenta_ifrs: string;
  usa_conta_electro: string;
  version: string;
  fecha_ini_ce: Date;
  fecha_fin_ce: Date;
  cod_agrupador: string;
  desc_cod_agrup: string;
  sub_cta_de: string;
  desc_sub_cta: string;
  nivel: number;
  maneja_tercero: string;
  RowPointer: string;
}

/**
 * Información de período contable
 */
export interface PeriodoContableInfo {
  fecha_final: Date;
  descripcion: string;
}

/**
 * Respuesta para cuentas contables
 */
export interface CuentasContablesResponse {
  success: boolean;
  data: CuentaContableInfo[];
  message: string;
}

/**
 * Respuesta para períodos contables
 */
export interface PeriodosContablesResponse {
  success: boolean;
  data: PeriodoContableInfo[];
  message: string;
}
