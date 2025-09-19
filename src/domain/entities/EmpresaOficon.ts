export interface EmpresaOficon {
  CO_EMPR: string;
  DE_NOMB: string;
}

export interface EmpresasOficonRequest {
  // No parameters needed for this query
}

export interface EmpresasOficonResponse {
  success: boolean;
  data: EmpresaOficon[];
  message: string;
}
