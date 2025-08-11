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
  contabilidad?: 'F' | 'A' | 'T'; // F=Fiscal, A=Administrativo, T=Todos
}

// Tipo para crear filtros sin propiedades undefined
export type FiltrosResumenAsientosInput = {
  [K in keyof FiltrosResumenAsientos]: FiltrosResumenAsientos[K] extends undefined ? never : FiltrosResumenAsientos[K];
};
