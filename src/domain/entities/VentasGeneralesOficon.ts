export interface VentasGeneralesOficonRequest {
  ISCO_EMPR: string; // Código de empresa (REQUERIDO)
  INNU_ANNO: number; // Año (REQUERIDO)
  INNU_MESE_INIC: number; // Mes inicial (REQUERIDO)
  INNU_MESE_FINA: number; // Mes final (REQUERIDO)
  ISTI_REPO?: string; // Tipo impresión: ANA (analítico), RES (resumen) - OPCIONAL
  ISTI_ORDE_REPO?: string; // Ordenado por: VOU (voucher), FEC (fecha) - OPCIONAL
  ISTI_INFO?: string; // Tipo reporte: ORI (origen/contable), OFI (oficial) - OPCIONAL
}

// Estructura para reporte analítico (ISTI_REPO = 'ANA')
export interface VentasGeneralesOficonAnalitico {
  FE_DOCU: string; // Fecha documento
  TI_DOCU_SUNA: string; // Tipo documento SUNAT
  TI_DOCU: string; // Tipo documento
  NO_DOCU: string; // Nombre documento
  NU_DOCU: string; // Número documento
  CO_UNID_CNTB: string; // Código unidad contable
  CO_OPRC: string; // Código operación
  NU_ASTO: string; // Número asiento
  CO_CLIE: string; // Código cliente
  NO_CORT_CLIE: string; // Nombre corto cliente
  NU_RUCS_CLIE: string; // Número RUC cliente
  CO_MONE: string; // Código moneda
  IM_INAF_ORIG: number; // Importe inafecto origen
  IM_AFEC_ORIG: number; // Importe afecto origen
  IM_IIGV_ORIG: number; // Importe IGV origen
  IM_TOTA_ORIG: number; // Importe total origen
  IM_INAF_CNTB: number; // Importe inafecto contable
  IM_AFEC_CNTB: number; // Importe afecto contable
  IM_IIGV_CNTB: number; // Importe IGV contable
  IM_TOTA_CNTB: number; // Importe total contable
  FA_CAMB: number; // Factor cambio
  IM_EXPO_ORIG?: number; // Importe exportación origen (solo cuando ISTI_INFO = 'OFI')
  IM_EXPO_CNTB?: number; // Importe exportación contable (solo cuando ISTI_INFO = 'OFI')
  IM_IIGV_IISC?: number; // Importe IGV IISC (solo cuando ISTI_INFO = 'OFI')
}

// Estructura para reporte resumen (ISTI_REPO = 'RES')
export interface VentasGeneralesOficonResumen {
  TI_DOCU_SUNA: string; // Tipo documento SUNAT
  TI_DOCU: string; // Tipo documento
  NO_DOCU: string; // Nombre documento
  IM_INAF_ORIG: number; // Importe inafecto origen
  IM_AFEC_ORIG: number; // Importe afecto origen
  IM_IIGV_ORIG: number; // Importe IGV origen
  IM_TOTA_ORIG: number; // Importe total origen
  IM_INAF_CNTB: number; // Importe inafecto contable
  IM_AFEC_CNTB: number; // Importe afecto contable
  IM_IIGV_CNTB: number; // Importe IGV contable
  IM_TOTA_CNTB: number; // Importe total contable
}

// Unión de tipos para la respuesta
export type VentasGeneralesOficon =
  | VentasGeneralesOficonAnalitico
  | VentasGeneralesOficonResumen;

export interface VentasGeneralesOficonResponse {
  success: boolean;
  data: VentasGeneralesOficon[];
  totalRecords: number;
  empresa: string;
  año: number;
  mesInicial: number;
  mesFinal: number;
  tipoReporte: string;
  tipoOrden: string;
  tipoInfo: string;
  message: string;
}
