// Entidades para Libro Mayor Oficion

// Información Analítica
export interface LibroMayorOficonAnalitico {
  NU_MESE_QUIE: number;
  CO_CNTA_EMPR: string;
  DE_CNTA_EMPR: string;
  TO_CARG: number;
  TO_ABON: number;
  NU_MESE: number;
  FE_ASTO_CNTB: string;
  NU_SECU: number;
  CN_CNTB_EMP1: string;
  TI_AUXI_EMPR: string;
  CO_AUXI_EMPR: string;
  CO_UNID_CNTB: string;
  CO_OPRC_CNTB: string;
  NU_ASTO: number;
  TI_DOCU: string;
  NU_DOCU: string;
  FE_DOCU: string;
  IM_MVTO_ORIG: number;
  DE_GLOS: string;
  IM_DEBE: number;
  IM_HABE: number;
  CO_TABL_ORIG: string;
  CO_CLAV_TAOR: string;
  CAMPO: string;
  CO_ORDE_SERV: string;
}

// Información Resumen
export interface LibroMayorOficonResumen {
  NU_MESE_QUIE: number;
  CO_CNTA_EMPR: string;
  DE_CNTA_EMPR: string;
  TO_CARG: number;
  TO_ABON: number;
  IM_DEBE: number;
  IM_HABE: number;
}

// Union type para ambos tipos de respuesta
export type LibroMayorOficon =
  | LibroMayorOficonAnalitico
  | LibroMayorOficonResumen;

// Request para el endpoint - Solo parámetros dinámicos
export interface LibroMayorOficonRequest {
  ISCO_EMPR: string; // PARAMETRO empresa
  INNU_ANNO: number; // PARAMETRO año
  INNU_MESE_INIC: number; // PARAMETRO mes inicial
  INNU_MESE_FINA: number; // PARAMETRO mes final
  ISCO_MONE: string; // PARAMETRO MONEDA (SOL o DOL)
  ISTI_REPO: string; // PARAMETRO tipo reporte:
  // INFORMACION ANALITICA: 'CUD','COD', 'CVD','CFD'
  // INFORMACION RESUMEN: 'CUR','COR', 'CVR','CFR'
}

// Response para el endpoint
export interface LibroMayorOficonResponse {
  success: boolean;
  data: LibroMayorOficon[];
  message?: string;
  totalRecords?: number;
  tipoReporte: "ANALITICO" | "RESUMEN";
}
