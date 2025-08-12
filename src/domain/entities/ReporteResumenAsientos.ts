export interface ReporteResumenAsientos {
  cuentaContableDesc: string;
  sDescTipoAsiento: string;
  cuentaContable: string;
  sNombreQuiebre: string;
  creditoLocal: number;
  creditoDolar: number;
  centroCosto: string;
  debitoLocal: number;
  debitoDolar: number;
  tipoAsiento: string;
  tipoReporte: string;
  nomUsuario: string;
  finicio: Date;
  quiebre: string;
  ffinal: Date;
  rowOrderBy: number;
}

export interface FiltrosResumenAsientos {
  fechaInicio?: Date;
  fechaFin?: Date;
  tipoAsiento?: string;
  cuentaContable?: string;
  centroCosto?: string;
  usuario?: string;
  contabilidad?: 'F' | 'SF' | 'C' | 'SC' | 'T'; // F=Fiscal, SF=Sin Fiscal, C=Contable, SC=Sin Contable, T=Todos
  origen?: 'DIARIO' | 'MAYOR' | 'AMBOS';
  nitDesde?: string;
  nitHasta?: string;
  cuentaContableDesde?: string;
  cuentaContableHasta?: string;
  asientoDesde?: string;
  asientoHasta?: string;
  tiposAsientoSeleccionados?: string[];
}

// Tipo para crear filtros sin propiedades undefined
export type FiltrosResumenAsientosInput = {
  [K in keyof FiltrosResumenAsientos]: FiltrosResumenAsientos[K] extends undefined ? never : FiltrosResumenAsientos[K];
};
