import { CuentaContable } from '../entities/CuentaContable';

export interface ICuentaContableRepository {
  getCuentasContablesByConjunto(conjunto: string, limit?: number, offset?: number): Promise<CuentaContable[]>;
  getCuentaContableByCodigo(conjunto: string, codigo: string): Promise<CuentaContable | null>;
  getCuentasContablesByTipo(conjunto: string, tipo: string, limit?: number, offset?: number): Promise<CuentaContable[]>;
  getCuentasContablesActivas(conjunto: string, limit?: number, offset?: number): Promise<CuentaContable[]>;
  getCuentasContablesByConjuntoCount(conjunto: string): Promise<number>;
  getCuentasContablesByTipoCount(conjunto: string, tipo: string): Promise<number>;
  getCuentasContablesActivasCount(conjunto: string): Promise<number>;
}
