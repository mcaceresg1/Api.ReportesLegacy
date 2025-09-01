export interface ReporteGenericoSaldos {
  sCuentaContable: string;
  sDescCuentaContable: string;
  sNit: string;
  sRazonSocial: string;
  sReferencia: string;
  sCodTipoDoc: string;
  sTipoDocSunat: string;
  sAsiento: string;
  nConsecutivo: number;
  dtFechaAsiento: Date;
  nSaldoLocal: number;
  nSaldoDolar: number;
}

export interface FiltrosReporteGenericoSaldos {
  conjunto: string;
  usuario: string;
  fechaInicio: Date;
  fechaFin: Date;
  contabilidad?: string;
  tipoAsiento?: string;
  claseAsiento?: string;
  cuentaContable?: string;
  nit?: string;
  razonSocial?: string;
  codTipoDoc?: string;
  tipoDocSunat?: string;
  asiento?: string;
  consecutivo?: number;
  saldoLocalMin?: number;
  saldoLocalMax?: number;
  saldoDolarMin?: number;
  saldoDolarMax?: number;
  page?: number;
  limit?: number;
}

export interface ReporteGenericoSaldosResponse {
  data: ReporteGenericoSaldos[];
  total: number;
  totalPaginas: number;
  paginaActual: number;
  limite: number;
  filtros: FiltrosReporteGenericoSaldos;
}

export interface EstadisticasReporteGenericoSaldos {
  totalRegistros: number;
  totalSaldoLocal: number;
  totalSaldoDolar: number;
  cuentasConSaldo: number;
  cuentasSinSaldo: number;
  nitsUnicos: number;
  tiposDocumento: { [key: string]: number };
  fechaGeneracion: Date;
}
