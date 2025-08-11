import { injectable } from 'inversify';
import { ITipoAsientoRepository } from '../../domain/repositories/ITipoAsientoRepository';
import { TipoAsiento } from '../../domain/entities/TipoAsiento';
import { exactusSequelize } from '../database/config/exactus-database';
import { QueryTypes } from 'sequelize';

@injectable()
export class TipoAsientoRepository implements ITipoAsientoRepository {
  async listar(conjunto: string, limit: number = 1000, offset: number = 0): Promise<TipoAsiento[]> {
    try {
      // Usar paginación estándar de SQL Server (OFFSET/FETCH) con parámetros
      const sql = `
        SELECT 
          TIPO_ASIENTO,
          DESCRIPCION
        FROM ${conjunto}.TIPO_ASIENTO WITH (NOLOCK)
        ORDER BY TIPO_ASIENTO ASC
        OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY
      `;

      const rows = await exactusSequelize.query(sql, {
        type: QueryTypes.SELECT,
        replacements: { limit, offset },
      });
      return rows as TipoAsiento[];
    } catch (error) {
      console.error('Error listando tipos de asiento:', error);
      throw error;
    }
  }
}


