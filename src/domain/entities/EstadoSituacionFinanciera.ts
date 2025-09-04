export interface EstadoSituacionFinanciera {
  // Campos principales del reporte
  activo: string;
  activo_saldo_ant: number;
  activo_saldo: number;
  pasivo_patrimonio: string;
  pasivo_saldo_ant: number;
  pasivo_saldo: number;
  
  // Campos adicionales para compatibilidad
  cuenta_contable?: string;
  tipo_reporte?: string;
  naturaleza?: string;
  fecha_comp?: Date;
  nUtilidad?: number;
  saldo_ant?: number;
  posicion?: string;
  familia?: string;
  moneda?: string;
  nombre?: string;
  agrupa?: string;
  padre?: string;
  saldo?: number;
  fecha?: Date;
  total?: number;
}

export interface FiltrosEstadoSituacionFinanciera {
  // Pestaña General
  tipoBalance?: string;
  moneda?: 'AMBAS' | 'NUEVO_SOL' | 'DOLAR';
  comparacion?: 'ANUAL' | 'MENSUAL' | 'FECHA';
  origen?: 'DIARIO' | 'MAYOR' | 'AMBOS';
  fecha?: Date;
  contabilidad?: 'FISCAL' | 'CORPORATIVA';
  excluirAsientoCierre?: boolean;
  libroElectronico?: boolean;
  versionLibroElectronico?: string;
  
  // Pestaña Centros de Costo
  centroCostoTipo?: 'RANGO' | 'AGRUPACION';
  centroCostoDesde?: string;
  centroCostoHasta?: string;
  centroCostoAgrupacion?: string;
  
  // Pestaña Criterio
  criterio?: string;
  
  // Pestaña Dimensión
  dimensionAdicional?: string;
  dimensionTexto?: string;
  
  // Pestaña Títulos
  tituloPrincipal?: string;
  titulo2?: string;
  titulo3?: string;
  titulo4?: string;
}

export interface EstadoSituacionFinancieraRequest {
  conjunto: string;
  tipoBalance?: string;
  moneda?: string;
  comparacion?: string;
  origen?: string;
  fecha: string;
  contabilidad?: string;
  excluirAsientoCierre?: boolean;
  libroElectronico?: boolean;
  versionLibroElectronico?: string;
  centroCostoTipo?: string;
  centroCostoDesde?: string;
  centroCostoHasta?: string;
  centroCostoAgrupacion?: string;
  criterio?: string;
  dimensionAdicional?: string;
  dimensionTexto?: string;
  tituloPrincipal?: string;
  titulo2?: string;
  titulo3?: string;
  titulo4?: string;
  page?: number;
  limit?: number;
}

export interface EstadoSituacionFinancieraResponse {
  success: boolean;
  data: EstadoSituacionFinanciera[];
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

export interface TipoBalanceInfo {
  tipo: string;
  descripcion: string;
  qrp: string;
  displayText: string;
}

export interface PeriodoContableInfo {
  descripcion: string;
  contabilidad: string;
  estado: string;
  fecha_final: Date;
}

export interface TiposBalanceResponse {
  success: boolean;
  data: TipoBalanceInfo[];
  message: string;
}

export interface PeriodosContablesResponse {
  success: boolean;
  data: PeriodoContableInfo[];
  message: string;
}

export interface GenerarEstadoSituacionFinancieraParams {
  conjunto: string;
  tipoBalance?: string;
  moneda?: string;
  comparacion?: string;
  origen?: string;
  fecha: string;
  contabilidad?: string;
  excluirAsientoCierre?: boolean;
  libroElectronico?: boolean;
  versionLibroElectronico?: string;
  centroCostoTipo?: string;
  centroCostoDesde?: string;
  centroCostoHasta?: string;
  centroCostoAgrupacion?: string;
  criterio?: string;
  dimensionAdicional?: string;
  dimensionTexto?: string;
  tituloPrincipal?: string;
  titulo2?: string;
  titulo3?: string;
  titulo4?: string;
}

export interface ExportarEstadoSituacionFinancieraExcelParams {
  conjunto: string;
  tipoBalance?: string;
  moneda?: string;
  comparacion?: string;
  origen?: string;
  fecha: string;
  contabilidad?: string;
  excluirAsientoCierre?: boolean;
  libroElectronico?: boolean;
  versionLibroElectronico?: string;
  centroCostoTipo?: string;
  centroCostoDesde?: string;
  centroCostoHasta?: string;
  centroCostoAgrupacion?: string;
  criterio?: string;
  dimensionAdicional?: string;
  dimensionTexto?: string;
  tituloPrincipal?: string;
  titulo2?: string;
  titulo3?: string;
  titulo4?: string;
}

export interface ExportarEstadoSituacionFinancieraPDFParams {
  conjunto: string;
  tipoBalance?: string;
  moneda?: string;
  comparacion?: string;
  origen?: string;
  fecha: string;
  contabilidad?: string;
  excluirAsientoCierre?: boolean;
  libroElectronico?: boolean;
  versionLibroElectronico?: string;
  centroCostoTipo?: string;
  centroCostoDesde?: string;
  centroCostoHasta?: string;
  centroCostoAgrupacion?: string;
  criterio?: string;
  dimensionAdicional?: string;
  dimensionTexto?: string;
  tituloPrincipal?: string;
  titulo2?: string;
  titulo3?: string;
  titulo4?: string;
}
