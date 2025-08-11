import { injectable } from 'inversify';
import { IReporteCuentaContableModificadaRepository } from '../../domain/repositories/IReporteCuentaContableModificadaRepository';
import { ReporteCuentaContableModificada } from '../../domain/entities/ReporteCuentaContableModificada';
import { exactusSequelize } from '../database/config/exactus-database';
import { QueryTypes } from 'sequelize';

@injectable()
export class ReporteCuentaContableModificadaRepository implements IReporteCuentaContableModificadaRepository {
  async obtenerCuentasContablesModificadas(
    conjunto: string,
    fechaInicio?: Date,
    fechaFin?: Date
  ): Promise<ReporteCuentaContableModificada[]> {
    try {
      let whereClause = '1 = 1';
      const replacements: any = {};

      if (fechaInicio && fechaFin) {
        whereClause += ' AND (cc.fecha_hora BETWEEN :fechaInicio AND :fechaFin OR cc.fch_hora_ult_mod BETWEEN :fechaInicio AND :fechaFin)';
        replacements.fechaInicio = fechaInicio;
        replacements.fechaFin = fechaFin;
      }

      const query = `
        SELECT 
          cc.cuenta_contable as "CuentaContable",
          cc.descripcion as "CuentaContableDesc",
          cc.usuario as "UsuarioCreacion",
          uc.nombre as "UsuarioCreacionDesc",
          cc.fecha_hora as "FechaCreacion",
          cc.usuario_ult_mod as "UsuarioModificacion",
          um.nombre as "UsuarioModificacionDesc",
          cc.fch_hora_ult_mod as "FechaModificacion"
        FROM ${conjunto}.cuenta_contable cc WITH (NOLOCK)
        LEFT OUTER JOIN ERPADMIN.usuario uc WITH (NOLOCK)
          ON cc.usuario = uc.usuario
        LEFT OUTER JOIN ERPADMIN.usuario um WITH (NOLOCK)
          ON cc.usuario_ult_mod = um.usuario
        WHERE ${whereClause}
        ORDER BY cc.cuenta_contable ASC
      `;

      const resultados = await exactusSequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements
      });

      return resultados as ReporteCuentaContableModificada[];
    } catch (error) {
      console.error('Error al obtener cuentas contables modificadas:', error);
      throw new Error('Error al obtener cuentas contables modificadas');
    }
  }
}
