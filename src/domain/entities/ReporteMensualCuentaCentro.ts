export interface ReporteMensualCuentaCentroItem {
  cuentaContable: string;
  descCuentaContable: string;
  centroCosto: string;
  descCentroCosto: string;
  enero: number;
  febrero: number;
  marzo: number;
  abril: number;
  mayo: number;
  junio: number;
  julio: number;
  agosto: number;
  setiembre: number;
  octubre: number;
  noviembre: number;
  diciembre: number;
  mes1: string;  // yyyy-MM-dd
  mes2: string;
  mes3: string;
  mes4: string;
  mes5: string;
  mes6: string;
  mes7: string;
  mes8: string;
  mes9: string;
  mes10: string;
  mes11: string;
  mes12: string;
}

export interface ReporteMensualCuentaCentroResponse {
  success: boolean;
  message?: string;
  data: ReporteMensualCuentaCentroItem[];
  totalRegistros: number;
}
