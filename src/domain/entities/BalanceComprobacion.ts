/**
 * Entidad para el Balance de Comprobación
 * Representa los datos del reporte de Balance de Comprobación que combina información
 * de las tablas SALDO, MAYOR, DIARIO y CUENTA_CONTABLE con sus respectivas relaciones
 */
export interface BalanceComprobacion {
  CUENTA_CONTABLE: string;
  DESCRIPCION: string;
  CUENTA1: string;
  DESC1: string;
  CUENTA2: string;
  DESC2: string;
  CUENTA3: string;
  DESC3: string;
  CUENTA4: string;
  DESC4: string;
  CUENTA5: string;
  DESC5: string;
  SALDO_LOCAL: number;
  SALDO_DOLAR: number;
  DEBITO_LOCAL: number;
  DEBITO_DOLAR: number;
  CREDITO_LOCAL: number;
  CREDITO_DOLAR: number;
  MONEDA: number;
  NIVEL: number;
  TNIVEL1: number;
  TNIVEL2: number;
  TNIVEL3: number;
  TNIVEL4: number;
  TNIVEL5: number;
  TNIVEL6: number;
  TNIVEL7: number;
  TNIVEL8: number;
  TNIVEL9: number;
  TNIVEL10: number;
  TNIVEL11: number;
  TNIVEL12: number;
  NIVEL1: number;
  NIVEL2: number;
  NIVEL3: number;
  NIVEL4: number;
  NIVEL5: number;
  NIVEL6: number;
  NIVEL7: number;
  NIVEL8: number;
  NIVEL9: number;
  NIVEL10: number;
  NIVEL11: number;
  NIVEL12: number;
  sTIPO: string;
  sTIPO_DETALLADO: string;
  TIPO_REPORTE: string;
  CENTRO_COSTO?: string;
  CUENTA6?: string;
  CUENTA7?: string;
  CUENTA8?: string;
  CUENTA9?: string;
  CUENTA10?: string;
  CUENTA11?: string;
  DESC6?: string;
  DESC7?: string;
  DESC8?: string;
  DESC9?: string;
  DESC10?: string;
  DESC11?: string;
}

/**
 * Filtros para el reporte de Balance de Comprobación
 */
export interface BalanceComprobacionFiltros {
  conjunto: string;
  usuario: string;
  fechaInicio: Date;
  fechaFin: Date;
  contabilidad?: string; // 'F' (Fiscal) o 'A' (Ambas) - por defecto 'F,A'
  tipoReporte?: string; // 'Preliminar' u 'Oficial' - por defecto 'Preliminar'
  // Filtros generales
  moneda?: string;
  origen?: string;
  nivelAnalisis?: number;
  realizarAnalisisAsientos?: boolean;
  cuentaDesde?: string;
  cuentaHasta?: string;
  libroElectronico?: boolean;
  campoLibroElectronico?: string;
  versionLibroElectronico?: string;
  // Filtros de asientos
  excluirAsientoCierre?: boolean;
  soloMostrarNivelSeleccionado?: boolean;
  considerarAsientoApertura?: boolean;
  asientoDesde?: number;
  asientoHasta?: number;
  agrupacionDesde?: number;
  agrupacionHasta?: number;
  // Tipos de asiento
  tiposSeleccionados?: string[];
  desglosarPorTipoEnExcel?: boolean;
  // Cuenta contable
  formatoCuentaContable?: string;
  // Centro de costo
  formatoCentroCosto?: string;
  analisisCentroCosto?: string;
  ordenamientoCentroCosto?: string;
  // Dimensión
  dimensionAdicional?: string;
  // Títulos
  tituloPrincipal?: string;
  titulo2?: string;
  titulo3?: string;
  titulo4?: string;
  // Filtros adicionales
  tipo?: string;
  tipoDetallado?: string;
  // Paginación
  limit?: number;
  offset?: number;
  page?: number;
}

/**
 * Respuesta paginada del Balance de Comprobación
 */
export interface BalanceComprobacionResponse {
  data: BalanceComprobacion[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

/**
 * Parámetros para generar el reporte
 */
export interface GenerarBalanceComprobacionParams {
  conjunto: string;
  usuario: string;
  fechaInicio: Date;
  fechaFin: Date;
  contabilidad?: string;
  tipoReporte?: string;
  // Filtros generales
  moneda?: string;
  origen?: string;
  nivelAnalisis?: number;
  realizarAnalisisAsientos?: boolean;
  cuentaDesde?: string;
  cuentaHasta?: string;
  libroElectronico?: boolean;
  campoLibroElectronico?: string;
  versionLibroElectronico?: string;
  // Filtros de asientos
  excluirAsientoCierre?: boolean;
  soloMostrarNivelSeleccionado?: boolean;
  considerarAsientoApertura?: boolean;
  asientoDesde?: number;
  asientoHasta?: number;
  agrupacionDesde?: number;
  agrupacionHasta?: number;
  // Tipos de asiento
  tiposSeleccionados?: string[];
  desglosarPorTipoEnExcel?: boolean;
  // Cuenta contable
  formatoCuentaContable?: string;
  // Centro de costo
  formatoCentroCosto?: string;
  analisisCentroCosto?: string;
  ordenamientoCentroCosto?: string;
  // Dimensión
  dimensionAdicional?: string;
  // Títulos
  tituloPrincipal?: string;
  titulo2?: string;
  titulo3?: string;
  titulo4?: string;
}

/**
 * Parámetros para exportar a Excel
 */
export interface ExportarBalanceComprobacionExcelParams {
  conjunto: string;
  usuario: string;
  fechaInicio: Date;
  fechaFin: Date;
  contabilidad?: string;
  tipoReporte?: string;
  limit?: number;
  // Filtros generales
  moneda?: string;
  origen?: string;
  nivelAnalisis?: number;
  realizarAnalisisAsientos?: boolean;
  cuentaDesde?: string;
  cuentaHasta?: string;
  libroElectronico?: boolean;
  campoLibroElectronico?: string;
  versionLibroElectronico?: string;
  // Filtros de asientos
  excluirAsientoCierre?: boolean;
  soloMostrarNivelSeleccionado?: boolean;
  considerarAsientoApertura?: boolean;
  asientoDesde?: number;
  asientoHasta?: number;
  agrupacionDesde?: number;
  agrupacionHasta?: number;
  // Tipos de asiento
  tiposSeleccionados?: string[];
  desglosarPorTipoEnExcel?: boolean;
  // Cuenta contable
  formatoCuentaContable?: string;
  // Centro de costo
  formatoCentroCosto?: string;
  analisisCentroCosto?: string;
  ordenamientoCentroCosto?: string;
  // Dimensión
  dimensionAdicional?: string;
  // Títulos
  tituloPrincipal?: string;
  titulo2?: string;
  titulo3?: string;
  titulo4?: string;
}
