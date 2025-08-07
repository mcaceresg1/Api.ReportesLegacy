import { CentroCosto } from '../entities/CentroCosto';

export interface ICentroCostoRepository {
  getCentrosCostoByConjunto(conjunto: string): Promise<CentroCosto[]>;
  getCentroCostoByCodigo(conjunto: string, codigo: string): Promise<CentroCosto | null>;
  getCentrosCostoByTipo(conjunto: string, tipo: string): Promise<CentroCosto[]>;
  getCentrosCostoActivos(conjunto: string): Promise<CentroCosto[]>;
}
