export interface LibroMayorContabilidad {
  // Campos principales del reporte
  'Fecha de la operación': Date;
  'Número correlativo del libro diario': number;
  'Descripción': string;
  'Saldos y mov. deudor': number;
  'Saldos y mov. acreedor': number;
  'Saldo inicial': number;
  'Movimientos': number;
  'Saldo de movimientos': number;
  'Total saldo inicial': number;
  'Total movimientos': number;
  'Total saldo final': number;

  // Campos adicionales de la tabla XML
  saldoAcreedorDolar?: number;
  creditoDolarMayor?: number;
  correlativoAsiento?: string;
  saldoDeudorDolar?: number;
  debitoDolarMayor?: number;
  cuentaContable?: string;
  saldoAcreedor?: number;
  creditoDolar?: number;
  creditoLocal?: number;
  saldoDeudor?: number;
  debitoDolar?: number;
  debitoLocal?: number;
  centroCosto?: string;
  tipoAsiento?: string;
  consecutivo?: number;
  referencia?: string;
  nitNombre?: string;
  documento?: string;
  credito?: number;
  asiento?: string;
  debito?: number;
  fecha?: Date;
  tipo?: string;
  nit?: string;
  fuente?: string;
  periodoContable?: Date;
  tipoLinea?: number;
}

export interface FiltrosLibroMayorContabilidad {
  conjunto: string;
  
  // Pestaña General
  moneda?: 'NUEVO_SOL' | 'DOLAR';
  clase?: 'PRELIMINAR' | 'OFICIAL';
  contabilidad?: {
    fiscal?: boolean;
    corporativa?: boolean;
  };
  fechaDesde: string;
  fechaHasta: string;
  tipoReporte?: 'DETALLADO' | 'RESUMIDO';
  claseReporte?: 'ESTANDAR' | 'ANALITICO';
  origen?: 'DIARIO' | 'MAYOR' | 'AMBOS';
  nivelAnalisis?: number;
  ordenadoPor?: 'FECHA' | 'ASIENTO' | 'TIPO_ASIENTO';
  cuentaContableDesde?: string;
  cuentaContableHasta?: string;
  libroElectronico?: boolean;

  // Pestaña Asientos
  opcionesAsientos?: {
    excluirAsientoCierreAnual?: boolean;
    considerarAsientoApertura?: boolean;
    detalleMovimientoEfectivo?: boolean;
    conexionDirectaBD?: boolean;
    noMostrarCuentasSinSaldo?: boolean;
    pleRespetarNIT?: boolean;
    incluirInfoAuditoria?: boolean;
  };
  centroCosto?: {
    tipo?: 'RANGO' | 'AGRUPACION';
    desde?: string;
    hasta?: string;
    agrupacion?: string;
  };

  // Pestaña Otros
  tiposAsiento?: string[];
  nitDesde?: string;
  nitHasta?: string;

  // Pestaña Paquetes
  usarFiltroPaquete?: boolean;
  paquetes?: string[];

  // Títulos
  tituloPrincipal?: string;
  titulo2?: string;
  titulo3?: string;
  titulo4?: string;

  // Pestaña Cuenta Contable
  nivelCuenta?: number;
  operadorCuenta?: string;
  valorCuenta?: string;
  conectorCuenta?: string;

  // Pestaña Dimensión
  dimensionAdicional?: string;

  // Paginación
  page?: number;
  pageSize?: number;
  limit?: number;
}

export interface LibroMayorContabilidadResponse {
  success: boolean;
  data: LibroMayorContabilidad[];
  message: string;
  total?: number;
  pagination?: {
    page: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
  };
}

export interface CuentaContableInfo {
  cuentaContable: string;
  descripcion: string;
  saldoNormal: string;
  aceptaDatos: string;
}

export interface PeriodoContableInfo {
  fechaFinal: Date;
  descripcion: string;
  contabilidad: string;
  estado: string;
}

export interface TipoAsientoInfo {
  codigo: string;
  descripcion: string;
}

export interface CentroCostoInfo {
  codigo: string;
  descripcion: string;
}

export interface PaqueteInfo {
  codigo: string;
  descripcion: string;
}

export interface CuentasContablesResponse {
  success: boolean;
  data: CuentaContableInfo[];
  message: string;
  total: number;
}

export interface PeriodosContablesResponse {
  success: boolean;
  data: PeriodoContableInfo[];
  message: string;
  total: number;
}

export interface TiposAsientoResponse {
  success: boolean;
  data: TipoAsientoInfo[];
  message: string;
  total: number;
}

export interface CentrosCostoResponse {
  success: boolean;
  data: CentroCostoInfo[];
  message: string;
  total: number;
}

export interface PaquetesResponse {
  success: boolean;
  data: PaqueteInfo[];
  message: string;
  total: number;
}
