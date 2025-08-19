import { injectable } from 'inversify';
import { IReporteMovimientosContablesRepository } from '../../domain/repositories/IReporteMovimientosContablesRepository';
import { ReporteMovimientoContableItem, FiltrosReporteMovimientosContables } from '../../domain/entities/ReporteMovimientosContables';
import { exactusSequelize } from '../database/config/exactus-database';
import { QueryTypes } from 'sequelize';
import * as XLSX from 'xlsx';

@injectable()
export class ReporteMovimientosContablesRepository implements IReporteMovimientosContablesRepository {
  async obtener(conjunto: string, filtros: FiltrosReporteMovimientosContables): Promise<ReporteMovimientoContableItem[]> {
    const { 
      usuario, 
      fechaInicio, 
      fechaFin, 
      contabilidad,
      asientos,
      asientosExcluir,
      rangoAsientos,
      tiposAsiento,
      tiposAsientoExcluir,
      clasesAsiento,
      clasesAsientoExcluir,
      nits,
      nitsExcluir,
      centrosCosto,
      centrosCostoExcluir,
      referencias,
      referenciasExcluir,
      documentos,
      documentosExcluir,
      cuentasContables,
      cuentasContablesExcluir,
      criteriosCuentaContable,
      maximoRegistros
    } = filtros;

    const fechaIniStr = new Date(fechaInicio).toISOString().slice(0, 19).replace('T', ' ');
    const fechaFinStr = new Date(fechaFin).toISOString().slice(0, 19).replace('T', ' ');

    const contabs = contabilidad === 'T' ? "('F','A')" : contabilidad === 'F' ? "('F')" : "('A')";

    // Construir condiciones WHERE dinámicamente
    let whereConditions = `A.CONTABILIDAD IN ${contabs} AND A.FECHA BETWEEN '${fechaIniStr}' AND '${fechaFinStr}'`;

    // Filtros de Asientos
    if (asientos && asientos.length > 0) {
      const asientosStr = asientos.join(',');
      whereConditions += ` AND M.ASIENTO IN (${asientosStr})`;
    }
    if (asientosExcluir && asientosExcluir.length > 0) {
      const asientosExcluirStr = asientosExcluir.join(',');
      whereConditions += ` AND M.ASIENTO NOT IN (${asientosExcluirStr})`;
    }
    if (rangoAsientos && rangoAsientos.desde && rangoAsientos.hasta) {
      whereConditions += ` AND M.ASIENTO BETWEEN ${rangoAsientos.desde} AND ${rangoAsientos.hasta}`;
    }

    // Filtros de Tipos de Asiento
    if (tiposAsiento && tiposAsiento.length > 0) {
      const tiposStr = tiposAsiento.map((t: string) => `'${t}'`).join(',');
      whereConditions += ` AND A.ORIGEN IN (${tiposStr})`;
    }
    if (tiposAsientoExcluir && tiposAsientoExcluir.length > 0) {
      const tiposExcluirStr = tiposAsientoExcluir.map((t: string) => `'${t}'`).join(',');
      whereConditions += ` AND A.ORIGEN NOT IN (${tiposExcluirStr})`;
    }

    // Filtros de Clase Asiento (basado en ORIGEN)
    if (clasesAsiento && clasesAsiento.length > 0) {
      const clasesStr = clasesAsiento.map((c: string) => `'${c}'`).join(',');
      whereConditions += ` AND A.ORIGEN IN (${clasesStr})`;
    }
    if (clasesAsientoExcluir && clasesAsientoExcluir.length > 0) {
      const clasesExcluirStr = clasesAsientoExcluir.map((c: string) => `'${c}'`).join(',');
      whereConditions += ` AND A.ORIGEN NOT IN (${clasesExcluirStr})`;
    }

    // Filtros de NITs
    if (nits && nits.length > 0) {
      const nitsStr = nits.map((n: string) => `'${n}'`).join(',');
      whereConditions += ` AND M.NIT IN (${nitsStr})`;
    }
    if (nitsExcluir && nitsExcluir.length > 0) {
      const nitsExcluirStr = nitsExcluir.map((n: string) => `'${n}'`).join(',');
      whereConditions += ` AND M.NIT NOT IN (${nitsExcluirStr})`;
    }

    // Filtros de Centros de Costo
    if (centrosCosto && centrosCosto.length > 0) {
      const centrosStr = centrosCosto.map((c: string) => `'${c}'`).join(',');
      whereConditions += ` AND M.CENTRO_COSTO IN (${centrosStr})`;
    }
    if (centrosCostoExcluir && centrosCostoExcluir.length > 0) {
      const centrosExcluirStr = centrosCostoExcluir.map((c: string) => `'${c}'`).join(',');
      whereConditions += ` AND M.CENTRO_COSTO NOT IN (${centrosExcluirStr})`;
    }

    // Filtros de Referencias
    if (referencias && referencias.length > 0) {
      const refsStr = referencias.map((r: string) => `'${r}'`).join(',');
      whereConditions += ` AND M.REFERENCIA IN (${refsStr})`;
    }
    if (referenciasExcluir && referenciasExcluir.length > 0) {
      const refsExcluirStr = referenciasExcluir.map((r: string) => `'${r}'`).join(',');
      whereConditions += ` AND M.REFERENCIA NOT IN (${refsExcluirStr})`;
    }

    // Filtros de Documentos
    if (documentos && documentos.length > 0) {
      const docsStr = documentos.map((d: string) => `'${d}'`).join(',');
      whereConditions += ` AND M.FUENTE IN (${docsStr})`;
    }
    if (documentosExcluir && documentosExcluir.length > 0) {
      const docsExcluirStr = documentosExcluir.map((d: string) => `'${d}'`).join(',');
      whereConditions += ` AND M.FUENTE NOT IN (${docsExcluirStr})`;
    }

    // Filtros de Cuentas Contables
    if (cuentasContables && cuentasContables.length > 0) {
      const cuentasStr = cuentasContables.map((c: string) => `'${c}'`).join(',');
      whereConditions += ` AND SUBSTRING(M.CUENTA_CONTABLE, 1, 2) IN (${cuentasStr})`;
    }
    if (cuentasContablesExcluir && cuentasContablesExcluir.length > 0) {
      const cuentasExcluirStr = cuentasContablesExcluir.map((c: string) => `'${c}'`).join(',');
      whereConditions += ` AND SUBSTRING(M.CUENTA_CONTABLE, 1, 2) NOT IN (${cuentasExcluirStr})`;
    }

    // Filtros de Criterios de Cuenta Contable
    if (criteriosCuentaContable && criteriosCuentaContable.length > 0) {
      const criteriosActivos = criteriosCuentaContable.filter((c: any) => c.activo);
      if (criteriosActivos.length > 0) {
        const criteriosWhere = criteriosActivos.map((c: any) => {
          const cuenta = c.cuenta;
          switch (c.operador) {
            case 'IGUAL':
              return `SUBSTRING(M.CUENTA_CONTABLE, 1, 2) = '${cuenta}'`;
            case 'INICIA':
              return `SUBSTRING(M.CUENTA_CONTABLE, 1, 2) LIKE '${cuenta}%'`;
            case 'TERMINA':
              return `SUBSTRING(M.CUENTA_CONTABLE, 1, 2) LIKE '%${cuenta}'`;
            case 'CONTENGA':
              return `SUBSTRING(M.CUENTA_CONTABLE, 1, 2) LIKE '%${cuenta}%'`;
            default:
              return `SUBSTRING(M.CUENTA_CONTABLE, 1, 2) = '${cuenta}'`;
          }
        }).join(' OR ');
        whereConditions += ` AND (${criteriosWhere})`;
      }
    }

    // Construir ORDER BY dinámicamente
    let orderBy = 'A.FECHA, M.ASIENTO';
    if (filtros.ordenarPor && filtros.orden) {
      switch (filtros.ordenarPor) {
        case 'FECHA':
          orderBy = `A.FECHA ${filtros.orden}, M.ASIENTO`;
          break;
        case 'CUENTA':
          orderBy = `SUBSTRING(M.CUENTA_CONTABLE, 1, 2) ${filtros.orden}, A.FECHA`;
          break;
        case 'CENTRO_COSTO':
          orderBy = `M.CENTRO_COSTO ${filtros.orden}, A.FECHA`;
          break;
        case 'TIPO_ASIENTO':
          orderBy = `A.ORIGEN ${filtros.orden}, A.FECHA`;
          break;
        case 'CLASE_ASIENTO':
          orderBy = `A.ORIGEN ${filtros.orden}, A.FECHA`;
          break;
        case 'USUARIO':
          orderBy = `:usuario ${filtros.orden}, A.FECHA`;
          break;
        case 'VALOR':
          orderBy = `(M.DEBITO_LOCAL + M.CREDITO_LOCAL) ${filtros.orden}, A.FECHA`;
          break;
        default:
          orderBy = `A.FECHA ${filtros.orden}, M.ASIENTO`;
      }
    }

    // Aplicar límite de registros
    const limitClause = maximoRegistros && maximoRegistros > 0 ? `TOP ${maximoRegistros}` : '';

    const sql = `
      SELECT ${limitClause}
        M.CENTRO_COSTO AS centroCosto,
        M.REFERENCIA AS referencia,
        CASE WHEN A.ORIGEN = 'FA' THEN SUBSTRING(LTRIM(RTRIM(M.FUENTE)), 5, 20)
             WHEN A.ORIGEN IN ('CP','CB','CC','CJ','IC') THEN SUBSTRING(LTRIM(RTRIM(M.FUENTE)), 4, 20)
             ELSE '' END AS documento,
        M.ASIENTO AS asiento,
        N.RAZON_SOCIAL AS razonSocial,
        A.FECHA AS fecha,
        CASE WHEN A.ORIGEN IN ('CP','CB','CC','CJ','IC','FA') THEN SUBSTRING(LTRIM(RTRIM(M.FUENTE)), 1, 3) ELSE '' END AS tipo,
        M.NIT AS nit,
        M.CREDITO_DOLAR AS creditoDolar,
        M.CREDITO_LOCAL AS creditoLocal,
        M.DEBITO_DOLAR AS debitoDolar,
        M.DEBITO_LOCAL AS debitoLocal,
        SUBSTRING(M.CUENTA_CONTABLE, 1, 2) AS cuentaContable,
        CC.DESCRIPCION AS descripcionCuentaContable,
        C.DESCRIPCION AS descripcionCentroCosto,
        :usuario AS usuario
      FROM ${conjunto}.DIARIO AS M WITH (NOLOCK)
      INNER JOIN ${conjunto}.ASIENTO_DE_DIARIO AS A WITH (NOLOCK) ON M.ASIENTO = A.ASIENTO
      INNER JOIN ${conjunto}.NIT AS N WITH (NOLOCK) ON M.NIT = N.NIT
      INNER JOIN ${conjunto}.CUENTA_CONTABLE AS CC WITH (NOLOCK) ON CC.CUENTA_CONTABLE = SUBSTRING(M.CUENTA_CONTABLE, 1, 2) + '.0.0.0.000'
      INNER JOIN ${conjunto}.CENTRO_COSTO AS C WITH (NOLOCK) ON C.CENTRO_COSTO = M.CENTRO_COSTO
      WHERE ${whereConditions}
      ORDER BY ${orderBy}
    `;

    console.log('SQL Query:', sql);
    console.log('Filtros aplicados:', filtros);

    const [rows] = await exactusSequelize.query(sql, { replacements: { usuario } });
    
    let results = (rows as any[]).map(r => ({
      centroCosto: r['centroCosto'] || '',
      referencia: r['referencia'] || '',
      documento: r['documento'] || '',
      asiento: Number(r['asiento'] || 0),
      razonSocial: r['razonSocial'] || '',
      fecha: r['fecha'] ? new Date(r['fecha']).toISOString() : new Date().toISOString(),
      tipo: r['tipo'] || '',
      nit: r['nit'] || '',
      creditoDolar: Number(r['creditoDolar'] || 0),
      creditoLocal: Number(r['creditoLocal'] || 0),
      debitoDolar: Number(r['debitoDolar'] || 0),
      debitoLocal: Number(r['debitoLocal'] || 0),
      cuentaContable: r['cuentaContable'] || '',
      descripcionCuentaContable: r['descripcionCuentaContable'] || '',
      descripcionCentroCosto: r['descripcionCentroCosto'] || '',
      usuario: r['usuario'] || usuario
    }));

    // Aplicar agrupamiento si está configurado
    if (filtros.agruparPor && filtros.agruparPor !== 'NINGUNO') {
      results = this.aplicarAgrupamiento(results, filtros.agruparPor);
    }

    // Aplicar campos personalizados si están configurados
    if (filtros.camposPersonalizados && filtros.camposPersonalizados.length > 0) {
      results = this.aplicarCamposPersonalizados(results, filtros.camposPersonalizados);
    }

    return results;
  }

