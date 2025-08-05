import { injectable } from 'inversify';
import { ICompaniaRepository } from '../../domain/repositories/ICompaniaRepository';
import { Compania, CompaniaCreate, CompaniaUpdate, CompaniaFilter } from '../../domain/entities/Compania';
import CompaniaModel from '../database/models/CompaniaModel';

@injectable()
export class CompaniaRepository implements ICompaniaRepository {
  async findAll(): Promise<Compania[]> {
    try {
      const companias = await CompaniaModel.findAll({
        order: [['nombre', 'ASC']]
      });
      return companias.map(compania => compania.toJSON() as Compania);
    } catch (error) {
      console.error('Error al obtener todas las compañías:', error);
      throw new Error('Error al obtener las compañías');
    }
  }

  async findById(id: number): Promise<Compania | null> {
    try {
      const compania = await CompaniaModel.findByPk(id);
      return compania ? compania.toJSON() as Compania : null;
    } catch (error) {
      console.error(`Error al obtener compañía con ID ${id}:`, error);
      throw new Error('Error al obtener la compañía');
    }
  }

  async findByCodigo(codigo: string): Promise<Compania | null> {
    try {
      const compania = await CompaniaModel.findOne({
        where: { codigo }
      });
      return compania ? compania.toJSON() as Compania : null;
    } catch (error) {
      console.error(`Error al obtener compañía con código ${codigo}:`, error);
      throw new Error('Error al obtener la compañía por código');
    }
  }

  async findByFilter(filter: CompaniaFilter): Promise<Compania[]> {
    try {
      const whereClause: any = {};
      
      if (filter.codigo) {
        whereClause.codigo = filter.codigo;
      }
      
      if (filter.nombre) {
        whereClause.nombre = { [require('sequelize').Op.iLike]: `%${filter.nombre}%` };
      }
      
      if (filter.estado !== undefined) {
        whereClause.estado = filter.estado;
      }

      const companias = await CompaniaModel.findAll({
        where: whereClause,
        order: [['nombre', 'ASC']]
      });
      
      return companias.map(compania => compania.toJSON() as Compania);
    } catch (error) {
      console.error('Error al filtrar compañías:', error);
      throw new Error('Error al filtrar las compañías');
    }
  }

  async create(companiaData: CompaniaCreate): Promise<Compania> {
    try {
      const compania = await CompaniaModel.create(companiaData);
      return compania.toJSON() as Compania;
    } catch (error) {
      console.error('Error al crear compañía:', error);
      throw new Error('Error al crear la compañía');
    }
  }

  async update(id: number, companiaData: CompaniaUpdate): Promise<Compania | null> {
    try {
      const compania = await CompaniaModel.findByPk(id);
      if (!compania) {
        return null;
      }
      
      await compania.update(companiaData);
      return compania.toJSON() as Compania;
    } catch (error) {
      console.error(`Error al actualizar compañía con ID ${id}:`, error);
      throw new Error('Error al actualizar la compañía');
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const compania = await CompaniaModel.findByPk(id);
      if (!compania) {
        return false;
      }
      
      await compania.destroy();
      return true;
    } catch (error) {
      console.error(`Error al eliminar compañía con ID ${id}:`, error);
      throw new Error('Error al eliminar la compañía');
    }
  }

  async findActivas(): Promise<Compania[]> {
    try {
      const companias = await CompaniaModel.findAll({
        where: { estado: true },
        order: [['nombre', 'ASC']]
      });
      return companias.map(compania => compania.toJSON() as Compania);
    } catch (error) {
      console.error('Error al obtener compañías activas:', error);
      throw new Error('Error al obtener las compañías activas');
    }
  }
} 