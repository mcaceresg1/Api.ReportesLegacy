import { injectable } from 'inversify';
import { IConexionRepository } from '../../domain/repositories/IConexionRepository';
import { Conexion, ConexionCreate, ConexionUpdate } from '../../domain/entities/Conexion';
import ConexionModel from '../database/models/ConexionModel';

@injectable()
export class ConexionRepository implements IConexionRepository {
  async findAll(): Promise<Conexion[]> {
    const conexiones = await ConexionModel.findAll({
      order: [['desEmpresa', 'ASC']]
    });
    return conexiones.map((conexion: any) => conexion.toJSON() as Conexion);
  }

  async findById(id: number): Promise<Conexion | null> {
    const conexion = await ConexionModel.findByPk(id);
    return conexion ? conexion.toJSON() as Conexion : null;
  }

  async create(conexionData: ConexionCreate): Promise<Conexion> {
    const conexion = await ConexionModel.create(conexionData);
    return conexion.toJSON() as Conexion;
  }

  async update(id: number, conexionData: ConexionUpdate): Promise<Conexion | null> {
    const conexion = await ConexionModel.findByPk(id);
    if (!conexion) return null;

    await conexion.update(conexionData);
    return conexion.toJSON() as Conexion;
  }

  async delete(id: number): Promise<boolean> {
    const conexion = await ConexionModel.findByPk(id);
    if (!conexion) return false;

    await conexion.destroy();
    return true;
  }

  async activate(id: number): Promise<boolean> {
    const conexion = await ConexionModel.findByPk(id);
    if (!conexion) return false;

    await conexion.update({ estado: true });
    return true;
  }

  async deactivate(id: number): Promise<boolean> {
    const conexion = await ConexionModel.findByPk(id);
    if (!conexion) return false;

    await conexion.update({ estado: false });
    return true;
  }

  async testConnection(conexionData: ConexionCreate): Promise<boolean> {
    try {
      // TODO: Implementar lógica de prueba de conexión
      // Por ahora retornamos true como placeholder
      return true;
    } catch (error) {
      console.error('Error testing connection:', error);
      return false;
    }
  }
} 