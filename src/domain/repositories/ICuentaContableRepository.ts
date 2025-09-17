import { CuentaContable } from '../entities/CuentaContable';

export interface ICuentaContableRepository {
  getCuentasContablesByConjunto(conjunto: string, page?: number, limit?: number): Promise<{
    success: boolean;
    data: CuentaContable[];
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
  getCuentaContableByCodigo(conjunto: string, codigo: string): Promise<CuentaContable | null>;
  getCuentasContablesByTipo(conjunto: string, tipo: string, page?: number, limit?: number): Promise<{
    success: boolean;
    data: CuentaContable[];
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
  getCuentasContablesActivas(conjunto: string, page?: number, limit?: number): Promise<{
    success: boolean;
    data: CuentaContable[];
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
  getCuentasContablesByConjuntoCount(conjunto: string): Promise<number>;
  getCuentasContablesByTipoCount(conjunto: string, tipo: string): Promise<number>;
  getCuentasContablesActivasCount(conjunto: string): Promise<number>;
}
