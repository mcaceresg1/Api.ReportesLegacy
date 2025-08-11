import { TipoAsiento } from '../entities/TipoAsiento';

export interface ITipoAsientoRepository {
  listar(conjunto: string, limit?: number, offset?: number): Promise<TipoAsiento[]>;
}


