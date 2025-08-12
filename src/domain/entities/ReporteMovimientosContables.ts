export interface ReporteMovimientoContableItem {
  centroCosto: string;
  referencia: string;
  documento: string;
  asiento: number;
  razonSocial: string;
  fecha: string; // ISO date
  tipo: string;
  nit: string;
  creditoDolar: number;
  creditoLocal: number;
  debitoDolar: number;
  debitoLocal: number;
  cuentaContable: string;
  descripcionCuentaContable: string;
  descripcionCentroCosto: string;
  usuario: string;
}

export interface FiltrosReporteMovimientosContables {
  usuario: string;
  fechaInicio: Date;
  fechaFin: Date;
  contabilidad: 'F' | 'A' | 'T';
}
