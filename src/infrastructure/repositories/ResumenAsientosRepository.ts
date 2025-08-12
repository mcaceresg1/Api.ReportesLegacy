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
        if (contabilidad === 'F') {
          contabilidadFilter = `AND M.CONTABILIDAD = 'F'`;
        } else if (contabilidad === 'SF') {
          contabilidadFilter = `AND M.CONTABILIDAD != 'F'`;
        } else if (contabilidad === 'C') {
          contabilidadFilter = `AND M.CONTABILIDAD = 'C'`;
        } else if (contabilidad === 'SC') {
          contabilidadFilter = `AND M.CONTABILIDAD != 'C'`;
        }
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

      let origenFilter = '';
      if (filtros.origen && filtros.origen !== 'AMBOS') {
        if (filtros.origen === 'DIARIO') {
          origenFilter = `AND M.ASIENTO IN (SELECT ASIENTO FROM ${conjunto}.ASIENTO_DE_DIARIO WITH (NOLOCK) WHERE FECHA BETWEEN :fechaInicio AND :fechaFin)`;
        } else if (filtros.origen === 'MAYOR') {
          origenFilter = `AND M.ASIENTO IN (SELECT ASIENTO FROM ${conjunto}.ASIENTO_MAYORIZADO WITH (NOLOCK) WHERE FECHA BETWEEN :fechaInicio AND :fechaFin)`;
        }
      }

      let nitFilter = '';
      if (filtros.nitDesde && filtros.nitHasta) {
        nitFilter = `AND D.NIT BETWEEN '${filtros.nitDesde}' AND '${filtros.nitHasta}'`;
      } else if (filtros.nitDesde) {
        nitFilter = `AND D.NIT >= '${filtros.nitDesde}'`;
      } else if (filtros.nitHasta) {
        nitFilter = `AND D.NIT <= '${filtros.nitHasta}'`;
      }

      let cuentaContableRangeFilter = '';
      if (filtros.cuentaContableDesde && filtros.cuentaContableHasta) {
        cuentaContableRangeFilter = `AND D.CUENTA_CONTABLE BETWEEN '${filtros.cuentaContableDesde}' AND '${filtros.cuentaContableHasta}'`;
      } else if (filtros.cuentaContableDesde) {
        cuentaContableRangeFilter = `AND D.CUENTA_CONTABLE >= '${filtros.cuentaContableDesde}'`;
      } else if (filtros.cuentaContableHasta) {
        cuentaContableRangeFilter = `AND D.CUENTA_CONTABLE <= '${filtros.cuentaContableHasta}'`;
      }

      let asientoRangeFilter = '';
      if (filtros.asientoDesde && filtros.asientoHasta) {
        asientoRangeFilter = `AND M.ASIENTO BETWEEN '${filtros.asientoDesde}' AND '${filtros.asientoHasta}'`;
      } else if (filtros.asientoDesde) {
        asientoRangeFilter = `AND M.ASIENTO >= '${filtros.asientoDesde}'`;
      } else if (filtros.asientoHasta) {
        asientoRangeFilter = `AND M.ASIENTO <= '${filtros.asientoHasta}'`;
      }

      let tiposAsientoFilter = '';
      if (filtros.tiposAsientoSeleccionados && filtros.tiposAsientoSeleccionados.length > 0) {
        const tipos = filtros.tiposAsientoSeleccionados.map(t => `'${t}'`).join(',');
        tiposAsientoFilter = `AND M.TIPO_ASIENTO IN (${tipos})`;
      }

      // Query muy simple para debugging - solo fechas básicas
      const queryDebug = `
        SELECT TOP 5
          M.TIPO_ASIENTO,
          M.FECHA,
          CONVERT(DATE, M.FECHA) as fechaConvertida,
          CAST(M.FECHA AS DATE) as fechaCast
        FROM ${conjunto}.ASIENTO_MAYORIZADO M WITH (NOLOCK)
        WHERE M.FECHA >= '2022-01-01'
        ORDER BY M.FECHA DESC
      `;

      console.log('🔍 Debug - Query Debug:');
      console.log(queryDebug);

      try {
        // Primero probamos una consulta muy simple
        const debugResult = await exactusSequelize.query(queryDebug, {
          type: QueryTypes.SELECT
        });
        
        console.log('🔍 Debug - Resultado simple:', debugResult);
      } catch (debugError) {
        console.log('❌ Debug - Error en consulta simple:', debugError);
      }

      // Convertir fechas a formato YYYY-MM-DD para evitar problemas de zona horaria
      const fechaInicioStr = fechaInicio.toISOString().split('T')[0];
      const fechaFinStr = fechaFin.toISOString().split('T')[0];

      console.log('🔍 Debug - Fechas convertidas:');
      console.log('Fecha Inicio (string):', fechaInicioStr);
      console.log('Fecha Fin (string):', fechaFinStr);

      // Debug paso a paso - probar cada JOIN individualmente
      console.log('🔍 Debug - Probando JOINs paso a paso...');

      // 1. Solo ASIENTO_MAYORIZADO
      try {
        const query1 = `
          SELECT TOP 5 M.TIPO_ASIENTO, M.FECHA, M.CONTABILIDAD
          FROM ${conjunto}.ASIENTO_MAYORIZADO M WITH (NOLOCK)
          WHERE CONVERT(DATE, M.FECHA) BETWEEN '${fechaInicioStr}' AND '${fechaFinStr}'
            AND M.CONTABILIDAD = 'F'
        `;
        console.log('🔍 Debug - Query 1 (Solo ASIENTO_MAYORIZADO):');
        console.log(query1);
        
        const result1 = await exactusSequelize.query(query1, { type: QueryTypes.SELECT });
        console.log('✅ Debug - Resultado 1 (Solo ASIENTO_MAYORIZADO):', result1.length, 'registros');
      } catch (error1: any) {
        console.log('❌ Debug - Error en Query 1:', error1.message);
      }

      // 2. ASIENTO_MAYORIZADO + DIARIO
      try {
        const query2 = `
          SELECT TOP 5 M.TIPO_ASIENTO, M.FECHA, D.CUENTA_CONTABLE, D.CENTRO_COSTO
          FROM ${conjunto}.ASIENTO_MAYORIZADO M WITH (NOLOCK)
          INNER JOIN ${conjunto}.DIARIO D WITH (NOLOCK) ON M.ASIENTO = D.ASIENTO
          WHERE CONVERT(DATE, M.FECHA) BETWEEN '${fechaInicioStr}' AND '${fechaFinStr}'
            AND M.CONTABILIDAD = 'F'
        `;
        console.log('🔍 Debug - Query 2 (ASIENTO_MAYORIZADO + DIARIO):');
        console.log(query2);
        
        const result2 = await exactusSequelize.query(query2, { type: QueryTypes.SELECT });
        console.log('✅ Debug - Resultado 2 (ASIENTO_MAYORIZADO + DIARIO):', result2.length, 'registros');
      } catch (error2: any) {
        console.log('❌ Debug - Error en Query 2:', error2.message);
      }

      // 3. ASIENTO_MAYORIZADO + DIARIO + CUENTA_CONTABLE
      try {
        const query3 = `
          SELECT TOP 5 M.TIPO_ASIENTO, M.FECHA, D.CUENTA_CONTABLE, C.DESCRIPCION
          FROM ${conjunto}.ASIENTO_MAYORIZADO M WITH (NOLOCK)
          INNER JOIN ${conjunto}.DIARIO D WITH (NOLOCK) ON M.ASIENTO = D.ASIENTO
          INNER JOIN ${conjunto}.CUENTA_CONTABLE C WITH (NOLOCK) ON D.CUENTA_CONTABLE = C.CUENTA_CONTABLE
          WHERE CONVERT(DATE, M.FECHA) BETWEEN '${fechaInicioStr}' AND '${fechaFinStr}'
            AND M.CONTABILIDAD = 'F'
        `;
        console.log('🔍 Debug - Query 3 (ASIENTO_MAYORIZADO + DIARIO + CUENTA_CONTABLE):');
        console.log(query3);
        
        const result3 = await exactusSequelize.query(query3, { type: QueryTypes.SELECT });
        console.log('✅ Debug - Resultado 3 (ASIENTO_MAYORIZADO + DIARIO + CUENTA_CONTABLE):', result3.length, 'registros');
      } catch (error3: any) {
        console.log('❌ Debug - Error en Query 3:', error3.message);
      }

      // 4. ASIENTO_MAYORIZADO + DIARIO + CUENTA_CONTABLE + TIPO_ASIENTO
      try {
        const query4 = `
          SELECT TOP 5 M.TIPO_ASIENTO, M.FECHA, D.CUENTA_CONTABLE, C.DESCRIPCION, T.DESCRIPCION as tipoDesc
          FROM ${conjunto}.ASIENTO_MAYORIZADO M WITH (NOLOCK)
          INNER JOIN ${conjunto}.DIARIO D WITH (NOLOCK) ON M.ASIENTO = D.ASIENTO
          INNER JOIN ${conjunto}.CUENTA_CONTABLE C WITH (NOLOCK) ON D.CUENTA_CONTABLE = C.CUENTA_CONTABLE
          INNER JOIN ${conjunto}.TIPO_ASIENTO T WITH (NOLOCK) ON T.TIPO_ASIENTO = M.TIPO_ASIENTO
          WHERE CONVERT(DATE, M.FECHA) BETWEEN '${fechaInicioStr}' AND '${fechaFinStr}'
            AND M.CONTABILIDAD = 'F'
        `;
        console.log('🔍 Debug - Query 4 (ASIENTO_MAYORIZADO + DIARIO + CUENTA_CONTABLE + TIPO_ASIENTO):');
        console.log(query4);
        
        const result4 = await exactusSequelize.query(query4, { type: QueryTypes.SELECT });
        console.log('✅ Debug - Resultado 4 (ASIENTO_MAYORIZADO + DIARIO + CUENTA_CONTABLE + TIPO_ASIENTO):', result4.length, 'registros');
      } catch (error4: any) {
        console.log('❌ Debug - Error en Query 4:', error4.message);
      }

      // Ahora probamos la consulta completa
      const querySimple = `
        SELECT TOP 10
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
          CONVERT(DATE, M.FECHA) as finicio,
          M.TIPO_ASIENTO as quiebre,
          CONVERT(DATE, M.FECHA) as ffinal,
          ROW_NUMBER() OVER (ORDER BY M.TIPO_ASIENTO, D.CUENTA_CONTABLE) as rowOrderBy
        FROM ${conjunto}.ASIENTO_MAYORIZADO M WITH (NOLOCK)
        INNER JOIN ${conjunto}.DIARIO D WITH (NOLOCK) ON M.ASIENTO = D.ASIENTO
        INNER JOIN ${conjunto}.CUENTA_CONTABLE C WITH (NOLOCK) ON D.CUENTA_CONTABLE = C.CUENTA_CONTABLE
        INNER JOIN ${conjunto}.TIPO_ASIENTO T WITH (NOLOCK) ON T.TIPO_ASIENTO = M.TIPO_ASIENTO
        WHERE CONVERT(DATE, M.FECHA) BETWEEN '${fechaInicioStr}' AND '${fechaFinStr}'
          ${contabilidadFilter}
          ${tiposAsientoFilter}
        GROUP BY
          M.TIPO_ASIENTO, T.DESCRIPCION, D.CENTRO_COSTO, D.CUENTA_CONTABLE, C.DESCRIPCION, M.USUARIO, M.FECHA
        ORDER BY M.TIPO_ASIENTO, D.CUENTA_CONTABLE
      `;

      console.log('🔍 Debug - Query Simple:');
      console.log(querySimple);

      // No necesitamos replacements para fechas literales
      const result = await exactusSequelize.query(querySimple, {
        type: QueryTypes.SELECT
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
