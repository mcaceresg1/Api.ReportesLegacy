// Entidades para Saldo Promedios basadas en las queries SQL proporcionadas

export interface CuentaContableOption {
  cuenta_contable: string;
  descripcion: string;
  descripcion_ifrs: string | null;
  Uso_restringido: string;
}

export interface FiltroSaldoPromedios {
  conjunto: string;
  cuenta_contable_desde?: string;
  cuenta_contable_hasta?: string;
  fecha_desde: string;
  fecha_hasta: string;
  saldosAntesCierre?: boolean;
}

export interface SaldoPromediosItem {
  centro_costo: string;
  cuenta_contable: string;
  saldo_inicial_local: number;
  saldo_inicial_dolar: number;
  saldo_inicial_corp_local: number;
  saldo_inicial_corp_dolar: number;
  saldo_inicial_fisc_und: number;
  saldo_inicial_corp_und: number;
  debito_fisc_local: number;
  credito_fisc_local: number;
  debito_fisc_dolar: number;
  credito_fisc_dolar: number;
  debito_corp_local: number;
  credito_corp_local: number;
  debito_corp_dolar: number;
  credito_corp_dolar: number;
  debito_fisc_und: number;
  credito_fisc_und: number;
  debito_corp_und: number;
  credito_corp_und: number;
  saldo_final_local: number;
  saldo_final_dolar: number;
  saldo_final_corp_local: number;
  saldo_final_corp_dolar: number;
  saldo_final_fisc_und: number;
  saldo_final_corp_und: number;
  saldo_promedio_local: number;
  saldo_promedio_dolar: number;
  saldo_promedio_corp_local: number;
  saldo_promedio_corp_dolar: number;
  saldo_promedio_fisc_und: number;
  saldo_promedio_corp_und: number;
}
