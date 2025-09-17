import { CentroCosto } from '../entities/CentroCosto';

export interface ICentroCostoRepository {
  getCentrosCostoByConjunto(conjunto: string, page?: number, limit?: number): Promise<{
    success: boolean;
    data: CentroCosto[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    message: string;
  }>;
  getCentroCostoByCodigo(conjunto: string, codigo: string): Promise<CentroCosto | null>;
  getCentrosCostoByTipo(conjunto: string, tipo: string, page?: number, limit?: number): Promise<{
    success: boolean;
    data: CentroCosto[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    message: string;
  }>;
  getCentrosCostoActivos(conjunto: string, page?: number, limit?: number): Promise<{
    success: boolean;
    data: CentroCosto[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    message: string;
  }>;
  getCentrosCostoByConjuntoCount(conjunto: string): Promise<number>;
  getCentrosCostoByTipoCount(conjunto: string, tipo: string): Promise<number>;
  getCentrosCostoActivosCount(conjunto: string): Promise<number>;
}
