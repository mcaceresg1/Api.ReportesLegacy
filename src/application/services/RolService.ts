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

  async getRolById(id: number): Promise<Rol | null> {
    return await this.rolRepository.findById(id);
  }

  async createRol(rolData: RolCreate): Promise<Rol> {
    return await this.rolRepository.create(rolData);
  }

  async updateRol(id: number, rolData: RolUpdate): Promise<Rol> {
    const rol = await this.rolRepository.update(id, rolData);
    if (!rol) {
      throw new Error('Rol no encontrado');
    }
    return rol;
  }

  async deleteRol(id: number): Promise<boolean> {
    return await this.rolRepository.delete(id);
  }

  async changeRolEstado(id: number, estado: boolean): Promise<Rol> {
    const rol = await this.rolRepository.changeEstado(id, estado);
    if (!rol) {
      throw new Error('Rol no encontrado');
    }
    return rol;
  }
} 