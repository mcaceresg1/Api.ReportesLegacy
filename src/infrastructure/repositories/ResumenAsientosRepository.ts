import { injectable } from 'inversify';
import { IResumenAsientosRepository } from '../../domain/repositories/IResumenAsientosRepository';
import { ReporteResumenAsientos, FiltrosResumenAsientos } from '../../domain/entities/ReporteResumenAsientos';
import { exactusSequelize } from '../database/config/exactus-database';
import { QueryTypes } from 'sequelize';
import * as XLSX from 'xlsx';

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

      // Ahora probamos la consulta completa basada en el query original
      const queryOriginal = `
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
          'SISTEMA' as nomUsuario,
          CONVERT(DATE, M.FECHA) as finicio,
          M.TIPO_ASIENTO as quiebre,
          CONVERT(DATE, M.FECHA) as ffinal,
          ROW_NUMBER() OVER (ORDER BY M.TIPO_ASIENTO, D.CUENTA_CONTABLE) as rowOrderBy
        FROM (
          SELECT ASIENTO, FECHA, TIPO_ASIENTO, CONTABILIDAD
          FROM ${conjunto}.ASIENTO_MAYORIZADO WITH (NOLOCK)
          WHERE CONVERT(DATE, FECHA) BETWEEN '${fechaInicioStr}' AND '${fechaFinStr}'
            AND CONTABILIDAD = 'F'
          
          UNION ALL
          
          SELECT ASIENTO, FECHA, TIPO_ASIENTO, CONTABILIDAD
          FROM ${conjunto}.ASIENTO_DE_DIARIO WITH (NOLOCK)
          WHERE CONVERT(DATE, FECHA) BETWEEN '${fechaInicioStr}' AND '${fechaFinStr}'
            AND CONTABILIDAD = 'F'
        ) M
        INNER JOIN (
          SELECT ASIENTO, CUENTA_CONTABLE, CENTRO_COSTO, NIT, DEBITO_LOCAL, CREDITO_LOCAL, DEBITO_DOLAR, CREDITO_DOLAR
          FROM ${conjunto}.DIARIO WITH (NOLOCK)
          
          UNION ALL
          
          SELECT ASIENTO, CUENTA_CONTABLE, CENTRO_COSTO, NIT, DEBITO_LOCAL, CREDITO_LOCAL, DEBITO_DOLAR, CREDITO_DOLAR
          FROM ${conjunto}.MAYOR WITH (NOLOCK)
        ) D ON LTRIM(RTRIM(CAST(M.ASIENTO AS NVARCHAR(50)))) = LTRIM(RTRIM(CAST(D.ASIENTO AS NVARCHAR(50))))
        INNER JOIN ${conjunto}.CUENTA_CONTABLE C WITH (NOLOCK) ON D.CUENTA_CONTABLE = C.CUENTA_CONTABLE
        INNER JOIN ${conjunto}.TIPO_ASIENTO T WITH (NOLOCK) ON T.TIPO_ASIENTO = M.TIPO_ASIENTO
        WHERE 1 = 1
          ${tiposAsientoFilter}
        GROUP BY
          M.TIPO_ASIENTO, T.DESCRIPCION, D.CENTRO_COSTO, D.CUENTA_CONTABLE, C.DESCRIPCION, CONVERT(DATE, M.FECHA)
        ORDER BY M.TIPO_ASIENTO, D.CUENTA_CONTABLE
      `;

      console.log('🔍 Debug - Query Original (basada en el query original del usuario):');
      console.log(queryOriginal);

      try {
        // Probar la consulta original
        const result = await exactusSequelize.query(queryOriginal, {
          type: QueryTypes.SELECT
        });
        return result as any;
      } catch (err: any) {
        console.log('❌ SQL Error message:', err?.message);
        console.log('❌ SQL Error parent:', err?.parent);
        console.log('❌ SQL Error original:', err?.original);
        console.log('❌ SQL (raw):', err?.sql || queryOriginal);
        throw new Error('Error al obtener resumen de asientos: ' + (err?.message || ''));
      }

    } catch (error) {
      console.error('Error en ResumenAsientosRepository.obtenerResumenAsientos:', error);
      throw new Error(`Error al obtener resumen de asientos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async exportarExcel(conjunto: string, filtros: FiltrosResumenAsientos): Promise<Buffer> {
    try {
      // Obtener los datos del reporte
      const datos = await this.obtenerResumenAsientos(conjunto, filtros);
      
      // Preparar datos para Excel
      const excelData = datos.map(item => ({
        'Cuenta Contable': item.cuentaContable || '',
        'Descripción Cuenta': item.cuentaContableDesc || '',
        'Tipo Asiento': item.tipoAsiento || '',
        'Descripción Tipo Asiento': item.sDescTipoAsiento || '',
        'Centro Costo': item.centroCosto || '',
        'Débito Local': Number(item.debitoLocal || 0),
        'Débito Dólar': Number(item.debitoDolar || 0),
        'Crédito Local': Number(item.creditoLocal || 0),
        'Crédito Dólar': Number(item.creditoDolar || 0),
        'Fecha Inicio': item.finicio ? new Date(item.finicio).toLocaleDateString('es-ES') : '',
        'Fecha Fin': item.ffinal ? new Date(item.ffinal).toLocaleDateString('es-ES') : '',
        'Usuario': item.nomUsuario || '',
        'Tipo Reporte': item.tipoReporte || ''
      }));

      // Calcular totales
      const totalDebitoLocal = datos.reduce((sum, item) => sum + (item.debitoLocal || 0), 0);
      const totalDebitoDolar = datos.reduce((sum, item) => sum + (item.debitoDolar || 0), 0);
      const totalCreditoLocal = datos.reduce((sum, item) => sum + (item.creditoLocal || 0), 0);
      const totalCreditoDolar = datos.reduce((sum, item) => sum + (item.creditoDolar || 0), 0);

      // Agregar fila de totales
      const totalRow = {
        'Cuenta Contable': '',
        'Descripción Cuenta': '',
        'Tipo Asiento': '',
        'Descripción Tipo Asiento': '',
        'Centro Costo': '',
        'Débito Local': totalDebitoLocal,
        'Débito Dólar': totalDebitoDolar,
        'Crédito Local': totalCreditoLocal,
        'Crédito Dólar': totalCreditoDolar,
        'Fecha Inicio': '',
        'Fecha Fin': '',
        'Usuario': '',
        'Tipo Reporte': 'TOTAL GENERAL'
      };

      // Agregar fila vacía antes del total
      const emptyRow = {
        'Cuenta Contable': '',
        'Descripción Cuenta': '',
        'Tipo Asiento': '',
        'Descripción Tipo Asiento': '',
        'Centro Costo': '',
        'Débito Local': '',
        'Débito Dólar': '',
        'Crédito Local': '',
        'Crédito Dólar': '',
        'Fecha Inicio': '',
        'Fecha Fin': '',
        'Usuario': '',
        'Tipo Reporte': ''
      };

      // Combinar datos con totales
      const finalData = [...excelData, emptyRow, totalRow];

      // Crear el workbook
      const workbook = XLSX.utils.book_new();
      
      // Crear la hoja principal con los datos
      const worksheet = XLSX.utils.json_to_sheet(finalData);
      
      // Configurar el ancho de las columnas
      const columnWidths = [
        { wch: 20 }, // Cuenta Contable
        { wch: 40 }, // Descripción Cuenta
        { wch: 20 }, // Tipo Asiento
        { wch: 30 }, // Descripción Tipo Asiento
        { wch: 20 }, // Centro Costo
        { wch: 15 }, // Débito Local
        { wch: 15 }, // Débito Dólar
        { wch: 15 }, // Crédito Local
        { wch: 15 }, // Crédito Dólar
        { wch: 15 }, // Fecha Inicio
        { wch: 15 }, // Fecha Fin
        { wch: 20 }, // Usuario
        { wch: 25 }  // Tipo Reporte
      ];
      
      worksheet['!cols'] = columnWidths;
      
      // Agregar la hoja al workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Resumen de Asientos');
      
      // Generar el buffer del archivo Excel
      const excelBuffer = XLSX.write(workbook, { 
        type: 'buffer', 
        bookType: 'xlsx',
        compression: true
      });
      
      console.log('Archivo Excel de resumen de asientos generado exitosamente');
      return excelBuffer;
      
    } catch (error) {
      console.error('Error al generar Excel de resumen de asientos:', error);
      throw new Error(`Error al generar archivo Excel: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}
