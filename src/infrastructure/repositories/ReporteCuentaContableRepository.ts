import { injectable } from 'inversify';
import { IReporteCuentaContableRepository } from '../../domain/repositories/IReporteCuentaContableRepository';
import { ReporteCuentaContable, FiltroCentroCosto } from '../../domain/entities/ReporteCuentaContable';
import { QueryTypes } from 'sequelize';
import { exactusSequelize } from '../database/config/exactus-database';
import * as XLSX from 'xlsx';

@injectable()
export class ReporteCuentaContableRepository implements IReporteCuentaContableRepository {
  
  async obtenerFiltroCentrosCosto(conjunto: string): Promise<FiltroCentroCosto[]> {
    try {
      const query = `
        SELECT A.centro_costo, A.descripcion 
        FROM ${conjunto}.centro_costo A(NOLOCK)         
        ORDER BY 1 ASC
      `;
      
      const resultados = await exactusSequelize.query(query, { 
        type: QueryTypes.SELECT 
      });
      
      return resultados as FiltroCentroCosto[];
    } catch (error) {
      console.error('Error al obtener filtro de centros de costo:', error);
      throw new Error('Error al obtener filtro de centros de costo');
    }
  }

  async obtenerCentroCostoPorCodigo(conjunto: string, centroCosto: string): Promise<FiltroCentroCosto | null> {
    try {
      const query = `
        SELECT descripcion, acepta_datos, tipo 
        FROM ${conjunto}.centro_costo(NOLOCK)    
        WHERE centro_costo = '${centroCosto}'
      `;
      
      const resultados = await exactusSequelize.query(query, { 
        type: QueryTypes.SELECT 
      });
      
      if (resultados.length === 0) {
        return null;
      }
      
      const resultado = resultados[0] as any;
      return {
        CENTRO_COSTO: centroCosto,
        DESCRIPCION: resultado.descripcion
      };
    } catch (error) {
      console.error('Error al obtener centro de costo por código:', error);
      throw new Error('Error al obtener centro de costo por código');
    }
  }

