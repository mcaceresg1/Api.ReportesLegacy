export interface BalanceComprobacionOficonRequest {
  ISCO_EMPR: string; // Código de empresa (REQUERIDO)
  INNU_ANNO: number; // Año (REQUERIDO)
  INNU_MESE: number; // Mes (REQUERIDO)
  ISTI_BALA?: string; // Tipo balance - M: mensual, A: acumulado (OPCIONAL)
  ISST_QUIE?: string; // Selección quiebre - N: sin quiebre, S: con quiebre (OPCIONAL)
  INNV_PRES?: number; // Presentación (OPCIONAL)
  ISCO_CNTA_INIC?: string; // Cuenta inicial (OPCIONAL)
  ISCO_CNTA_FINA?: string; // Cuenta final (OPCIONAL)
  INNU_DGTO?: number; // Balance dígito (OPCIONAL)
  ISTI_PRES?: string; // Tipo presentación - REP o TAB (OPCIONAL)
  ISTI_MONT?: string; // Filtro de filas - M: con Monto, T: Todas las Filas (OPCIONAL)
}

export interface BalanceComprobacionOficon {
  // Campos comunes
  CO_CNTA_EMPR: string; // Código cuenta empresa
  DE_CNTA_EMPR: string; // Descripción cuenta empresa
  IM_SALD_ANTE: number; // Saldo anterior
  IM_CARG_MESE: number; // Cargo mes
  IM_ABON_MESE: number; // Abono mes
  IM_SALD_CARG: number; // Saldo cargo
  IM_SALD_ABON: number; // Saldo abono
  IM_ACTI_INVE: number; // Activo inventario
  IM_PASI_INVE: number; // Pasivo inventario
  IM_PERD_NATU: number; // Pérdida natural
  IM_GANA_NATU: number; // Ganancia natural
  IM_PERD_FUNC: number; // Pérdida funcional
  IM_GANA_FUNC: number; // Ganancia funcional

  // Columnas extra (solo cuando ISTI_PRES = 'REP')
  COL_EXTRA_1?: number;
  COL_EXTRA_2?: number;
  COL_EXTRA_3?: number;
  COL_EXTRA_4?: number;
  COL_EXTRA_5?: number;
  COL_EXTRA_6?: number;
  COL_EXTRA_7?: number;
  COL_EXTRA_8?: number;
  COL_EXTRA_9?: number;
  COL_EXTRA_10?: number;
  COL_EXTRA_11?: number;
  COL_EXTRA_12?: number;
  COL_EXTRA_13?: number;
}

export interface BalanceComprobacionOficonResponse {
  success: boolean;
  data: BalanceComprobacionOficon[];
  totalRecords: number;
  tipoBalance: string; // MENSUAL o ACUMULADO
  tipoQuiebre: string; // SIN_QUIEBRE o CON_QUIEBRE
  tipoPresentacion: string; // REPORTE o TABLA
  tipoMonto: string; // CON_MONTO o TODAS_FILAS
  message: string;
}
