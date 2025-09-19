export interface EmpresaOfliplan {
  CO_EMPR: string;
  DE_NOMB: string;
}

export interface EmpresasOfliplanRequest {
  // No parameters needed for this query
}

export interface EmpresasOfliplanResponse {
  success: boolean;
  data: EmpresaOfliplan[];
  message: string;
}
