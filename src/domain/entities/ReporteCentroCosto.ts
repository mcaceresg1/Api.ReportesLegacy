export interface FiltroCuentaContable {
  cuenta_contable: string;
  descripcion: string;
  uso_restringido: boolean;
}

export interface ReporteCentroCosto {
  centro_costo: string;
  descripcion: string;
  acepta_datos: boolean;
}

export interface DetalleCuentaContable {
  descripcion: string;
  descripcion_ifrs: string;
  origen_conversion: string;
  conversion: string;
  acepta_datos: boolean;
  usa_centro_costo: boolean;
  tipo_cambio: string;
  acepta_unidades: boolean;
  unidad: string;
  uso_restringido: boolean;
  maneja_tercero: boolean;
}