  private aplicarAgrupamiento(results: ReporteMovimientoContableItem[], agruparPor: string): ReporteMovimientoContableItem[] {
    // Implementar lógica de agrupamiento según el campo seleccionado
    // Por ahora retornamos los resultados sin agrupar
    return results;
  }

  private aplicarCamposPersonalizados(results: ReporteMovimientoContableItem[], camposPersonalizados: any[]): ReporteMovimientoContableItem[] {
    // Implementar lógica para aplicar campos personalizados
    // Por ahora retornamos los resultados sin modificar
    return results;
  }

  async exportarExcel(conjunto: string, filtros: FiltrosReporteMovimientosContables): Promise<Buffer> {
    try {
      console.log(`Generando Excel de movimientos contables para conjunto ${conjunto}`);
      
      // Obtener todos los datos para el Excel (sin límite)
      const datos = await this.obtener(conjunto, filtros);
      
      // Preparar los datos para Excel
      const excelData = datos.map(item => ({
        'Centro Costo': item.centroCosto || '',
        'Referencia': item.referencia || '',
        'Documento': item.documento || '',
        'Asiento': item.asiento || 0,
        'Razón Social': item.razonSocial || '',
        'Fecha': item.fecha ? new Date(item.fecha).toLocaleDateString('es-ES') : '',
        'Tipo': item.tipo || '',
        'NIT': item.nit || '',
        'Crédito Dólar': Number(item.creditoDolar || 0),
        'Crédito Local': Number(item.creditoLocal || 0),
        'Débito Dólar': Number(item.debitoDolar || 0),
        'Débito Local': Number(item.debitoLocal || 0),
        'Cuenta Contable': item.cuentaContable || '',
        'Descripción Cuenta Contable': item.descripcionCuentaContable || '',
        'Descripción Centro Costo': item.descripcionCentroCosto || '',
        'Usuario': item.usuario || ''
      }));

      // Calcular totales
      const totalCreditoDolar = datos.reduce((sum, item) => sum + (item.creditoDolar || 0), 0);
      const totalCreditoLocal = datos.reduce((sum, item) => sum + (item.creditoLocal || 0), 0);
      const totalDebitoDolar = datos.reduce((sum, item) => sum + (item.debitoDolar || 0), 0);
      const totalDebitoLocal = datos.reduce((sum, item) => sum + (item.debitoLocal || 0), 0);

      // Agregar fila de totales
      const totalRow = {
        'Centro Costo': '',
        'Referencia': '',
        'Documento': '',
        'Asiento': '',
        'Razón Social': '',
        'Fecha': '',
        'Tipo': '',
        'NIT': '',
        'Crédito Dólar': totalCreditoDolar,
        'Crédito Local': totalCreditoLocal,
        'Débito Dólar': totalDebitoDolar,
        'Débito Local': totalDebitoLocal,
        'Cuenta Contable': '',
        'Descripción Cuenta Contable': '',
        'Descripción Centro Costo': '',
        'Usuario': 'TOTAL GENERAL'
      };

      // Agregar fila vacía antes del total
      const emptyRow = {
        'Centro Costo': '',
        'Referencia': '',
        'Documento': '',
        'Asiento': '',
        'Razón Social': '',
        'Fecha': '',
        'Tipo': '',
        'NIT': '',
        'Crédito Dólar': '',
        'Crédito Local': '',
        'Débito Dólar': '',
        'Débito Local': '',
        'Cuenta Contable': '',
        'Descripción Cuenta Contable': '',
        'Descripción Centro Costo': '',
        'Usuario': ''
      };

      // Combinar datos con totales
      const finalData = [...excelData, emptyRow, totalRow];

      // Crear el workbook
      const workbook = XLSX.utils.book_new();
      
      // Crear la hoja principal con los datos
      const worksheet = XLSX.utils.json_to_sheet(finalData);
      
      // Configurar el ancho de las columnas
      const columnWidths = [
        { wch: 20 }, // Centro Costo
        { wch: 30 }, // Referencia
        { wch: 15 }, // Documento
        { wch: 15 }, // Asiento
        { wch: 30 }, // Razón Social
        { wch: 12 }, // Fecha
        { wch: 15 }, // Tipo
        { wch: 15 }, // NIT
        { wch: 15 }, // Crédito Dólar
        { wch: 15 }, // Crédito Local
        { wch: 15 }, // Débito Dólar
        { wch: 15 }, // Débito Local
        { wch: 20 }, // Cuenta Contable
        { wch: 40 }, // Descripción Cuenta Contable
        { wch: 30 }, // Descripción Centro Costo
        { wch: 20 }  // Usuario
      ];
      
      worksheet['!cols'] = columnWidths;
      
      // Agregar la hoja al workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Movimientos Contables');
      
      // Generar el buffer del archivo Excel
      const excelBuffer = XLSX.write(workbook, { 
        type: 'buffer', 
        bookType: 'xlsx',
        compression: true
      });
      
      console.log('Archivo Excel de movimientos contables generado exitosamente');
      return excelBuffer;
      
    } catch (error) {
      console.error('Error al generar Excel de movimientos contables:', error);
      throw new Error(`Error al generar archivo Excel: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}