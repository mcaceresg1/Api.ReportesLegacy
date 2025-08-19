export interface ReporteLibroMayorItem {
  // Saldos en Dólares
  saldoAcreedorDolar: number;
  creditoDolarMayor: number;
  saldoDeudorDolar: number;
  debitoDolarMayor: number;
  
  // Información de la Cuenta
  cuentaContable: string;
  descripcion: string;
  
  // Saldos en Moneda Local
  saldoAcreedor: number;
  saldoDeudor: number;
  
  // Movimientos en Dólares
  creditoDolar: number;
  creditoLocal: number;
  debitoDolar: number;
  debitoLocal: number;
  
  // Información del Asiento
  asiento: string;
  consecutivo: number;
  correlativoAsiento: string;
  
  // Información del Centro de Costo
  centroCosto: string;
  
  // Información del Tipo de Asiento
  tipoAsiento: string;
  
  // Información de Referencia
  referencia: string;
  documento: string;
  
  // Información del NIT
  nit: string;
  nitNombre: string;
  
  // Información del Origen
  origen: string;
  fuente: string;
  
  // Información del Período
  periodoContable: string;
  
  // Información del Usuario
  usuario: string;
  
  // Tipo de Línea (1=Saldo Inicial, 2=Movimiento)
  tipoLinea: number;
  
  // Fecha del Movimiento
  fecha: Date;
  
  // Información Adicional
  acepta: boolean;
  tipo: string;
}

export interface FiltrosReporteLibroMayor {
  // Filtros Generales
  usuario: string;
  fechaInicio: Date;
  fechaFin: Date;
  contabilidad: 'F' | 'A' | 'T';
  
  // Filtros de Cuenta Contable
  cuentasContables: string[];
  cuentasContablesExcluir: string[];
  criteriosCuentaContable: Array<{
    cuenta: string;
    operador: 'IGUAL' | 'INICIA' | 'TERMINA' | 'CONTENGA';
    valor: string;
    activo: boolean;
  }>;
  
  // Filtros de Centro de Costo
  centrosCosto: string[];
  centrosCostoExcluir: string[];
  
  // Filtros de NIT
  nits: string[];
  nitsExcluir: string[];
  
  // Filtros de Asiento
  asientos: string[];
  asientosExcluir: string[];
  rangoAsientos: {
    desde: string;
    hasta: string;
  };
  
  // Filtros de Tipo de Asiento
  tiposAsiento: string[];
  tiposAsientoExcluir: string[];
  
  // Filtros de Clase Asiento
  clasesAsiento: string[];
  clasesAsientoExcluir: string[];
  
  // Filtros de Origen
  origenes: string[];
  origenesExcluir: string[];
  
  // Filtros de Fuente
  fuentes: string[];
  fuentesExcluir: string[];
  
  // Filtros de Referencia
  referencias: string[];
  referenciasExcluir: string[];
  
  // Filtros de Documento
  documentos: string[];
  documentosExcluir: string[];
  
  // Filtros de Período Contable
  periodosContables: string[];
  periodosContablesExcluir: string[];
  
  // Filtros de Saldos
  saldoMinimo: number;
  saldoMaximo: number;
  saldoMinimoDolar: number;
  saldoMaximoDolar: number;
  
  // Filtros de Movimientos
  movimientoMinimo: number;
  movimientoMaximo: number;
  movimientoMinimoDolar: number;
  movimientoMaximoDolar: number;
  
  // Filtros de Títulos
  titulo: string;
  subtitulo: string;
  piePagina: string;
  mostrarTitulo: boolean;
  mostrarSubtitulo: boolean;
  mostrarPiePagina: boolean;
  
  // Filtros de Formato
  formatoExportacion: 'EXCEL' | 'PDF' | 'CSV' | 'HTML';
  incluirTotales: boolean;
  incluirSubtotales: boolean;
  agruparPor: 'NINGUNO' | 'CUENTA' | 'CENTRO_COSTO' | 'TIPO_ASIENTO' | 'CLASE_ASIENTO' | 'FECHA' | 'USUARIO' | 'PERIODO_CONTABLE';
  ordenarPor: 'FECHA' | 'CUENTA' | 'CENTRO_COSTO' | 'TIPO_ASIENTO' | 'CLASE_ASIENTO' | 'USUARIO' | 'VALOR' | 'PERIODO_CONTABLE';
  orden: 'ASC' | 'DESC';
  mostrarFiltros: boolean;
  mostrarResumen: boolean;
  maximoRegistros: number;
  incluirGraficos: boolean;
  incluirCalculos: boolean;
  
  // Filtros Específicos del Libro Mayor
  incluirSaldosIniciales: boolean;
  incluirMovimientos: boolean;
  incluirSaldosFinales: boolean;
  mostrarSoloCuentasConMovimiento: boolean;
  mostrarSoloCuentasConSaldo: boolean;
  agruparPorPeriodoContable: boolean;
  incluirTotalesPorCuenta: boolean;
  incluirTotalesPorCentroCosto: boolean;
  incluirTotalesPorPeriodo: boolean;
}

export interface ResumenLibroMayor {
  totalCuentas: number;
  totalCentrosCosto: number;
  totalAsientos: number;
  totalMovimientos: number;
  saldoTotalDeudor: number;
  saldoTotalAcreedor: number;
  saldoTotalDeudorDolar: number;
  saldoTotalAcreedorDolar: number;
  totalDebito: number;
  totalCredito: number;
  totalDebitoDolar: number;
  totalCreditoDolar: number;
  periodoContableInicio: string;
  periodoContableFin: string;
  fechaGeneracion: Date;
  usuarioGeneracion: string;
}

export interface ReporteLibroMayorResponse {
  items: ReporteLibroMayorItem[];
  resumen: ResumenLibroMayor;
  filtrosAplicados: FiltrosReporteLibroMayor;
  metadata: {
    totalRegistros: number;
    tiempoProcesamiento: number;
    fechaGeneracion: Date;
    version: string;
  };
}
