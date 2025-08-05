import { injectable, inject } from 'inversify';
import { IMovimientoContableService } from '../../domain/services/IMovimientoContableService';
import { IMovimientoContableRepository } from '../../domain/repositories/IMovimientoContableRepository';
import { MovimientoContable, MovimientoContableCreate, MovimientoContableUpdate, MovimientoContableFilter } from '../../domain/entities/MovimientoContable';

@injectable()
export class MovimientoContableService implements IMovimientoContableService {
  constructor(
    @inject('IMovimientoContableRepository') private movimientoContableRepository: IMovimientoContableRepository
  ) {}

  async getAllMovimientosContables(): Promise<MovimientoContable[]> {
    return await this.movimientoContableRepository.findAll();
  }

  async getMovimientoContableById(id: number): Promise<MovimientoContable | null> {
    return await this.movimientoContableRepository.findById(id);
  }

  async getMovimientosContablesByFilter(filter: MovimientoContableFilter): Promise<MovimientoContable[]> {
    return await this.movimientoContableRepository.findByFilter(filter);
  }

  async createMovimientoContable(movimientoContableData: MovimientoContableCreate): Promise<MovimientoContable> {
    // Validaciones de negocio
    if (!movimientoContableData.cuenta || movimientoContableData.cuenta.trim() === '') {
      throw new Error('La cuenta es requerida');
    }
    
    if (!movimientoContableData.descripcion || movimientoContableData.descripcion.trim() === '') {
      throw new Error('La descripción es requerida');
    }
    
    if (!movimientoContableData.tipo || movimientoContableData.tipo.trim() === '') {
      throw new Error('El tipo es requerido');
    }

    return await this.movimientoContableRepository.create(movimientoContableData);
  }

  async updateMovimientoContable(movimientoContableData: MovimientoContableUpdate): Promise<MovimientoContable> {
    if (!movimientoContableData.id) {
      throw new Error('ID del movimiento contable es requerido');
    }
    
    const movimientoContable = await this.movimientoContableRepository.update(movimientoContableData.id, movimientoContableData);
    if (!movimientoContable) {
      throw new Error('Movimiento contable no encontrado');
    }
    return movimientoContable;
  }

  async deleteMovimientoContable(id: number): Promise<boolean> {
    return await this.movimientoContableRepository.delete(id);
  }

  async getMovimientosContablesByTipo(tipo: string): Promise<MovimientoContable[]> {
    return await this.movimientoContableRepository.getByTipo(tipo);
  }

  async getMovimientosContablesByCentroCosto(centroCostoId: number): Promise<MovimientoContable[]> {
    return await this.movimientoContableRepository.getByCentroCosto(centroCostoId);
  }

  async updateMovimientosCompania(companiaId: number): Promise<void> {
    return await this.movimientoContableRepository.updateMovimientosWithoutCompania(companiaId);
  }
} 