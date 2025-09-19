export interface LibroInventarioBalanceOficonRequest {
  ISCO_EMPR: string; // Código de empresa (REQUERIDO)
  INNU_ANNO: number; // Año (REQUERIDO)
  INNU_MESE: number; // Mes (REQUERIDO)
}

export interface LibroInventarioBalanceOficon {
  // Campos de respuesta del stored procedure
  NU_QUIE_0001: string; // Número quiebre 0001
  NU_QUIE_0002: string; // Número quiebre 0002
  DE_QUIE_0002: string; // Descripción quiebre 0002
  CO_CNTA_QUIE: string; // Código cuenta quiebre
  DE_CNTA_EMPR: string; // Descripción cuenta empresa
  CO_CNTA_EMPR: string; // Código cuenta empresa
  IM_MVTO_TOTA: number; // Importe movimiento total
  PAS_PATR: number; // Pasivo patrimonio
  ACTIVO: number; // Activo
  PASIVO: number; // Pasivo
  PATRIMONIO: number; // Patrimonio
}

export interface LibroInventarioBalanceOficonResponse {
  success: boolean;
  data: LibroInventarioBalanceOficon[];
  totalRecords: number;
  empresa: string;
  año: number;
  mes: number;
  message: string;
}
