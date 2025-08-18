export interface ReporteMovimientoContableAgrupadoItem {
  // Información de moneda
  sNombreMonLocal: string;
  sNombreMonDolar: string;
  
  // Información de cuenta contable
  sTituloCuenta: string;
  sCuentaContableDesc: string;
  sCuentaContable: string;
  
  // Información de NIT
  sTituloNit: string;
  sNitNombre: string;
  sNit: string;
  
  // Información de transacción
  sReferencia: string;
  nMontoLocal: number;
  nMontoDolar: number;
  sAsiento: string;
  dtFecha: Date;
  sFuente: string;
  sNotas: string;
  
  // Información de dimensión contable
  sDimension: string;
  sDimensionDesc: string;
  
  // Campos de agrupamiento (quiebres)
  sQuiebre1: string;
  sQuiebre2: string;
  sQuiebre3: string;
  sQuiebreDesc1: string;
  sQuiebreDesc2: string;
  sQuiebreDesc3: string;
  
  // Ordenamiento
  ORDEN: number;
}

export interface FiltrosReporteMovimientosContablesAgrupados {
  // Filtros básicos
  conjunto: string;
  fechaInicio: string; // YYYY-MM-DD
  fechaFin: string;    // YYYY-MM-DD
  contabilidad: 'F' | 'A' | 'T'; // F=Fiscal, A=Administrativa, T=Todas
  
  // Filtros de cuenta contable
  cuentaContableDesde?: string;
  cuentaContableHasta?: string;
  
  // Filtros de NIT
  nitDesde?: string;
  nitHasta?: string;
  
  // Filtros de asiento
  asientoDesde?: string;
  asientoHasta?: string;
  
  // Filtros de fuente
  fuentes?: string[];
  
  // Filtros de dimensión
  dimensiones?: string[];
  
  // Configuración del reporte
  incluirDiario: boolean;      // Incluir movimientos del diario
  incluirMayor: boolean;       // Incluir movimientos del mayor
  agruparPor: 'CUENTA' | 'NIT' | 'DIMENSION' | 'FECHA' | 'NINGUNO';
  ordenarPor: 'CUENTA' | 'NIT' | 'DIMENSION' | 'FECHA' | 'MONTO';
  orden: 'ASC' | 'DESC';
  
  // Paginación
  pagina?: number;
  registrosPorPagina?: number;
  
  // Exportación
  formatoExportacion?: 'EXCEL' | 'PDF' | 'CSV' | 'JSON';
  incluirTotales?: boolean;
  incluirSubtotales?: boolean;
}

export interface RespuestaReporteMovimientosContablesAgrupados {
  success: boolean;
  message: string;
  data: ReporteMovimientoContableAgrupadoItem[];
  totalRegistros: number;
  totalPaginas: number;
  paginaActual: number;
  registrosPorPagina: number;
  filtrosAplicados: FiltrosReporteMovimientosContablesAgrupados;
  metadata: {
    conjunto: string;
    fechaGeneracion: Date;
    usuario: string;
    formatoExportacion: string;
    agrupamiento: string;
    ordenamiento: string;
    orden: string;
    incluyeTotales: boolean;
    incluyeSubtotales: boolean;
    tiempoEjecucion: number;
  };
}
