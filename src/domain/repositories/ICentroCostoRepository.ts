import { CentroCosto } from '../entities/CentroCosto';

export interface ICentroCostoRepository {
  getCentrosCostoByConjunto(conjunto: string, limit?: number, offset?: number): Promise<CentroCosto[]>;
  getCentroCostoByCodigo(conjunto: string, codigo: string): Promise<CentroCosto | null>;
  getCentrosCostoByTipo(conjunto: string, tipo: string, limit?: number, offset?: number): Promise<CentroCosto[]>;
  getCentrosCostoActivos(conjunto: string, limit?: number, offset?: number): Promise<CentroCosto[]>;
  getCentrosCostoByConjuntoCount(conjunto: string): Promise<number>;
  getCentrosCostoByTipoCount(conjunto: string, tipo: string): Promise<number>;
  getCentrosCostoActivosCount(conjunto: string): Promise<number>;
}