  async obtenerCuentasContablesPorCentroCosto(
    conjunto: string,
    centroCosto: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<ReporteCuentaContable[]> {
    try {
      console.log(`Consultando cuentas contables para conjunto: ${conjunto}, centro de costo: ${centroCosto}`);
      
      // Primero intentar con la consulta original
      let query = `
        SELECT DISTINCT CTA.cuenta_contable, CTA.descripcion, CTA.tipo
        FROM ${conjunto}.cuenta_contable AS CTA WITH (NOLOCK)
        INNER JOIN ${conjunto}.centro_cuenta AS CTR WITH (NOLOCK)
          ON CTA.cuenta_contable = CTR.cuenta_contable
        WHERE CTR.centro_costo LIKE :centroCostoLike
        ORDER BY CTA.cuenta_contable ASC
        OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY
      `;
      
      // Si no hay datos, intentar consulta alternativa sin JOIN
      let resultados = await exactusSequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: {
          centroCostoLike: `${centroCosto}%`,
          offset,
          limit,
        },
      });
      
      // Si no hay resultados, intentar consulta alternativa
      if (resultados.length === 0) {
        console.log('No se encontraron datos con JOIN, intentando consulta alternativa...');
        query = `
          SELECT DISTINCT cuenta_contable, descripcion, tipo
          FROM ${conjunto}.cuenta_contable WITH (NOLOCK)
          WHERE cuenta_contable LIKE :centroCostoLike
          ORDER BY cuenta_contable ASC
          OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY
        `;
        
        resultados = await exactusSequelize.query(query, {
          type: QueryTypes.SELECT,
          replacements: {
            centroCostoLike: `${centroCosto}%`,
            offset,
            limit,
          },
        });
      }
      
      console.log(`Resultados obtenidos: ${resultados.length} registros`);
      console.log('Primeros 3 registros:', resultados.slice(0, 3));
      
      // Mapear los resultados a la estructura esperada
      const cuentasMapeadas = resultados.map((item: any) => ({
        CUENTA_CONTABLE: item.cuenta_contable,
        DESCRIPCION: item.descripcion,
        TIPO: item.tipo,
        CENTRO_COSTO: centroCosto,
        ACEPTA_DATOS: true
      }));
      
      return cuentasMapeadas;
    } catch (error) {
      console.error('Error al obtener cuentas contables por centro de costo:', error);
      throw new Error('Error al obtener cuentas contables por centro de costo');
    }
  }

  async obtenerCuentasContablesCount(conjunto: string, centroCosto: string): Promise<number> {
    try {
      // Primero intentar con la consulta original
      let query = `
        SELECT COUNT(DISTINCT CTA.cuenta_contable) AS total
        FROM ${conjunto}.cuenta_contable AS CTA WITH (NOLOCK)
        INNER JOIN ${conjunto}.centro_cuenta AS CTR WITH (NOLOCK)
          ON CTA.cuenta_contable = CTR.cuenta_contable
        WHERE CTR.centro_costo LIKE :centroCostoLike
      `;
      
      let resultados = await exactusSequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: { centroCostoLike: `${centroCosto}%` },
      });
      
      let total = (resultados[0] as any).total;
      
      // Si no hay datos, intentar consulta alternativa
      if (total === 0) {
        console.log('No se encontraron datos con JOIN en conteo, intentando consulta alternativa...');
        query = `
          SELECT COUNT(DISTINCT cuenta_contable) AS total
          FROM ${conjunto}.cuenta_contable WITH (NOLOCK)
          WHERE cuenta_contable LIKE :centroCostoLike
        `;
        
        resultados = await exactusSequelize.query(query, {
          type: QueryTypes.SELECT,
          replacements: { centroCostoLike: `${centroCosto}%` },
        });
        
        total = (resultados[0] as any).total;
      }
      
      return total;
    } catch (error) {
      console.error('Error al obtener conteo de cuentas contables:', error);
      throw new Error('Error al obtener conteo de cuentas contables');
    }
  }

  async exportarExcel(conjunto: string, centroCosto: string): Promise<Buffer> {
    try {
      console.log(`Generando Excel de cuentas contables para conjunto ${conjunto}, centro de costo ${centroCosto}`);
      
      // Obtener todos los datos para el Excel (sin límite)
      const cuentas = await this.obtenerCuentasContablesPorCentroCosto(conjunto, centroCosto, 10000, 0);
      
      console.log(`Datos obtenidos para Excel: ${cuentas.length} registros`);
      
      if (cuentas.length === 0) {
        console.log('No se encontraron datos para exportar');
        // Crear un Excel vacío con headers
        const excelData = [{
          'Cuenta Contable': 'No hay datos disponibles',
          'Descripción': '',
          'Tipo': ''
        }];
        
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        worksheet['!cols'] = [{ wch: 25 }, { wch: 50 }, { wch: 15 }];
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Cuentas Contables');
        
        return XLSX.write(workbook, { 
          type: 'buffer', 
          bookType: 'xlsx',
          compression: true
        });
      }
      
      // Preparar los datos para Excel
      const excelData = cuentas.map(item => ({
        'Cuenta Contable': item.CUENTA_CONTABLE || '',
        'Descripción': item.DESCRIPCION || '',
        'Tipo': item.TIPO || ''
      }));

      console.log('Datos preparados para Excel:', excelData.slice(0, 3));

      // Crear el workbook
      const workbook = XLSX.utils.book_new();
      
      // Crear la hoja principal con los datos
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      // Configurar el ancho de las columnas
      const columnWidths = [
        { wch: 25 }, // Cuenta Contable
        { wch: 50 }, // Descripción
        { wch: 15 }  // Tipo
      ];
      
      worksheet['!cols'] = columnWidths;
      
      // Agregar la hoja al workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Cuentas Contables');
      
      // Generar el buffer del archivo Excel
      const excelBuffer = XLSX.write(workbook, { 
        type: 'buffer', 
        bookType: 'xlsx',
        compression: true
      });
      
      console.log(`Archivo Excel de cuentas contables generado exitosamente con ${cuentas.length} registros`);
      return excelBuffer;
      
    } catch (error) {
      console.error('Error al generar Excel de cuentas contables:', error);
      throw new Error(`Error al generar archivo Excel: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}
