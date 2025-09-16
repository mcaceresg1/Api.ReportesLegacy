export interface LibroDiarioOficon {
  AÑO: number;
  MES: number;
  CODIGO_UNIDAD_CONTABLE: string;
  NOMBRE_UNIDAD_CONTABLE: string;
  CODIGO_OPERACION_CONTABLE: string;
  NUMERO_ASIENTO: number;
  NUMERO_SECUENCIAL: number;
  FECHA_ASIENTO_CONTABLE: string;
  CUENTA_EMPRESA: string;
  TIPO_AUXILIAR: string;
  CODIGO_AUXILIAR: string;
  TIPO_DOCUMENTO: string;
  NUMERO_DOCUMENTO: string;
  FECHA_DOCUMENTO: string;
  ORDEN_SERVICIO: string;
  GLOSA: string;
  IMPORTE_DEBE: number;
  IMPORTE_HABER: number;
  IMPORTE_MOVIMIENTO_ORIGINAL: number;
  DESC_OPERACION_CONTABLE: string;
}

export interface LibroDiarioOficonRequest {
  IDEMPRESA: number;
  FECHAINI: string;
  FECHAFINAL: string;
}

export interface LibroDiarioOficonResponse {
  success: boolean;
  data: LibroDiarioOficon[];
  message?: string;
  totalRecords?: number;
}
