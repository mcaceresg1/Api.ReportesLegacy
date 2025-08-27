export interface LibroMayorAsientos {
  // Campos del reporte principal
  asiento: string;
  fuente: string;
  fecha: Date;
  nit: string;
  debito_local: number;
  credito_local: number;
  debito_dolar: number;
  credito_dolar: number;
  referencia: string;
  tipo_asiento: string;
  cuenta_contable: string;
  descripcion: string;
  centro_costo: string;
  descripcion_centro_costo: string;
}

export interface FiltroAsientos {
  asiento?: string;
  referencia?: string;
}

export interface LibroMayorAsientosRequest {
  conjunto: string;
  asiento?: string;
  referencia?: string;
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
    asiento: string;
    referencia: string;
  }[];
  message: string;
}
