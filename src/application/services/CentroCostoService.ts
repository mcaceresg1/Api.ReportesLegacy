import { injectable, inject } from 'inversify';
import { ICentroCostoService } from '../../domain/services/ICentroCostoService';
import { ICentroCostoRepository } from '../../domain/repositories/ICentroCostoRepository';
import { CentroCosto, CentroCostoCreate, CentroCostoUpdate, CentroCostoFilter } from '../../domain/entities/CentroCosto';

@injectable()
export class CentroCostoService implements ICentroCostoService {
  constructor(
    @inject('ICentroCostoRepository') private centroCostoRepository: ICentroCostoRepository
  ) {}

  async getAllCentrosCostos(): Promise<CentroCosto[]> {
    return await this.centroCostoRepository.findAll();
  }

  async getCentroCostoById(id: number): Promise<CentroCosto | null> {
    return await this.centroCostoRepository.findById(id);
  }

  async getCentrosCostosByFilter(filter: CentroCostoFilter): Promise<CentroCosto[]> {
    return await this.centroCostoRepository.findByFilter(filter);
  }

  async createCentroCosto(centroCostoData: CentroCostoCreate): Promise<CentroCosto> {
    // Validaciones de negocio
    if (!centroCostoData.codigo || centroCostoData.codigo.trim() === '') {
      throw new Error('El código es requerido');
    }
    if (!centroCostoData.descripcion || centroCostoData.descripcion.trim() === '') {
      throw new Error('La descripción es requerida');
    }

    // Verificar que el código no exista
    const existingCentroCosto = await this.centroCostoRepository.findByCodigo(centroCostoData.codigo);
    if (existingCentroCosto) {
      throw new Error('Ya existe un centro de costo con este código');
    }

    return await this.centroCostoRepository.create(centroCostoData);
  }

  async updateCentroCosto(centroCostoData: CentroCostoUpdate): Promise<CentroCosto> {
    if (!centroCostoData.id) {
      throw new Error('ID del centro de costo es requerido');
    }

    // Si se está actualizando el código, verificar que no exista otro con el mismo código
    if (centroCostoData.codigo) {
      const existingCentroCosto = await this.centroCostoRepository.findByCodigo(centroCostoData.codigo);
      if (existingCentroCosto && existingCentroCosto.id !== centroCostoData.id) {
        throw new Error('Ya existe otro centro de costo con este código');
      }
    }

    const centroCosto = await this.centroCostoRepository.update(centroCostoData.id, centroCostoData);
    if (!centroCosto) {
      throw new Error('Centro de costo no encontrado');
    }
    return centroCosto;
  }

  async deleteCentroCosto(id: number): Promise<boolean> {
    return await this.centroCostoRepository.delete(id);
  }

  async getCentroCostoByCodigo(codigo: string): Promise<CentroCosto | null> {
    return await this.centroCostoRepository.findByCodigo(codigo);
  }

  async getCentrosCostosActivos(): Promise<CentroCosto[]> {
    return await this.centroCostoRepository.findActivos();
  }
} 