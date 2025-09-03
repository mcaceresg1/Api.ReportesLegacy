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

export interface FiltrosReporteRolDeVacaciones {
  fecha_inicio: string;
  fecha_fin: string;
  id_usuario: string;
  pagina: number;
  registrosPorPagina: number;
}

export interface FiltrosReportePrestamoCtaCte {
  cta_cte: string;
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

export interface FiltrosReporteAnualizado {
  id_usuario: string;
  tipo: "nomina" | "periodo";
  codigo_nomina: number;
  periodo: number;
}

export interface RespuestaReporteAnualizado {
  success: boolean;
  message: string;
  data: GNReporteAnualizado | undefined;
}

export interface FiltrosReporteAccionesDePersonal {
  fecha_accion_inicio: string;
  fecha_accion_fin: string;
  id_usuario: string;
}

export interface FiltrosReporteContratos {
  id_usuario: string;
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
