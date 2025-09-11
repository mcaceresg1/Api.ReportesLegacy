export interface ComprobanteResumen {
  comprobante: string;
  clase: string;
}

export interface ComprobanteResumenResponse {
  success: boolean;
  message: string;
  data: ComprobanteResumen[];
}
