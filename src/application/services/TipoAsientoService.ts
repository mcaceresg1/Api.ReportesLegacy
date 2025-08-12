import { injectable, inject } from 'inversify';
import { ITipoAsientoService } from '../../domain/services/ITipoAsientoService';
import { ITipoAsientoRepository } from '../../domain/repositories/ITipoAsientoRepository';
import { TipoAsiento, FiltrosTipoAsiento } from '../../domain/entities/TipoAsiento';

@injectable()
export class TipoAsientoService implements ITipoAsientoService {
  constructor(
    @inject('ITipoAsientoRepository')
    private tipoAsientoRepository: ITipoAsientoRepository
  ) {}

  async obtenerTiposAsiento(
    conjunto: string,
    filtros: FiltrosTipoAsiento
  ): Promise<TipoAsiento[]> {
    try {
      console.log(`🔍 Obteniendo tipos de asiento para conjunto: ${conjunto}`);
      console.log('📋 Filtros aplicados:', filtros);

      // Validar conjunto
      if (!conjunto || conjunto.trim() === '') {
        throw new Error('El conjunto es requerido');
      }

      // Validar límite
      if (filtros.limit && (filtros.limit < 1 || filtros.limit > 1000)) {
        throw new Error('El límite debe estar entre 1 y 1000');
      }

      // Obtener tipos de asiento
      const resultado = await this.tipoAsientoRepository.obtenerTiposAsiento(conjunto, filtros);

      console.log(`✅ Tipos de asiento obtenidos exitosamente con ${resultado.length} registros`);

      return resultado;

    } catch (error) {
      console.error('❌ Error en TipoAsientoService.obtenerTiposAsiento:', error);
      throw new Error(`Error al obtener tipos de asiento: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}

