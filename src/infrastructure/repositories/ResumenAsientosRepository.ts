import { injectable } from 'inversify';
import { IResumenAsientosRepository } from '../../domain/repositories/IResumenAsientosRepository';
import { ReporteResumenAsientos, FiltrosResumenAsientos } from '../../domain/entities/ReporteResumenAsientos';
import { DatabaseConnection } from '../database/DatabaseConnection';

@injectable()
export class ResumenAsientosRepository implements IResumenAsientosRepository {
  constructor(private dbConnection: DatabaseConnection) {}

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
          FROM ${conjunto}.ASIENTO_MAYORIZADO 
          WHERE FECHA BETWEEN ? AND ?
          
          UNION ALL
          
          SELECT ASIENTO, FECHA, TIPO_ASIENTO, CONTABILIDAD, USUARIO 
          FROM ${conjunto}.ASIENTO_DE_DIARIO 
          WHERE FECHA BETWEEN ? AND ?
        ) M
        INNER JOIN (
          SELECT ASIENTO, CUENTA_CONTABLE, CENTRO_COSTO, NIT, DEBITO_LOCAL, CREDITO_LOCAL, DEBITO_DOLAR, CREDITO_DOLAR 
          FROM ${conjunto}.DIARIO
          
          UNION ALL
          
          SELECT ASIENTO, CUENTA_CONTABLE, CENTRO_COSTO, NIT, DEBITO_LOCAL, CREDITO_LOCAL, DEBITO_DOLAR, CREDITO_DOLAR 
          FROM ${conjunto}.MAYOR
        ) D ON (M.ASIENTO = D.ASIENTO)
        INNER JOIN ${conjunto}.CUENTA_CONTABLE C ON (D.CUENTA_CONTABLE = C.CUENTA_CONTABLE)
        INNER JOIN ${conjunto}.TIPO_ASIENTO T ON (T.TIPO_ASIENTO = M.TIPO_ASIENTO)
        WHERE M.ASIENTO = D.ASIENTO
          AND M.FECHA BETWEEN ? AND ?
          ${contabilidadFilter}
          ${tipoAsientoFilter}
          ${cuentaContableFilter}
          ${centroCostoFilter}
          ${usuarioFilter}
        GROUP BY 
          M.TIPO_ASIENTO, T.DESCRIPCION, D.CENTRO_COSTO, D.CUENTA_CONTABLE, C.DESCRIPCION, M.USUARIO
        ORDER BY M.TIPO_ASIENTO, D.CUENTA_CONTABLE
      `;

      const params = [
        fechaInicio, fechaFin,  // Para ASIENTO_MAYORIZADO
        fechaInicio, fechaFin,  // Para ASIENTO_DE_DIARIO
        fechaInicio, fechaFin   // Para el WHERE principal
      ];

      const result = await this.dbConnection.executeQuery(query, params);
      
      return result.map((row: any) => ({
        cuentaContableDesc: row.cuentaContableDesc,
        sDescTipoAsiento: row.sDescTipoAsiento,
        cuentaContable: row.cuentaContable,
        sNombreQuiebre: row.sNombreQuiebre,
        creditoLocal: parseFloat(row.creditoLocal) || 0,
        creditoDolar: parseFloat(row.creditoDolar) || 0,
        centroCosto: row.centroCosto,
        debitoLocal: parseFloat(row.debitoLocal) || 0,
        debitoDolar: parseFloat(row.debitoDolar) || 0,
        tipoAsiento: row.tipoAsiento,
        tipoReporte: row.tipoReporte,
        nomUsuario: row.nomUsuario,
        finicio: new Date(row.finicio),
        quiebre: row.quiebre,
        ffinal: new Date(row.ffinal),
        rowOrderBy: row.rowOrderBy
      }));

    } catch (error) {
      console.error('Error en ResumenAsientosRepository.obtenerResumenAsientos:', error);
      throw new Error(`Error al obtener resumen de asientos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}
