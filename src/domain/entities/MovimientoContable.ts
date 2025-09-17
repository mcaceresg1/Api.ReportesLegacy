export interface MovimientoContable {
  USUARIO: string;
  CUENTA_CONTABLE: string;
  DESCRIPCION_CUENTA_CONTABLE?: string;
  ASIENTO: string;
  TIPO?: string;
  DOCUMENTO?: string;
  REFERENCIA?: string;
  DEBITO_LOCAL?: number;
  DEBITO_DOLAR?: number;
  CREDITO_LOCAL?: number;
  CREDITO_DOLAR?: number;
  CENTRO_COSTO?: string;
  DESCRIPCION_CENTRO_COSTO?: string;
  TIPO_ASIENTO?: string;
  FECHA?: Date;
  ACEPTA_DATOS?: boolean;
  CONSECUTIVO?: number;
  NIT?: string;
  RAZON_SOCIAL?: string;
  FUENTE?: string;
  NOTAS?: string;
  U_FLUJO_EFECTIVO?: string;
  U_PATRIMONIO_NETO?: string;
  U_REP_REF?: string;
}

export interface MovimientoContableResponse {
  success: boolean;
  data: MovimientoContable[];
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

