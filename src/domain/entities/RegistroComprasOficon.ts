export interface RegistroComprasOficonRequest {
  ISCO_EMPR: string; // Código de empresa (filtro)
  INNU_ANNO: number; // Año (filtro)
  INNU_MESE_INIC: number; // Mes inicial (filtro)
  INNU_MESE_FINA: number; // Mes final (filtro)
  ISTI_REPO: string; // Tipo de impresión: ANA (analítico) o RES (resumen)
  ISTI_ORDE_REPO: string; // Ordenado por: VOU (voucher) o FEC (fecha)
  ISTI_INFO: string; // Tipo reporte: ORI (origen/contable) o OFI (oficial)
}

// Campos para reporte analítico (ISTI_REPO = 'ANA')
export interface RegistroComprasOficonAnalitico {
  ISCO_EMPR: string;
  FE_DOCU: string;
  TI_DOCU_SUNA: string;
  TI_DOCU_CNTB: string;
  NO_DOCU: string;
  NU_DOCU: string;
  CO_UNID_CNTB: string;
  CO_OPRC: string;
  NU_ASTO: string;
  CO_PROV: string;
  NO_CORT_PROV: string;
  NU_RUCS_PROV: string;
  CO_MONE: string;
  IM_INAF_ORIG: number;
  IM_AFEC_ORIG: number;
  IM_IIGV_ORIG: number;
  IM_TOTA_ORIG: number;
  IM_INAF_CNTB: number;
  IM_AFEC_CNTB: number;
  IM_IIGV_CNTB: number;
  IM_TOTA_CNTB: number;
  FA_CAMB: number;
  ST_RETE_AUXI: string;
  ST_RETE_DOCU: string;
  VNIM_MAXI_NRET: number;
  ST_RETE_BCON: string;
  ST_STAT: string;
  ST_NDEB: string;
  PO_IMPT: number;
}

// Campos para reporte resumen (ISTI_REPO = 'RES')
export interface RegistroComprasOficonResumen {
  TI_DOCU_SUNA: string;
  TI_DOCU_CNTB: string;
  NO_DOCU: string;
  IM_INAF_ORIG: number;
  IM_AFEC_ORIG: number;
  IM_IIGV_ORIG: number;
  IM_TOTA_ORIG: number;
  IM_INAF_CNTB: number;
  IM_AFEC_CNTB: number;
  IM_IIGV_CNTB: number;
  IM_TOTA_CNTB: number;
}

// Campos para reporte oficial (ISTI_INFO = 'OFI')
export interface RegistroComprasOficonOficial {
  ISCO_EMPR: string;
  FE_DOCU: string;
  TI_DOCU_SUNA: string;
  TI_DOCU_CNTB: string;
  NO_DOCU: string;
  NU_DOCU: string;
  CO_UNID_CNTB: string;
  CO_OPRC: string;
  NU_ASTO: string;
  CO_PROV: string;
  NO_CORT_PROV: string;
  NU_RUCS_PROV: string;
  CO_MONE: string;
  IM_AFEC_CNTB: number;
  IM_BASE_NGRA: number;
  IM_BASE_SDCF: number;
  IM_INAF_CNTB: number;
  IM_BASE_RXHH: number;
  IM_IIGV_CNTB: number;
  IM_IIGV_NGRA: number;
  IM_IIGV_SDCF: number;
  IM_RENT_CNTB: number;
  IM_IESS_CNTB: number;
  IM_TOTA_CNTB: number;
  FA_CAMB: number;
  ST_RETE_AUXI: string;
  ST_RETE_DOCU: string;
  VNIM_MAXI_NRET: number;
  ST_RETE_BCON: string;
  ST_STAT: string;
  ST_NDEB: string;
  NU_DOCU_REFE: string;
  FE_DOCU_REFE: string;
  PO_IMPT: number;
}

// Union type para todos los tipos de registro
export type RegistroComprasOficon =
  | RegistroComprasOficonAnalitico
  | RegistroComprasOficonResumen
  | RegistroComprasOficonOficial;

export interface RegistroComprasOficonResponse {
  success: boolean;
  data: RegistroComprasOficon[];
  totalRecords: number;
  tipoReporte: "ANALITICO" | "RESUMEN" | "OFICIAL";
  tipoOrden: "VOUCHER" | "FECHA";
  tipoInfo: "ORIGEN" | "OFICIAL";
  message: string;
}
