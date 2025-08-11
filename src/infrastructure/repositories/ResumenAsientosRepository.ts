import { injectable } from 'inversify';
import { IResumenAsientosRepository } from '../../domain/repositories/IResumenAsientosRepository';
import { ReporteResumenAsientos, FiltrosResumenAsientos } from '../../domain/entities/ReporteResumenAsientos';
import { exactusSequelize } from '../database/config/exactus-database';
import { QueryTypes } from 'sequelize';

@injectable()
export class ResumenAsientosRepository implements IResumenAsientosRepository {
  async obtenerResumenAsientos(
    conjunto: string,
    filtros: FiltrosResumenAsientos
  ): Promise<ReporteResumenAsientos[]> {
    try {
      const fechaInicio = filtros.fechaInicio || new Date('2020-01-01');
      const fechaFin = filtros.fechaFin || new Date('2022-12-31');
      const contabilidad = filtros.contabilidad || 'T';

      let contabilidadFilter = '';
      if (contabilidad !== 'T') {
        contabilidadFilter = `AND M.CONTABILIDAD = '${contabilidad}'`;
      }

      let tipoAsientoFilter = '';
      if (filtros.tipoAsiento) {
        tipoAsientoFilter = `AND M.TIPO_ASIENTO = '${filtros.tipoAsiento}'`;
      }

      let cuentaContableFilter = '';
      if (filtros.cuentaContable) {
        cuentaContableFilter = `AND D.CUENTA_CONTABLE = '${filtros.cuentaContable}'`;
      }

      let centroCostoFilter = '';
      if (filtros.centroCosto) {
        centroCostoFilter = `AND D.CENTRO_COSTO = '${filtros.centroCosto}'`;
      }

      let usuarioFilter = '';
      if (filtros.usuario) {
        usuarioFilter = `AND M.USUARIO = '${filtros.usuario}'`;
      }

      const query = `
        SELECT 
          C.DESCRIPCION as cuentaContableDesc,
          T.DESCRIPCION as sDescTipoAsiento,
          D.CUENTA_CONTABLE as cuentaContable,
          M.TIPO_ASIENTO as sNombreQuiebre,
          SUM(COALESCE(D.CREDITO_LOCAL, 0)) as creditoLocal,
          SUM(COALESCE(D.CREDITO_DOLAR, 0)) as creditoDolar,
          D.CENTRO_COSTO as centroCosto,
          SUM(COALESCE(D.DEBITO_LOCAL, 0)) as debitoLocal,
          SUM(COALESCE(D.DEBITO_DOLAR, 0)) as debitoDolar,
          M.TIPO_ASIENTO as tipoAsiento,
          'Resumen de Asientos' as tipoReporte,
          COALESCE(M.USUARIO, 'SISTEMA') as nomUsuario,
          '${fechaInicio.toISOString()}' as finicio,
          M.TIPO_ASIENTO as quiebre,
          '${fechaFin.toISOString()}' as ffinal,
          ROW_NUMBER() OVER (ORDER BY M.TIPO_ASIENTO, D.CUENTA_CONTABLE) as rowOrderBy
        FROM (
          SELECT ASIENTO, FECHA, TIPO_ASIENTO, CONTABILIDAD, USUARIO 
          FROM ${conjunto}.ASIENTO_MAYORIZADO WITH (NOLOCK)
          WHERE FECHA BETWEEN :fechaInicio1 AND :fechaFin1
          
          UNION ALL
          
          SELECT ASIENTO, FECHA, TIPO_ASIENTO, CONTABILIDAD, USUARIO 
          FROM ${conjunto}.ASIENTO_DE_DIARIO WITH (NOLOCK)
          WHERE FECHA BETWEEN :fechaInicio2 AND :fechaFin2
        ) M
        INNER JOIN (
          SELECT ASIENTO, CUENTA_CONTABLE, CENTRO_COSTO, NIT, DEBITO_LOCAL, CREDITO_LOCAL, DEBITO_DOLAR, CREDITO_DOLAR 
          FROM ${conjunto}.DIARIO WITH (NOLOCK)
          
          UNION ALL
          
          SELECT ASIENTO, CUENTA_CONTABLE, CENTRO_COSTO, NIT, DEBITO_LOCAL, CREDITO_LOCAL, DEBITO_DOLAR, CREDITO_DOLAR 
          FROM ${conjunto}.MAYOR WITH (NOLOCK)
        ) D ON (M.ASIENTO = D.ASIENTO)
        INNER JOIN ${conjunto}.CUENTA_CONTABLE C WITH (NOLOCK) ON (D.CUENTA_CONTABLE = C.CUENTA_CONTABLE)
        INNER JOIN ${conjunto}.TIPO_ASIENTO T WITH (NOLOCK) ON (T.TIPO_ASIENTO = M.TIPO_ASIENTO)
        WHERE M.ASIENTO = D.ASIENTO
          AND M.FECHA BETWEEN :fechaInicio3 AND :fechaFin3
          ${contabilidadFilter}
          ${tipoAsientoFilter}
          ${cuentaContableFilter}
          ${centroCostoFilter}
          ${usuarioFilter}
        GROUP BY 
          M.TIPO_ASIENTO, T.DESCRIPCION, D.CENTRO_COSTO, D.CUENTA_CONTABLE, C.DESCRIPCION, M.USUARIO
        ORDER BY M.TIPO_ASIENTO, D.CUENTA_CONTABLE
      `;

      const replacements = {
        fechaInicio1: fechaInicio,
        fechaFin1: fechaFin,
        fechaInicio2: fechaInicio,
        fechaFin2: fechaFin,
        fechaInicio3: fechaInicio,
        fechaFin3: fechaFin
      };

      const result = await exactusSequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements
      });
      
      return result.map((row: any) => ({
        cuentaContableDesc: row.cuentaContableDesc || '',
        sDescTipoAsiento: row.sDescTipoAsiento || '',
        cuentaContable: row.cuentaContable || '',
        sNombreQuiebre: row.sNombreQuiebre || '',
        creditoLocal: parseFloat(row.creditoLocal) || 0,
        creditoDolar: parseFloat(row.creditoDolar) || 0,
        centroCosto: row.centroCosto || '',
        debitoLocal: parseFloat(row.debitoLocal) || 0,
        debitoDolar: parseFloat(row.debitoDolar) || 0,
        tipoAsiento: row.tipoAsiento || '',
        tipoReporte: row.tipoReporte || 'Resumen de Asientos',
        nomUsuario: row.nomUsuario || 'SISTEMA',
        finicio: new Date(row.finicio || fechaInicio),
        quiebre: row.quiebre || '',
        ffinal: new Date(row.ffinal || fechaFin),
        rowOrderBy: row.rowOrderBy || 0
      }));

    } catch (error) {
      console.error('Error en ResumenAsientosRepository.obtenerResumenAsientos:', error);
      throw new Error(`Error al obtener resumen de asientos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}
