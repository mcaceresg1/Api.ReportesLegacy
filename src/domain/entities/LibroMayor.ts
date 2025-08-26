export interface LibroMayor {
  cuentaContable: string;
  centroCosto: string;
  descripcion: string;
  saldoNormal: string;
  fecha: string;
  fechaCreacion: string;
  tipo: string;
  debitoLocal: number;
  creditoLocal: number;
  saldoInicialLocal: number;
  saldoFinalLocal: number;
}

export interface LibroMayorFiltros {
  conjunto: string;
  usuario: string;
  fechaDesde: string;
  fechaHasta: string;
  cuentaContableDesde?: string;
  cuentaContableHasta?: string;
  saldoAntesCierre?: boolean;
  page?: number;
  limit?: number;
}

export interface LibroMayorResponse {
  success: boolean;
  message: string;
  data: LibroMayor[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
