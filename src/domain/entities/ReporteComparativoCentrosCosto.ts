export interface ReporteComparativoCentrosCosto {
  CentroCosto: string;
  Descripcion: string;
  AceptaDatos: boolean;
  Tipo: string;
}

export interface FiltrosComparativoCentrosCosto {
  conjunto: string;
  fechaDesde?: string;
  fechaHasta?: string;
  centroCosto?: string;
  cuentaContable?: string;
  nit?: string;
  dimension?: string;
  page?: number;
  limit?: number;
}
