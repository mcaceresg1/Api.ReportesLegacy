export interface ProveedorFiltro {
  proveedor: string | null;
  nombre: string | null;
  alias: string | null;
  activo: string | null;
  moneda: string | null;
  saldo: number | null;
}

export interface ReporteProveedor {
  proveedor: string | null;
  nombre: string | null;
  fecha_documento: string | null; // ISO date (ej. "2025-06-25T00:00:00Z")
  fecha: string | null;
  fecha_vence: string | null;
  tipo: string | null;
  documento: string | null;
  aplicacion: string | null;
  moneda: string | null;
  monto: number | null;
  saldo: number | null;
  condicion_pago: string | null;
  cheque_cuenta: string | null;
  asiento: string | null;
  contrarecibo: string | null;
  aprobado: string | null;
  descripcion: string | null;
  documento_embarque: string | null;
  liquidac_compra: string | null;
  monto_retencion: number | null;
  saldo_retencion: number | null;
  usuario_ult_mod: string | null;
  fecha_ult_mod: string | null;
  clase_documento: string | null;
  dependiente: string | null;
  cheque_impreso: string | null;
  asiento_pendiente: string | null;
  congelado: string | null;
  tipo_embarque: string | null;
  embarque_aprobado: string | null;
  usuario_aprobacion: string | null;
  fecha_aprobacion: string | null;
  saldo_local: number | null;
  saldo_dolar: number | null;
  estado_envio: string | null;
  documento_fiscal: string | null;
}

export interface DocumentosPorPagar {
  contribuyente: string | null;//nit
  nombre: string | null; //nombre
  fechaDocumento: string | null; //fecha
  documento: string | null; //numero
  tipo: string | null; //tipo
  aplicacion: string | null; //glosa
  fecha: string | null;           // fecha contable
  asiento: string | null;   //asiento
  debeLoc: number | null;  //debe sol
  haberLoc: number | null; //haber sol
  debeDol: number | null; //debe dol
  haberDol: number | null; // haber dol
  moneda: string | null; // moneda
}
