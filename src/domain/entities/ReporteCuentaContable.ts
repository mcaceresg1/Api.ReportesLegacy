export interface ReporteCuentaContable {
  CUENTA_CONTABLE: string;
  DESCRIPCION?: string;
  TIPO?: string;
  CENTRO_COSTO?: string;
  ACEPTA_DATOS?: boolean;
}

export interface FiltroCentroCosto {
  CENTRO_COSTO: string;
  DESCRIPCION?: string;
}
