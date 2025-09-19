export interface PatrimonioNetoOficonRequest {
  ISCO_EMPR: string; // Código de empresa (REQUERIDO)
  INNU_ANNO: number; // Año (REQUERIDO)
  INNU_MESE: number; // Mes (REQUERIDO)
}

export interface PatrimonioNetoOficon {
  // Campos de respuesta del stored procedure
  NU_ANNO: number; // Número año
  NO_TITU: string; // Nombre título
  IM_SALD_0001: number; // Importe saldo 0001
  IM_SALD_0002: number; // Importe saldo 0002
  IM_SALD_0003: number; // Importe saldo 0003
  IM_SALD_0004: number; // Importe saldo 0004
  IM_SALD_0005: number; // Importe saldo 0005
}

export interface PatrimonioNetoOficonResponse {
  success: boolean;
  data: PatrimonioNetoOficon[];
  totalRecords: number;
  empresa: string;
  año: number;
  mes: number;
  message: string;
}
