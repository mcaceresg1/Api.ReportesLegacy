export interface FiltrosReporteGenericoSaldos {
  fechaInicio: string;
  fechaFin: string;
  contabilidad: string;
  origen: string;
  cuentasContablesPorFecha: boolean;
  agrupadoPor: string;
  porTipoCambio: boolean;
  filtroChecks: boolean;
  libroElectronico: boolean;
  formatoCuentas: string;
  tituloPrincipal: string;
  titulo2: string;
  titulo3: string;
  titulo4: string;
  fechaImpresion: string;
}

export interface ReporteGenericoSaldos {
  tipo: string;
  numero: string;
  apellidosNombres: string;
  fecha: string;
  concepto: string;
  monto: number;
}

export interface FiltroCuentaContable {
  cuenta_contable: string;
  descripcion: string;
  uso_restringido: boolean;
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

export interface FiltroTipoDocumento {
  codigo: string;
  descripcion: string;
}

export interface FiltroTipoAsiento {
  codigo: string;
  descripcion: string;
}

export interface FiltroClaseAsiento {
  codigo: string;
  descripcion: string;
}
