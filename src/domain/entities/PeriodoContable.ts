export interface PeriodoContable {
  centro_costo: string;
  cuenta_contable: string;
  fecha: string;
  saldo_normal: string;
  descripcion: string;
  saldo_inicial_local: number;
  debito_fisc_local: number;
  credito_fisc_local: number;
  saldo_fisc_local: number;
  saldo_inicial_dolar: number;
  debito_fisc_dolar: number;
  credito_fisc_dolar: number;
  saldo_fisc_dolar: number;
  saldo_inicial_und: number;
  debito_fisc_und: number;
  credito_fisc_und: number;
  saldo_fisc_und: number;
}

export interface FiltroPeriodoContable {
  conjunto: string;
  centro_costo?: string;
  fechaDesde: string;
  fechaHasta: string;
  saldosAntesCierre: boolean;
  SoloCuentasMovimientos: boolean;
}

export interface CentroCosto {
  centro_costo: string;
  descripcion: string;
}

export interface PeriodoContableInfo {
  FECHA_FINAL: string;
  DESCRIPCION: string;
  CONTABILIDAD: string;
  FIN_PERIODO_ANUAL: string;
  ESTADO: string;
  NoteExistsFlag: boolean;
  RecordDate: string;
  RowPointer: string;
  CreatedBy: string;
  UpdatedBy: string;
  CreateDate: string;
}
