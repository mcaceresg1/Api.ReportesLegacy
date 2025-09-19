export interface PlanillaAnualizadaOfliplanRequest {
  ISCO_EMPR: string; // Código de empresa (REQUERIDO)
  INNU_ANNO: number; // Año (REQUERIDO)
}

export interface PlanillaAnualizadaOfliplan {
  // Campos de cabecera
  CO_EMPR_RPTS: string; // Código empresa reportes
  DE_NOMB_CORT: string; // Descripción nombre corto
  CO_UNID_RPTS: string; // Código unidad reportes
  DE_UNID_RPTS: string; // Descripción unidad reportes
  CO_PLAN_RPTS: string; // Código plan reportes
  DE_TIPO_PLAN: string; // Descripción tipo plan
  CO_TRAB_RPTS: string; // Código trabajador reportes
  NO_TRAB_RPTS: string; // Nombre trabajador reportes
  TI_CPTO_RPTS: string; // Tipo concepto reportes
  CO_CPTO_FORM: string; // Código concepto formato
  NU_ORDE_PRES: number; // Número orden presentación
  DE_CPTO_RPTS: string; // Descripción concepto reportes
  TI_AFEC_RPTS: string; // Tipo afectación reportes
  CO_CENT_COST: string; // Código centro costo
  DE_CENT_COST: string; // Descripción centro costo
  CO_PUES_TRAB: string; // Código puesto trabajo
  DE_PUES_TRAB: string; // Descripción puesto trabajo
  NU_AFPS: number; // Número AFPS
  NU_ESSA: number; // Número ESSA
  CO_AFPS: string; // Código AFPS
  NO_AFPS: string; // Nombre AFPS
  NU_DATO_ENER: number; // Dato enero
  NU_DATO_FEBR: number; // Dato febrero
  NU_DATO_MARZ: number; // Dato marzo
  NU_DATO_ABRI: number; // Dato abril
  NU_DATO_MAYO: number; // Dato mayo
  NU_DATO_JUNI: number; // Dato junio
  NU_DATO_JULI: number; // Dato julio
  NU_DATO_AGOS: number; // Dato agosto
  NU_DATO_SETI: number; // Dato septiembre
  NU_DATO_OCTU: number; // Dato octubre
  NU_DATO_NOVI: number; // Dato noviembre
  NU_DATO_DICI: number; // Dato diciembre
}

export interface PlanillaAnualizadaOfliplanResponse {
  success: boolean;
  data: PlanillaAnualizadaOfliplan[];
  totalRecords: number;
  empresa: string;
  año: number;
  message: string;
}
