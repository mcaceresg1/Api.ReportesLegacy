import { injectable } from 'inversify';
import { IRolRepository } from '../../domain/repositories/IRolRepository';
import { Rol, RolCreate, RolUpdate } from '../../domain/entities/Rol';
import RolModel from '../database/models/RolModel';

@injectable()
export class RolRepository implements IRolRepository {
  async findAll(): Promise<Rol[]> {
    const roles = await RolModel.findAll({
      order: [['descripcion', 'ASC']]
    });
    return roles.map((rol: any) => rol.toJSON() as Rol);
  }

  async findById(id: number): Promise<Rol | null> {
    const rol = await RolModel.findByPk(id);
    return rol ? rol.toJSON() as Rol : null;
  }

  async create(rolData: RolCreate): Promise<Rol> {
    const rol = await RolModel.create({
      descripcion: rolData.descripcion,
      descripcion_completa: rolData.descripcion_completa || rolData.descripcion,
      estado: rolData.estado !== undefined ? rolData.estado : true
    });
    return rol.toJSON() as Rol;
  }

  async update(id: number, rolData: RolUpdate): Promise<Rol | null> {
    const rol = await RolModel.findByPk(id);
    if (!rol) return null;

    await rol.update(rolData);
    return rol.toJSON() as Rol;
  }

  async delete(id: number): Promise<boolean> {
    const rol = await RolModel.findByPk(id);
    if (!rol) return false;

    await rol.update({ estado: false });
    return true;
  }

  async activate(id: number): Promise<boolean> {
    const rol = await RolModel.findByPk(id);
    if (!rol) return false;

    await rol.update({ estado: true });
    return true;
  }

  async deactivate(id: number): Promise<boolean> {
    const rol = await RolModel.findByPk(id);
    if (!rol) return false;

    await rol.update({ estado: false });
    return true;
  }

  async changeEstado(id: number, estado: boolean): Promise<Rol | null> {
    const rol = await RolModel.findByPk(id);
    if (!rol) return null;

    await rol.update({ estado });
    return rol.toJSON() as Rol;
  }
} 