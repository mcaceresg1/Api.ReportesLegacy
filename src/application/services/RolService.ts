import { injectable, inject } from 'inversify';
import { IRolService } from '../../domain/services/IRolService';
import { IRolRepository } from '../../domain/repositories/IRolRepository';
import { Rol, RolCreate, RolUpdate } from '../../domain/entities/Rol';

@injectable()
export class RolService implements IRolService {
  constructor(
    @inject('IRolRepository') private rolRepository: IRolRepository
  ) {}

  async getAllRoles(): Promise<Rol[]> {
    return await this.rolRepository.findAll();
  }

  async createRol(rolData: RolCreate): Promise<Rol> {
    return await this.rolRepository.create(rolData);
  }

  async updateRol(rolData: RolUpdate): Promise<Rol> {
    if (!rolData.id) {
      throw new Error('ID del rol es requerido');
    }
    const rol = await this.rolRepository.update(rolData.id, rolData);
    if (!rol) {
      throw new Error('Rol no encontrado');
    }
    return rol;
  }

  async changeRolEstado(id: number, estado: boolean): Promise<Rol> {
    const rol = await this.rolRepository.changeEstado(id, estado);
    if (!rol) {
      throw new Error('Rol no encontrado');
    }
    return rol;
  }
} 