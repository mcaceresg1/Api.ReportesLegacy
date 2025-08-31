export interface LibroMayorContabilidad {
  // Campos principales
  id?: number;
  
  // Campos de saldos
  saldoAcreedorDolar: number;
  creditoDolarMayor: number;
  saldoDeudorDolar: number;
  debitoDolarMayor: number;
  saldoAcreedor: number;
  creditoDolar: number;
  creditoLocal: number;
  saldoDeudor: number;
  debitoDolar: number;
  debitoLocal: number;
  
  // Campos de identificación
  cuentaContable: string;
  centroCosto: string;
  tipoAsiento: string;
  descripcion: string;
  consecutivo: number;
  referencia: string;
  nitNombre: string;
  documento: string;
  credito: number;
  asiento: string;
  debito: number;
  
  // Campos de fecha y tipo
  fecha: Date;
  tipo: string;
  nit: string;
  fuente: string;
  
  // Campos adicionales
  periodoContable?: Date;
  correlativoAsiento?: string;
  tipoLinea?: number;
  
  // Campos de auditoría
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LibroMayorContabilidadCreate {
  saldoAcreedorDolar: number;
  creditoDolarMayor: number;
  saldoDeudorDolar: number;
  debitoDolarMayor: number;
  saldoAcreedor: number;
  creditoDolar: number;
  creditoLocal: number;
  saldoDeudor: number;
  debitoDolar: number;
  debitoLocal: number;
  cuentaContable: string;
  centroCosto: string;
  tipoAsiento: string;
  descripcion: string;
  consecutivo: number;
  referencia: string;
  nitNombre: string;
  documento: string;
  credito: number;
  asiento: string;
  debito: number;
  fecha: Date;
  tipo: string;
  nit: string;
  fuente: string;
  periodoContable?: Date;
  correlativoAsiento?: string;
  tipoLinea?: number;
}

export interface LibroMayorContabilidadUpdate {
  saldoAcreedorDolar?: number;
  creditoDolarMayor?: number;
  saldoDeudorDolar?: number;
  debitoDolarMayor?: number;
  saldoAcreedor?: number;
  creditoDolar?: number;
  creditoLocal?: number;
  saldoDeudor?: number;
  debitoDolar?: number;
  debitoLocal?: number;
  cuentaContable?: string;
  centroCosto?: string;
  tipoAsiento?: string;
  descripcion?: string;
  consecutivo?: number;
  referencia?: string;
  nitNombre?: string;
  documento?: string;
  credito?: number;
  asiento?: string;
  debito?: number;
  fecha?: Date;
  tipo?: string;
  nit?: string;
  fuente?: string;
  periodoContable?: Date;
  correlativoAsiento?: string;
  tipoLinea?: number;
}

export interface FiltrosLibroMayorContabilidad {
  fechaInicial: string;
  fechaFinal: string;
  moneda: string;
  clase: string;
  contabilidad: string;
  tipoReporte: string;
  claseReporte: string;
  origen: string;
  nivelAnalisis: string;
  ordenadoPor: string;
  cuentaContableDesde: string;
  cuentaContableHasta: string;
  centroCostoDesde: string;
  centroCostoHasta: string;
  tipoCentroCosto: string;
  libroElectronico: boolean;
  versionLibroElectronico: string;
  excluirCierreAnual: boolean;
  considerarApertura: boolean;
  detalleMovimientoEfectivo: boolean;
  conexionDirecta: boolean;
  noMostrarSinSaldo: boolean;
  respetarNIT: boolean;
  incluirAuditoria: boolean;
}
