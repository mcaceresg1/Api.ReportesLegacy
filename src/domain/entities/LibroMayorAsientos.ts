export interface LibroMayorAsientos {
  asiento: string;
  fuente: string;
  contabilidad: string;
  tipo_asiento: string;
  fecha: Date;
  origen: string;
  documento_global: string;
  monto_total_local: number;
  monto_total_dolar: number;
  mayor_auditoria: string;
  exportado: string;
  tipo_ingreso_mayor: string;
}

export interface FiltrosLibroMayorAsientos {
  asiento?: string;
  tipo_asiento?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  contabilidad?: string;
  mayorizacion?: string;
  exportados?: string;
  documento_global?: string;
  clases_asiento?: string[];
  origen?: string[];
  page?: number;
  limit?: number;
}

export interface LibroMayorAsientosResponse {
  success: boolean;
  data: LibroMayorAsientos[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message: string;
}

export interface FiltroAsientosResponse {
  success: boolean;
  data: {
    asientos: string[];
    tipos_asiento: string[];
    origenes: string[];
  };
  message: string;
}
