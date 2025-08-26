export interface LibroMayor {
  // Campos principales del libro mayor
  CUENTA_CONTABLE: string;
  DESCRIPCION: string;
  ASIENTO: string;
  TIPO: string;
  DOCUMENTO: string;
  REFERENCIA: string;
  
  // Saldos y movimientos en moneda local
  SALDO_DEUDOR: number;
  SALDO_ACREEDOR: number;
  DEBITO_LOCAL: number;
  CREDITO_LOCAL: number;
  
  // Saldos y movimientos en dólares
  SALDO_DEUDOR_DOLAR: number;
  SALDO_ACREEDOR_DOLAR: number;
  DEBITO_DOLAR: number;
  CREDITO_DOLAR: number;
  DEBITO_DOLAR_MAYOR: number;
  CREDITO_DOLAR_MAYOR: number;
  
  // Información del centro de costo
  CENTRO_COSTO: string;
  
  // Información del asiento
  TIPO_ASIENTO: string;
  FECHA: Date;
  CONSECUTIVO: number;
  CORRELATIVO_ASIENTO: string;
  TIPO_LINEA: number;
  
  // Información del NIT
  NIT: string;
  NIT_NOMBRE: string;
  
  // Información adicional
  FUENTE: string;
  PERIODO_CONTABLE?: Date;
  USUARIO?: string;
  
  // Campo de ordenamiento
  ROW_ORDER_BY?: number;
}

export interface LibroMayorFiltros {
  conjunto: string;
  usuario: string;
  fechaInicio: Date;
  fechaFin: Date;
  cuentaContable?: string;
  centroCosto?: string;
  nit?: string;
  tipoAsiento?: string;
  limit?: number;
  offset?: number;
}

export interface LibroMayorResponse {
  data: LibroMayor[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}
