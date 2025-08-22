export interface MovimientoContableAgrupadoItem {
  sNombreMonLocal: string;
  sNombreMonDolar: string;
  sTituloCuenta: string;
  sCuentaContableDesc: string;
  sTituloNit: string;
  sNitNombre: string;
  sReferencia: string;
  nMontoLocal: number;
  nMontoDolar: number;
  sAsiento: string;
  sCuentaContable: string;
  sNit: string;
  dtFecha: Date;
  sFuente: string;
  sNotas: string;
  sDimension: string;
  sDimensionDesc: string;
  sQuiebre1: string;
  sQuiebre2: string;
  sQuiebre3: string;
  sQuiebreDesc1: string;
  sQuiebreDesc2: string;
  sQuiebreDesc3: string;
  ORDEN: number;
}

export interface FiltroMovimientoContableAgrupado {
  conjunto: string;
  fechaDesde: string;
  fechaHasta: string;
  contabilidad?: string[];
  cuentaContable?: string;
  nit?: string;
  dimension?: string;
  asiento?: string;
  fuente?: string;
}

export interface MovimientoContableAgrupadoResponse {
  success: boolean;
  message: string;
  data: MovimientoContableAgrupadoItem[];
  total: number;
}

export interface MovimientoContableAgrupadoCreate {
  conjunto: string;
  usuario: string;
  filtros: FiltroMovimientoContableAgrupado;
}

// Interfaces auxiliares para las consultas
export interface MovimientoContableDiario {
  cuenta_contable: string;
  descripcion: string;
  nit: string;
  razon_social: string;
  dimension: string | null;
  dimension_desc: string | null;
  fecha: Date;
  asiento: string;
  fuente: string;
  referencia: string;
  monto_local: number;
  monto_dolar: number;
  notas: string;
  orden: number;
}

export interface MovimientoContableMayor {
  cuenta_contable: string;
  descripcion: string;
  nit: string;
  razon_social: string;
  dimension: string | null;
  dimension_desc: string | null;
  fecha: Date;
  asiento: string;
  fuente: string;
  referencia: string;
  monto_local: number;
  monto_dolar: number;
  notas: string;
  orden: number;
}
