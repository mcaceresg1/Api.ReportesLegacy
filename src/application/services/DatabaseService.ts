import { injectable } from 'inversify';
import { IDatabaseService } from '../../domain/services/IDatabaseService';
import { sequelize } from '../../infrastructure/database/config/database';

@injectable()
export class DatabaseService implements IDatabaseService {
  async obtenerConexion(): Promise<any> {
    try {
      // Verificar si la conexión está activa
      await sequelize.authenticate();
      return sequelize;
    } catch (error) {
      console.error('Error al obtener conexión de base de datos:', error);
      throw new Error('No se pudo establecer conexión con la base de datos');
    }
  }

  async ejecutarQuery(query: string, params: any[] = []): Promise<any[]> {
    try {
      const conexion = await this.obtenerConexion();
      const [results] = await conexion.query(query, {
        replacements: params,
        type: conexion.QueryTypes.SELECT
      });
      return results || [];
    } catch (error) {
      console.error('Error ejecutando query:', error);
      throw error;
    }
  }

  async ejecutarNonQuery(query: string, params: any[] = []): Promise<number> {
    try {
      const conexion = await this.obtenerConexion();
      const [results] = await conexion.query(query, {
        replacements: params,
        type: conexion.QueryTypes.INSERT
      });
      return results?.affectedRows || 0;
    } catch (error) {
      console.error('Error ejecutando non-query:', error);
      throw error;
    }
  }

  async cerrarConexion(): Promise<void> {
    try {
      await sequelize.close();
    } catch (error) {
      console.error('Error cerrando conexión:', error);
    }
  }
}
