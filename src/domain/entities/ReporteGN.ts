export interface GNAccionDePersonal {
  numero_accion: number;
  descripcion_accion: string;
  estado_accion: string;
  fecha: Date;
  empleado: string;
  nombre: string;
  fecha_rige: Date;
  fecha_vence: Date;
  puesto: string;
  plaza: string;
  salario_promedio: number;
  salario_diario_int: number;
  departamento: string;
  centro_costo: string;
  nomina: string;
  dias_accion: number;
  saldo: number;
  numero_accion_cuenta: number;
  regimen_vacacional: string;
  descripcion: string;
  RowPointer: string;
  origen: string;
}

export interface GNContrato {
  empleado: string;
  nombre: string;
  tipo_contrato: string;
  fecha_inicio: Date;
  fecha_finalizacion: Date;
  estado_contrato: string;
}

export interface GNRolDeVacaciones {
  empleado: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  duracion: number;
  tipo_vacacion: string;
  nombre: string;
}

export interface GNReporteAnualizado {
  esquema: string;
  codigo: string;
  nomina: string;
  empleado: string;
  fecha_ingreso: Date;
  fecha_salida: Date;
  centro_costo: string;
  sede: string;
  puesto: string;
  essalud: string;
  afp: string;
  cuspp: string;
  estado: string;
}

export interface GNPrestamoCuentaCorriente {
  num_movimiento: number;
  fecha_ingreso: Date;
  forma_pago: string;
  estado: string;
  tipo_movimiento: string;
  descripcion: string;
  numero_cuotas: number;
  moneda: string;
  tasa_interes: number;
  monto_local: number;
  monto_dolar: number;
  saldo_local: number;
  saldo_dolar: number;
  monto_int_local: number;
  monto_int_dolar: number;
  saldo_int_local: number;
  saldo_int_dolar: number;
  fch_ult_modific: Date;
  usuario_apro: string;
  fecha_apro: Date;
  usuario_rh: string;
  fecha_apro_rh: Date;
  tipo_cambio: string;
  documento: string;
  observaciones: string;
  empleado: string;
  RowPointer: string;
  esquema_origen: string;
}

export interface GNPrestamo {
  ESQUEMA: string
DNI: string
APELLIDOS_NOMBRES: string
FECHA_INGRESO_EMPLEADO: string
PUESTO: string
SEDE: string
CENTRO_COSTO: string
DESCRIPCION_CC: string
NUM_MOVIMIENTO: number
COD_TIPO_MOVIMIENTO: string
TIPO_MOVIMIENTO: string
MONEDA: string
NUMERO_NOMINA: number
NOMINA_MES: string
NUMERO_CUOTA_DESCONTADA: number
MONTO_CUOTA_DESCONTADA: number
MONTO_CUOTA_DESCONTADA_DOLAR: number
ESTADO_CUOTA_DESCONTADA: string
MONTO_LOCAL: number
MONTO_ABONADO_CUOTA: number
SALDO_CUOTA: number
MONTO_ABONADO: number
FECHA_INGRESO: string
NUM_CUOTAS: number
SALDO_LOCAL: number
CODIGO_ESTADO_PRESTAMO: string
ESTADO_PRESTAMO: string
DIFERENCIA: number
ESTADO_SALDO: string
FECHA_CREACION_SISTEMA: string
ESTADO_EMPLEADO: string
FECHA_SALIDA: string
}




export interface FiltrosReporteRolDeVacaciones {
  fecha_inicio: string;
  fecha_fin: string;
  cod_empleado: string;
  pagina: number;
  registrosPorPagina: number;
}

export interface FiltrosReportePrestamoCtaCte {
  cod_empleado: string;
  naturaleza: string
}

export interface FiltrosReporteAnualizado {
  cod_empleado: string;
  filtro: "N" | "P";
  codigo_nomina: number;
  periodo: number;
  centro_costo: string
  area: string
  activo: number

}

export interface FiltrosReporteAccionesDePersonal {
  fecha_accion_inicio: string;
  fecha_accion_fin: string;
  cod_empleado: string;
}

export interface FiltrosReporteContratos {
  cod_empleado: string;
}

export interface FiltrosReportePrestamos {
  cod_empleado: string
  num_nomina: number
  tipo_prestamo: string,
  estado_prestamo: string
  numero_nomina: number
  estado_empleado: string
  estado_cuota: string
}

export interface FiltrosBoletaDePago {
  num_nomina: number
  cod_empleado: string
}

export interface RespuestaReportePrestamos {
  success: boolean
  message: string
  data: GNPrestamo[]
}

export interface RespuestaReporteAnualizado {
  success: boolean;
  message: string;
  data: GNReporteAnualizado | undefined;
}

export interface RespuestaReportePrestamoCtaCte {
  success: boolean;
  message: string;
  data: GNPrestamoCuentaCorriente[];
}

export interface RespuestaReporteRolDeVacaciones {
  success: boolean;
  message: string;
  totalRegistros: number;
  totalPaginas: number;
  paginaActual: number;
  registrosPorPagina: number;
  data: GNRolDeVacaciones[];
}

export interface RespuestaReporteAccionesDePersonal {
  success: boolean;
  message: string;
  data: GNAccionDePersonal[];
}

export interface RespuestaReporteContratos {
  success: boolean;
  message: string;
  data: GNContrato[];
}

export interface RespuestaReporteBoletasDePago {
  success: boolean
  message: string
  data: {
    periodo_planilla: any
    compania: any
    boleta: any,
    horas_dias: any,
    ingresos: any,
    aportes: any,
    descuentos: any,
    goce_real: any
  }
}