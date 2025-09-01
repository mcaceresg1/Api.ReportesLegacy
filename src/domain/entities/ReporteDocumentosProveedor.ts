export interface ProveedorFiltro {
    proveedor: string;
    nombre: string;
    alias: string;
    activo: string;
    moneda: string;
    saldo: number;
  }

  export interface ReporteProveedor {
    proveedor: string;
    nombre: string;
    fecha_documento: string; // ISO date (ej. "2025-06-25T00:00:00Z")
    fecha: string;
    fecha_vence: string;
    tipo: string;
    documento: string;
    aplicacion: string;
    moneda: string;
    monto: number;
    saldo: number;
    condicion_pago: string;
    cheque_cuenta: string;
    asiento: string;
    contrarecibo: string;
    aprobado: string;
    descripcion: string;
    documento_embarque: string;
    liquidac_compra: string;
    monto_retencion: number;
    saldo_retencion: number;
    usuario_ult_mod: string;
    fecha_ult_mod: string;
    clase_documento: string;
    dependiente: string;
    cheque_impreso: string;
    asiento_pendiente: string;
    congelado: string;
    tipo_embarque: string;
    embarque_aprobado: string;
    usuario_aprobacion: string;
    fecha_aprobacion: string;
    saldo_local: number;
    saldo_dolar: number;
    estado_envio: string;
    documento_fiscal: string;
  }
  
  export interface DocumentosPorPagar {
    contribuyente: string;
    nombre: string;
    fechaDocumento: string;  // o Date si lo quieres tipar así
    documento: string;
    tipo: string;
    aplicacion: string;
    fecha: string;           // o Date
    asiento: string;
    debeLoc: number;
    haberLoc: number;
    debeDol: number;
    haberDol: number;
    moneda: string;
  }
  