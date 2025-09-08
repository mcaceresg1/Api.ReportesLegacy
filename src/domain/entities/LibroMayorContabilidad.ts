export interface LibroMayorContabilidad {
  saldo_acreedor_dolar: number;
  credito_dolar_mayor: number;
  correlativo_asiento: string;
  saldo_deudor_dolar: number;
  debito_dolar_mayor: number;
  cuenta_contable: string;
  saldo_acreedor: number;
  credito_dolar: number;
  credito_local: number;
  saldo_deudor: number;
  debito_dolar: number;
  debito_local: number;
  centro_costo: string;
  tipo_asiento: string;
  descripcion: string;
  consecutivo: number;
  referencia: string;
  nit_nombre: string;
  documento: string;
  credito: number;
  asiento: string;
  debito: number;
  fecha: Date;
  tipo: string;
  nit: string;
  fuente: string;
  periodo_contable?: Date;
  tipo_linea?: number;
}

export interface FiltrosLibroMayorContabilidad {
  conjunto: string;
  fechaDesde: string;
  fechaHasta: string;
  cuentaContableDesde?: string;
  cuentaContableHasta?: string;
  centroCosto?: string;
  tipoAsiento?: string;
  origen?: string;
  contabilidad?: string;
  claseAsiento?: string;
  limit?: number;
}

export interface LibroMayorContabilidadRequest {
  conjunto: string;
  fechaDesde: string;
  fechaHasta: string;
  cuentaContableDesde?: string;
  cuentaContableHasta?: string;
  centroCosto?: string;
  tipoAsiento?: string;
  origen?: string;
  contabilidad?: string;
  claseAsiento?: string;
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
  cuenta_contable: string;
  descripcion: string;
  saldo_normal: string;
  acepta_datos: string;
}

export interface PeriodoContableInfo {
  fecha_final: Date;
  descripcion: string;
  contabilidad: string;
  estado: string;
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
