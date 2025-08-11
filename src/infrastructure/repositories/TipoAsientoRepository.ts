import { injectable } from 'inversify';
import { ITipoAsientoRepository } from '../../domain/repositories/ITipoAsientoRepository';
import { TipoAsiento, FiltrosTipoAsiento } from '../../domain/entities/TipoAsiento';
import { exactusSequelize } from '../database/config/exactus-database';
import { QueryTypes } from 'sequelize';

@injectable()
export class TipoAsientoRepository implements ITipoAsientoRepository {
  async obtenerTiposAsiento(
    conjunto: string,
    filtros: FiltrosTipoAsiento
  ): Promise<TipoAsiento[]> {
    try {
      const limit = filtros.limit || 50;
      
      let whereClause = '';
      const replacements: any = { limit };

      if (filtros.tipoAsiento) {
        whereClause += ' AND TIPO_ASIENTO LIKE :tipoAsiento';
        replacements.tipoAsiento = `%${filtros.tipoAsiento}%`;
      }

      if (filtros.descripcion) {
        whereClause += ' AND DESCRIPCION LIKE :descripcion';
        replacements.descripcion = `%${filtros.descripcion}%`;
      }

      const query = `
        SELECT TOP (:limit)
          TIPO_ASIENTO as tipoAsiento,
          DESCRIPCION as descripcion,
          NoteExistsFlag as noteExistsFlag,
          RecordDate as recordDate,
          RowPointer as rowPointer,
          CreatedBy as createdBy,
          UpdatedBy as updatedBy,
          CreateDate as createDate
        FROM ${conjunto}.TIPO_ASIENTO WITH (NOLOCK)
        WHERE 1=1 ${whereClause}
        ORDER BY TIPO_ASIENTO
      `;

      const result = await exactusSequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements
      });

      return result.map((row: any) => ({
        tipoAsiento: row.tipoAsiento || '',
        descripcion: row.descripcion || '',
        noteExistsFlag: parseInt(row.noteExistsFlag) || 0,
        recordDate: new Date(row.recordDate || new Date()),
        rowPointer: row.rowPointer || '',
        createdBy: row.createdBy || '',
        updatedBy: row.updatedBy || '',
        createDate: new Date(row.createDate || new Date())
      }));

    } catch (error) {
      console.error('Error en TipoAsientoRepository.obtenerTiposAsiento:', error);
      throw new Error(`Error al obtener tipos de asiento: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}


