import { injectable, inject } from 'inversify';
import { ICompaniaService } from '../../domain/services/ICompaniaService';
import { ICompaniaRepository } from '../../domain/repositories/ICompaniaRepository';
import { Compania, CompaniaCreate, CompaniaUpdate, CompaniaFilter } from '../../domain/entities/Compania';

@injectable()
export class CompaniaService implements ICompaniaService {
  constructor(
    @inject('ICompaniaRepository') private companiaRepository: ICompaniaRepository
  ) {}

  async getAllCompanias(): Promise<Compania[]> {
    return await this.companiaRepository.findAll();
  }

  async getCompaniaById(id: number): Promise<Compania | null> {
    return await this.companiaRepository.findById(id);
  }

  async getCompaniaByCodigo(codigo: string): Promise<Compania | null> {
    return await this.companiaRepository.findByCodigo(codigo);
  }

  async getCompaniasByFilter(filter: CompaniaFilter): Promise<Compania[]> {
    return await this.companiaRepository.findByFilter(filter);
  }

  async createCompania(companiaData: CompaniaCreate): Promise<Compania> {
    // Validaciones de negocio
    if (!companiaData.codigo || companiaData.codigo.trim() === '') {
      throw new Error('El código es requerido');
    }
    
    if (!companiaData.nombre || companiaData.nombre.trim() === '') {
      throw new Error('El nombre es requerido');
    }

    // Verificar si ya existe una compañía con el mismo código
    const existingCompania = await this.companiaRepository.findByCodigo(companiaData.codigo);
    if (existingCompania) {
      throw new Error('Ya existe una compañía con este código');
    }

    return await this.companiaRepository.create(companiaData);
  }

  async updateCompania(companiaData: CompaniaUpdate): Promise<Compania> {
    if (!companiaData.id) {
      throw new Error('ID de la compañía es requerido');
    }
    
    const compania = await this.companiaRepository.update(companiaData.id, companiaData);
    if (!compania) {
      throw new Error('Compañía no encontrada');
    }
    return compania;
  }

  async deleteCompania(id: number): Promise<boolean> {
    return await this.companiaRepository.delete(id);
  }

  async getCompaniasActivas(): Promise<Compania[]> {
    return await this.companiaRepository.findActivas();
  }
} 