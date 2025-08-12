import { TipoAsiento, FiltrosTipoAsiento } from '../entities/TipoAsiento';

export interface ITipoAsientoService {
  obtenerTiposAsiento(
    conjunto: string,
    filtros: FiltrosTipoAsiento
  ): Promise<TipoAsiento[]>;
}

