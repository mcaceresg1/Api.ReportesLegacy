import { injectable, inject } from 'inversify';
import { IConexionService } from '../../domain/services/IConexionService';
import { IConexionRepository } from '../../domain/repositories/IConexionRepository';
import { Conexion, ConexionCreate, ConexionUpdate } from '../../domain/entities/Conexion';

@injectable()
export class ConexionService implements IConexionService {
  constructor(
    @inject('IConexionRepository') private conexionRepository: IConexionRepository
  ) {}

  async getAllConexiones(): Promise<Conexion[]> {
    return await this.conexionRepository.findAll();
  }

  async getConexionById(id: number): Promise<Conexion | null> {
    return await this.conexionRepository.findById(id);
  }

  async createConexion(conexionData: ConexionCreate): Promise<Conexion> {
    return await this.conexionRepository.create(conexionData);
  }

  async updateConexion(conexionData: ConexionUpdate): Promise<Conexion> {
    if (!conexionData.id) {
      throw new Error('ID de la conexión es requerido');
    }
    const conexion = await this.conexionRepository.update(conexionData.id, conexionData);
    if (!conexion) {
      throw new Error('Conexión no encontrada');
    }
    return conexion;
  }

  async deleteConexion(id: number): Promise<boolean> {
    return await this.conexionRepository.delete(id);
  }
} 