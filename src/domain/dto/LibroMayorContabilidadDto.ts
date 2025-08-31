import { LibroMayorContabilidad, FiltrosLibroMayorContabilidad } from '../entities/LibroMayorContabilidad';

export interface LibroMayorContabilidadResponseDto {
  success: boolean;
  message: string;
  data?: LibroMayorContabilidad[];
  total?: number;
  page?: number;
  limit?: number;
  error?: string;
}

export interface LibroMayorContabilidadSingleResponseDto {
  success: boolean;
  message: string;
  data?: LibroMayorContabilidad;
  error?: string;
}

export interface GenerarReporteRequestDto {
  usuario: string;
  filtros: FiltrosLibroMayorContabilidad;
  fechaInicial: string;
  fechaFinal: string;
}

export interface GenerarReporteResponseDto {
  success: boolean;
  message: string;
  data?: {
    registrosGenerados: number;
    fechaGeneracion: Date;
    usuario: string;
    filtros: FiltrosLibroMayorContabilidad;
  };
  error?: string;
}

export interface LimpiarReporteRequestDto {
  usuario: string;
}

export interface LimpiarReporteResponseDto {
  success: boolean;
  message: string;
  data?: {
    registrosEliminados: number;
    fechaLimpieza: Date;
    usuario: string;
  };
  error?: string;
}

export interface FiltrosRequestDto {
  filtros: FiltrosLibroMayorContabilidad;
}

export interface PaginationDto {
  page: number;
  limit: number;
  total: number;
}

export interface LibroMayorContabilidadPagedResponseDto {
  success: boolean;
  message: string;
  data?: LibroMayorContabilidad[];
  pagination?: PaginationDto;
  error?: string;
}
