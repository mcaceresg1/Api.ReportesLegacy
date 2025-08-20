import { injectable } from 'inversify';
import { QueryTypes } from 'sequelize';
import * as XLSX from 'xlsx';
import { exactusSequelize } from '../database/config/exactus-database';
import { IPlanContableRepository } from '../../domain/repositories/IPlanContableRepository';
import { PlanContableItem, PlanContableFiltros, PlanContableResponse, GlobalConfig, PlanContableCreate } from '../../domain/entities/PlanContable';

@injectable()
export class PlanContableRepository implements IPlanContableRepository {

  /**
   * Genera el reporte del Plan Contable
   * Crea la tabla temporal y ejecuta el procedimiento almacenado
   */
  async generarReportePlanContable(conjunto: string, usuario: string): Promise<void> {
    try {
      console.log(`Generando reporte Plan Contable para conjunto: ${conjunto}, usuario: ${usuario}`);

      // 1. Verificar si la tabla temporal ya existe
      const tablaExiste = await this.existeTablaReporte(conjunto);
      
      if (!tablaExiste) {
        // 2. Crear la tabla temporal
        await this.crearTablaReporte(conjunto);
        
        // 3. Insertar datos iniciales (ejemplo básico)
        await this.insertarDatosIniciales(conjunto);
      }

      console.log('Reporte Plan Contable generado exitosamente');
    } catch (error) {
      console.error('Error al generar reporte Plan Contable:', error);
      throw new Error(`Error al generar reporte Plan Contable: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Obtiene las cuentas contables con filtros y paginación
   */
  async obtenerPlanContable(filtros: PlanContableFiltros): Promise<PlanContableResponse> {
    try {
      const { conjunto, cuentaContable, descripcion, estado, page = 1, limit = 100 } = filtros;
      
      console.log(`Obteniendo Plan Contable para conjunto: ${conjunto}`);
      console.log(`Filtros: cuentaContable=${cuentaContable}, descripcion=${descripcion}, estado=${estado}`);
      console.log(`Paginación: página ${page}, ${limit} registros por página`);

      // Verificar que la tabla temporal existe
      const tablaExiste = await this.existeTablaReporte(conjunto);
      if (!tablaExiste) {
        return {
          data: [],
          total: 0,
          pagina: page,
          porPagina: limit,
          totalPaginas: 0
        };
      }

      // Construir la consulta base
      let whereClause = '1=1';
      const replacements: any = { conjunto };

      if (cuentaContable) {
        whereClause += ' AND CuentaContable LIKE :cuentaContable';
        replacements.cuentaContable = `%${cuentaContable}%`;
      }

      if (descripcion) {
        whereClause += ' AND CuentaContableDesc LIKE :descripcion';
        replacements.descripcion = `%${descripcion}%`;
      }

      if (estado) {
        whereClause += ' AND Estado = :estado';
        replacements.estado = estado;
      }

      // Obtener total de registros
      const totalQuery = `
        SELECT COUNT(*) as total
        FROM ${conjunto}.R_XML_8DDC55004B87DB3
        WHERE ${whereClause}
      `;

      const totalResult = await exactusSequelize.query(totalQuery, {
        type: QueryTypes.SELECT,
        replacements
      }) as any[];

      const total = totalResult[0]?.total || 0;
      const totalPaginas = Math.ceil(total / limit);
      const offset = (page - 1) * limit;

      // Obtener datos paginados
      const dataQuery = `
        SELECT 
          CuentaContable,
          CuentaContableDesc,
          Estado,
          CuentaContableCons,
          CuentaContableConsDesc
        FROM ${conjunto}.R_XML_8DDC55004B87DB3
        WHERE ${whereClause}
        ORDER BY ROW_ORDER_BY
        OFFSET :offset ROWS
        FETCH NEXT :limit ROWS ONLY
      `;

      replacements.offset = offset;
      replacements.limit = limit;

      const data = await exactusSequelize.query(dataQuery, {
        type: QueryTypes.SELECT,
        replacements
      }) as PlanContableItem[];

      return {
        data,
        total,
        pagina: page,
        porPagina: limit,
        totalPaginas
      };

    } catch (error) {
      console.error('Error al obtener Plan Contable:', error);
      throw new Error(`Error al obtener Plan Contable: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Obtiene la configuración global del Plan Contable
   */
  async obtenerConfiguracionGlobal(conjunto: string): Promise<GlobalConfig | null> {
    try {
      const query = `
        SELECT modulo, nombre, tipo, valor 
        FROM ${conjunto}.globales                                              
        WHERE modulo = 'CG' AND nombre = 'PLE-PlanContable'
      `;

      const resultado = await exactusSequelize.query(query, {
        type: QueryTypes.SELECT
      }) as GlobalConfig[];

      return resultado.length > 0 ? resultado[0]! : null;
    } catch (error) {
      console.error('Error al obtener configuración global:', error);
      throw new Error(`Error al obtener configuración global: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Obtiene todas las cuentas contables básicas
   */
  async obtenerCuentasContables(conjunto: string): Promise<{ cuenta_contable: string; descripcion: string }[]> {
    try {
      const query = `
        SELECT cuenta_contable, descripcion                                                                                       
        FROM ${conjunto}.cuenta_contable  
        ORDER BY 1
      `;

      const resultado = await exactusSequelize.query(query, {
        type: QueryTypes.SELECT
      }) as { cuenta_contable: string; descripcion: string }[];

      return resultado;
    } catch (error) {
      console.error('Error al obtener cuentas contables:', error);
      throw new Error(`Error al obtener cuentas contables: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Crea una nueva cuenta contable en la tabla temporal
   */
  async crearCuentaContable(conjunto: string, cuenta: PlanContableCreate): Promise<PlanContableItem> {
    try {
      const query = `
        INSERT INTO ${conjunto}.R_XML_8DDC55004B87DB3 
        (CuentaContable, CuentaContableDesc, Estado, CuentaContableCons, CuentaContableConsDesc)  
        VALUES (:CuentaContable, :CuentaContableDesc, :Estado, :CuentaContableCons, :CuentaContableConsDesc)
      `;

      await exactusSequelize.query(query, {
        type: QueryTypes.INSERT,
        replacements: {
          CuentaContable: cuenta.CuentaContable,
          CuentaContableDesc: cuenta.CuentaContableDesc,
          Estado: cuenta.Estado,
          CuentaContableCons: cuenta.CuentaContableCons || null,
          CuentaContableConsDesc: cuenta.CuentaContableConsDesc || null
        }
      });

      const result: PlanContableItem = {
        CuentaContable: cuenta.CuentaContable,
        CuentaContableDesc: cuenta.CuentaContableDesc,
        Estado: cuenta.Estado
      };
      
      if (cuenta.CuentaContableCons !== undefined) {
        result.CuentaContableCons = cuenta.CuentaContableCons;
      }
      
      if (cuenta.CuentaContableConsDesc !== undefined) {
        result.CuentaContableConsDesc = cuenta.CuentaContableConsDesc;
      }
      
      return result;
    } catch (error) {
      console.error('Error al crear cuenta contable:', error);
      throw new Error(`Error al crear cuenta contable: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Exporta el Plan Contable a Excel
   */
  async exportarExcel(conjunto: string, usuario: string, filtros: PlanContableFiltros, limite: number = 10000): Promise<Buffer> {
    try {
      console.log(`Exportando Plan Contable a Excel para conjunto: ${conjunto}, límite: ${limite}`);

      // Obtener datos sin paginación pero con límite
      const filtrosSinPaginacion = { ...filtros, page: 1, limit: limite };
      const response = await this.obtenerPlanContable(filtrosSinPaginacion);

      if (response.data.length === 0) {
        throw new Error('No hay datos para exportar');
      }

      // Preparar datos para Excel
      const excelData = response.data.map(item => ({
        'Cuenta Contable': item.CuentaContable,
        'Descripción': item.CuentaContableDesc,
        'Estado': item.Estado,
        'Cuenta Consolidada': item.CuentaContableCons || '',
        'Descripción Consolidada': item.CuentaContableConsDesc || ''
      }));

      // Crear workbook
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Configurar ancho de columnas
      const columnWidths = [
        { wch: 15 }, // Cuenta Contable
        { wch: 40 }, // Descripción
        { wch: 10 }, // Estado
        { wch: 15 }, // Cuenta Consolidada
        { wch: 40 }  // Descripción Consolidada
      ];
      worksheet['!cols'] = columnWidths;

      // Agregar worksheet al workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Plan Contable');

      // Generar buffer
      const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      
      console.log(`Excel generado exitosamente con ${response.data.length} registros`);
      return excelBuffer;

    } catch (error) {
      console.error('Error al exportar Plan Contable a Excel:', error);
      throw new Error(`Error al exportar Plan Contable a Excel: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Limpia los datos temporales del Plan Contable
   */
  async limpiarDatosTemporales(conjunto: string): Promise<void> {
    try {
      const query = `DROP TABLE IF EXISTS ${conjunto}.R_XML_8DDC55004B87DB3`;
      await exactusSequelize.query(query, { type: QueryTypes.RAW });
      console.log(`Datos temporales del Plan Contable limpiados para conjunto: ${conjunto}`);
    } catch (error) {
      console.error('Error al limpiar datos temporales:', error);
      throw new Error(`Error al limpiar datos temporales: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Verifica si existe la tabla temporal del Plan Contable
   */
  async existeTablaReporte(conjunto: string): Promise<boolean> {
    try {
      const query = `
        SELECT COUNT(*) as count
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_SCHEMA = '${conjunto}'
        AND TABLE_NAME = 'R_XML_8DDC55004B87DB3'
      `;
      
      const resultado = await exactusSequelize.query(query, { type: QueryTypes.SELECT }) as any[];
      return resultado[0]?.count > 0;
    } catch (error) {
      console.error('Error al verificar existencia de tabla temporal:', error);
      return false;
    }
  }

  /**
   * Crea la tabla temporal del Plan Contable
   */
  async crearTablaReporte(conjunto: string): Promise<void> {
    try {
      const query = `
        CREATE TABLE ${conjunto}.R_XML_8DDC55004B87DB3 (
          CuentaContable VARCHAR(254), 
          CuentaContableDesc VARCHAR(254), 
          Estado VARCHAR(254), 
          CuentaContableCons VARCHAR(254), 
          CuentaContableConsDesc VARCHAR(254),
          ROW_ORDER_BY INT NOT NULL IDENTITY PRIMARY KEY
        )
      `;

      await exactusSequelize.query(query, { type: QueryTypes.RAW });
      console.log(`Tabla temporal del Plan Contable creada para conjunto: ${conjunto}`);
    } catch (error) {
      console.error('Error al crear tabla temporal:', error);
      throw new Error(`Error al crear tabla temporal: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Obtiene el total de registros sin paginación
   */
  async obtenerTotalRegistros(filtros: PlanContableFiltros): Promise<number> {
    try {
      const { conjunto, cuentaContable, descripcion, estado } = filtros;

      // Verificar que la tabla temporal existe
      const tablaExiste = await this.existeTablaReporte(conjunto);
      if (!tablaExiste) {
        return 0;
      }

      let whereClause = '1=1';
      const replacements: any = {};

      if (cuentaContable) {
        whereClause += ' AND CuentaContable LIKE :cuentaContable';
        replacements.cuentaContable = `%${cuentaContable}%`;
      }

      if (descripcion) {
        whereClause += ' AND CuentaContableDesc LIKE :descripcion';
        replacements.descripcion = `%${descripcion}%`;
      }

      if (estado) {
        whereClause += ' AND Estado = :estado';
        replacements.estado = estado;
      }

      const query = `
        SELECT COUNT(*) as total
        FROM ${conjunto}.R_XML_8DDC55004B87DB3
        WHERE ${whereClause}
      `;

      const resultado = await exactusSequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements
      }) as any[];

      return resultado[0]?.total || 0;
    } catch (error) {
      console.error('Error al obtener total de registros:', error);
      return 0;
    }
  }

  /**
   * Inserta datos iniciales en la tabla temporal
   */
  private async insertarDatosIniciales(conjunto: string): Promise<void> {
    try {
      // Insertar ejemplo basado en el query proporcionado
      const query = `
        INSERT INTO ${conjunto}.R_XML_8DDC55004B87DB3 
        (CuentaContable, CuentaContableDesc, Estado)  
        VALUES ('01.0.0.0.000', 'Clientes', '1')
      `;

      await exactusSequelize.query(query, { type: QueryTypes.INSERT });
      console.log('Datos iniciales insertados en tabla temporal');
    } catch (error) {
      console.error('Error al insertar datos iniciales:', error);
      // No lanzar error, es opcional
    }
  }

  /**
   * Aplica la limpieza de caracteres especiales según el procedimiento almacenado
   */
  private limpiarCaracteresEspeciales(texto: string): string {
    if (!texto) return '';
    
    return texto
      .replace(/\//g, '')
      .replace(/\\/g, '')
      .replace(/\|/g, '')
      .replace(/\x01/g, '')
      .replace(/\x02/g, '')
      .replace(/\x03/g, '')
      .replace(/\x04/g, '')
      .replace(/\x05/g, '')
      .replace(/\x06/g, '')
      .replace(/\x07/g, '')
      .replace(/\x08/g, '')
      .replace(/\t/g, '')
      .replace(/\n/g, '')
      .replace(/\x0B/g, '')
      .replace(/\f/g, '')
      .replace(/\r/g, '')
      .replace(/\x0E/g, '')
      .replace(/\x0F/g, '')
      .replace(/\x10/g, '')
      .replace(/#/g, '')
      .replace(/\$/g, '')
      .replace(/%/g, '')
      .replace(/&/g, '')
      .replace(/\*/g, '')
      .replace(/:/g, '')
      .replace(/\?/g, '')
      .replace(/\^/g, '')
      .replace(/~/g, '')
      .replace(/Á/g, 'A')
      .replace(/Ç/g, '')
      .replace(/É/g, 'E')
      .replace(/Í/g, 'I')
      .replace(/Ñ/g, 'N')
      .replace(/Ó/g, 'O')
      .replace(/Ú/g, 'U')
      .replace(/á/g, 'a')
      .replace(/ç/g, '')
      .replace(/é/g, 'e')
      .replace(/í/g, 'i')
      .replace(/ñ/g, 'n')
      .replace(/ó/g, 'o')
      .replace(/ú/g, 'u');
  }
}
