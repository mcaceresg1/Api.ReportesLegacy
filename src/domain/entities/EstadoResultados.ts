export interface EstadoResultados {
  cuenta_contable: string;
  fecha_balance: Date;
  saldo_inicial: number;
  nombre_cuenta: string;
  fecha_inicio: Date;
  fecha_cuenta: Date;
  saldo_final: number;
  tiporeporte: string;
  posicion: string;
  caracter: string;
  moneda: string;
  padre: string;
  orden: number;
  mes: string;
}

export interface FiltrosEstadoResultados {
  // Pestaña General
  tipoEgp?: string; // Lista desplegable, en blanco x defecto
  moneda?: 'NUEVO_SOL' | 'DOLAR' | 'AMBOS'; // Radiobutton: Nuevo Sol, Dólar, Ambos
  fecha?: string; // Campo fecha
  origen?: 'DIARIO' | 'MAYOR' | 'AMBOS'; // Radiobutton: Diario / Mayor / Ambos
  contabilidad?: 'FISCAL' | 'CORPORATIVA'; // Radiobutton: Fiscal / Corporativa
  comparativo?: 'ANUAL' | 'MENSUAL'; // Radiobutton: Anual / Mensual
  resultado?: 'ANUAL' | 'MENSUAL' | 'RANGO_FECHAS'; // Radiobutton: Anual / Mensual / Rango de Fechas
  excluirAsientoCierreAnual?: boolean; // Checkbox desmarcado
  incluirAsientoCierreAnual?: boolean; // Checkbox desmarcado
  incluirDoceUltimosPeriodos?: boolean; // Checkbox desmarcado
  mostrarInformacionAnual?: boolean; // Checkbox desmarcado
  libroElectronico?: boolean; // Checkbox, activa lista desplegable
  versionLibroElectronico?: string; // versión 5 por defecto

  // Pestaña Centro de Costo
  centroCostoTipo?: 'RANGO' | 'AGRUPACION'; // Radiobutton: Rango / Agrupación
  centroCostoDesde?: string; // Rango Desde
  centroCostoHasta?: string; // Rango Hasta
  centroCostoAgrupacion?: string; // Lista desplegable + Rango Desde-Hasta
  gruposCentroCosto?: string[]; // Lista desplegable

  // Pestaña Presupuestos
  incluirInformacionPresupuestos?: boolean; // Checkbox, desmarcado
  presupuesto?: string; // campo texto que se activa al marcar el Checkbox

  // Pestaña Tipo de Asiento
  tiposAsiento?: string[]; // Lista con checkbox en cada ítem de la lista

  // Pestaña Dimensión
  dimensionAdicional?: string; // Lista desplegable, no editable

  // Pestaña Títulos
  tituloPrincipal?: string;
  titulo2?: string;
  titulo3?: string;
  titulo4?: string;

  // Common filters
  conjunto: string;
  usuario: string;
}

export interface EstadoResultadosRequest extends FiltrosEstadoResultados {
  page?: number;
  pageSize?: number;
}

export interface TipoEgp {
  tipo: string;
  descripcion: string;
  qrp: string;
}

export interface PeriodoContable {
  descripcion: string;
  contabilidad: string;
  estado: string;
}

export interface EstadoResultadosResponse {
  success: boolean;
  data: EstadoResultados[];
  pagination?: {
    page: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
  };
  message?: string;
}
