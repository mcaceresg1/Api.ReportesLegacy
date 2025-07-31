import { injectable } from 'inversify';
import { ISistemaRepository } from '../../domain/repositories/ISistemaRepository';
import { Sistema, SistemaCreate, SistemaUpdate } from '../../domain/entities/Sistema';
import SistemaModel from '../database/models/SistemaModel';
import RolSistemaMenuModel from '../database/models/RolSistemaMenuModel';
import RolModel from '../database/models/RolModel';

@injectable()
export class SistemaRepository implements ISistemaRepository {
  async findAll(): Promise<Sistema[]> {
    const sistemas = await SistemaModel.findAll({
      order: [['descripcion', 'ASC']]
    });
    return sistemas.map((sistema: any) => sistema.toJSON() as Sistema);
  }

  async findById(id: number): Promise<Sistema | null> {
    const sistema = await SistemaModel.findByPk(id);
    return sistema ? sistema.toJSON() as Sistema : null;
  }

  async create(sistemaData: SistemaCreate): Promise<Sistema> {
    const sistema = await SistemaModel.create({
      ...sistemaData,
      estado: sistemaData.estado !== undefined ? sistemaData.estado : true
    });
    return sistema.toJSON() as Sistema;
  }

  async update(id: number, sistemaData: SistemaUpdate): Promise<Sistema | null> {
    const sistema = await SistemaModel.findByPk(id);
    if (!sistema) return null;

    await sistema.update(sistemaData);
    return sistema.toJSON() as Sistema;
  }

  async delete(id: number): Promise<boolean> {
    const sistema = await SistemaModel.findByPk(id);
    if (!sistema) return false;

    await sistema.destroy();
    return true;
  }

  async getRolesBySistema(sistemaId: number): Promise<any[]> {
    try {
      console.log(`🔍 Obteniendo roles para sistema ${sistemaId}`);
      
      // Obtener roles que tienen permisos en este sistema
      const rolesConPermisos = await RolSistemaMenuModel.findAll({
        where: { 
          sistemaId,
          estado: true 
        },
        include: [
          {
            model: RolModel,
            as: 'rol',
            where: { estado: true }
          }
        ],
        attributes: ['rolId'],
        group: ['rolId']
      });

      // Extraer los roles únicos
      const roles = rolesConPermisos.map((rsm: any) => rsm.rol?.toJSON()).filter(Boolean);
      
      console.log(`✅ Roles obtenidos para sistema ${sistemaId}: ${roles.length}`);
      return roles;
    } catch (error) {
      console.error(`❌ Error al obtener roles para sistema ${sistemaId}:`, error);
      throw new Error(`Error al obtener roles del sistema: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
} 