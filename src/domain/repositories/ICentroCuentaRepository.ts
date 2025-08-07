import { CentroCuenta } from '../entities/CentroCuenta';

export interface ICentroCuentaRepository {
  getCentrosCuentaByConjunto(conjunto: string): Promise<CentroCuenta[]>;
  getCentrosCuentaByCuenta(conjunto: string, cuentaContable: string): Promise<CentroCuenta[]>;
  getCentrosCuentaByCentro(conjunto: string, centroCosto: string): Promise<CentroCuenta[]>;
}
