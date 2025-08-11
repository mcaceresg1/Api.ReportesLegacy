export interface ReporteAsientosSinDimension {
  asiento: string;
  consecutivo: number;
  fechaAsiento: Date;
  origen: string;
  usuarioCreacion: string;
  fuente: string;
  referencia: string;
  montoLocal: number;
  montoDolar: number;
  cuentaContable: string;
  centroCosto: string;
  rowOrderBy?: number | undefined;
}

export interface ReporteAsientosSinDimensionCreate {
  asiento: string;
  consecutivo: number;
  fechaAsiento: Date;
  origen: string;
  usuarioCreacion: string;
  fuente: string;
  referencia: string;
  montoLocal: number;
  montoDolar: number;
  cuentaContable: string;
  centroCosto: string;
}

export interface ReporteAsientosSinDimensionUpdate {
  asiento?: string;
  consecutivo?: number;
  fechaAsiento?: Date;
  origen?: string;
  usuarioCreacion?: string;
  fuente?: string;
  referencia?: string;
  montoLocal?: number;
  montoDolar?: number;
  cuentaContable?: string;
  centroCosto?: string;
}
