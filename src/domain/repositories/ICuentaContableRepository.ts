import { CuentaContable } from '../entities/CuentaContable';

export interface ICuentaContableRepository {
  getCuentasContablesByConjunto(conjunto: string): Promise<CuentaContable[]>;
  getCuentaContableByCodigo(conjunto: string, codigo: string): Promise<CuentaContable | null>;
  getCuentasContablesByTipo(conjunto: string, tipo: string): Promise<CuentaContable[]>;
  getCuentasContablesActivas(conjunto: string): Promise<CuentaContable[]>;
}
