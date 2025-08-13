export interface ReporteMovimientoContableItem {
  centroCosto: string;
  referencia: string;
  documento: string;
  asiento: number;
  razonSocial: string;
  fecha: string; // ISO date
  tipo: string;
  nit: string;
  creditoDolar: number;
  creditoLocal: number;
  debitoDolar: number;
  debitoLocal: number;
  cuentaContable: string;
  descripcionCuentaContable: string;
  descripcionCentroCosto: string;
  usuario: string;
}

export interface CampoPersonalizado {
  id: number;
  nombre: string;
  tipo: 'TEXTO' | 'NUMERO' | 'FECHA' | 'BOOLEAN';
  valor: string;
  activo: boolean;
  obligatorio: boolean;
}

export interface FiltrosReporteMovimientosContables {
  // Filtros Generales
  usuario: string;
  fechaInicio: Date;
  fechaFin: Date;
  contabilidad: 'F' | 'A' | 'T';
  
  // Filtros de Asientos
  asientos: number[];
  asientosExcluir: number[];
  rangoAsientos: {
    desde: number;
    hasta: number;
  };
  
  // Filtros de Tipos de Asiento
  tiposAsiento: string[];
  tiposAsientoExcluir: string[];
  
  // Filtros de Clase Asiento
  clasesAsiento: string[];
  clasesAsientoExcluir: string[];
  
  // Filtros Otros
  nits: string[];
  nitsExcluir: string[];
  centrosCosto: string[];
  centrosCostoExcluir: string[];
  referencias: string[];
  referenciasExcluir: string[];
  documentos: string[];
  documentosExcluir: string[];
  
  // Filtros de Cuenta Contable
  cuentasContables: string[];
  cuentasContablesExcluir: string[];
  criteriosCuentaContable: Array<{
    cuenta: string;
    operador: 'IGUAL' | 'INICIA' | 'TERMINA' | 'CONTENGA';
    valor: string;
    activo: boolean;
  }>;
  
  // Filtros de Títulos
  titulo: string;
  subtitulo: string;
  piePagina: string;
  mostrarTitulo: boolean;
  mostrarSubtitulo: boolean;
  mostrarPiePagina: boolean;
  
  // Filtros de Campos Configurables
  camposPersonalizados: CampoPersonalizado[];
  formatoExportacion: 'EXCEL' | 'PDF' | 'CSV' | 'HTML';
  incluirTotales: boolean;
  incluirSubtotales: boolean;
  agruparPor: 'NINGUNO' | 'CUENTA' | 'CENTRO_COSTO' | 'TIPO_ASIENTO' | 'CLASE_ASIENTO' | 'FECHA' | 'USUARIO';
  ordenarPor: 'FECHA' | 'CUENTA' | 'CENTRO_COSTO' | 'TIPO_ASIENTO' | 'CLASE_ASIENTO' | 'USUARIO' | 'VALOR';
  orden: 'ASC' | 'DESC';
  mostrarFiltros: boolean;
  mostrarResumen: boolean;
  maximoRegistros: number;
  incluirGraficos: boolean;
  incluirCalculos: boolean;
}
