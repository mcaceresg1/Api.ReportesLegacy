import { injectable } from 'inversify';
import { ILibroMayorAsientosRepository } from '../../domain/repositories/ILibroMayorAsientosRepository';
import { LibroMayorAsientos, FiltrosLibroMayorAsientos, FiltroAsientosResponse } from '../../domain/entities/LibroMayorAsientos';
import { exactusSequelize } from '../database/config/exactus-database';
import { QueryTypes } from 'sequelize';
import * as XLSX from 'xlsx';

@injectable()
export class LibroMayorAsientosRepository implements ILibroMayorAsientosRepository {
  async obtener(conjunto: string, filtros: FiltrosLibroMayorAsientos): Promise<LibroMayorAsientos[]> {
    const { 
      asiento,
      tipo_asiento,
      fecha_desde,
      fecha_hasta,
      contabilidad,
      mayorizacion,
      exportados,
      documento_global,
      clases_asiento,
      origen,
      page = 1,
      limit = 1000
    } = filtros;

    // Construir condiciones WHERE dinámicamente
    let whereConditions = '1=1';

    // Filtro por asiento
    if (asiento) {
      whereConditions += ` AND A.ASIENTO = '${asiento}'`;
    }

    // Filtro por tipo de asiento
    if (tipo_asiento) {
      whereConditions += ` AND A.TIPO_ASIENTO = '${tipo_asiento}'`;
    }

    // Filtro por fechas
    if (fecha_desde && fecha_hasta) {
      const fechaDesdeStr = new Date(fecha_desde).toISOString().slice(0, 19).replace('T', ' ');
      const fechaHastaStr = new Date(fecha_hasta).toISOString().slice(0, 19).replace('T', ' ');
      whereConditions += ` AND A.FECHA BETWEEN '${fechaDesdeStr}' AND '${fechaHastaStr}'`;
    }

    // Filtro por contabilidad
    if (contabilidad) {
      whereConditions += ` AND A.CONTABILIDAD = '${contabilidad}'`;
    }

    // Filtro por mayorización
    if (mayorizacion) {
      whereConditions += ` AND A.MAYOR_AUDITORIA = '${mayorizacion}'`;
    }

    // Filtro por exportados
    if (exportados) {
      whereConditions += ` AND A.EXPORTADO = '${exportados}'`;
    }

    // Filtro por documento global
    if (documento_global) {
      whereConditions += ` AND A.DOCUMENTO_GLOBAL = '${documento_global}'`;
    }

    // Filtro por clases de asiento
    if (clases_asiento && clases_asiento.length > 0) {
      const clasesStr = clases_asiento.map(c => `'${c}'`).join(',');
      whereConditions += ` AND A.TIPO_INGRESO_MAYOR IN (${clasesStr})`;
    }

    // Filtro por origen
    if (origen && origen.length > 0) {
      const origenStr = origen.map(o => `'${o}'`).join(',');
      whereConditions += ` AND A.ORIGEN IN (${origenStr})`;
    }

    // Query principal basado en el query proporcionado
    const query = `
      SELECT 
        A.ASIENTO as asiento,
        '' as fuente,
        '' as contabilidad,
        A.TIPO_ASIENTO as tipo_asiento,
        A.FECHA as fecha,
        A.ORIGEN as origen,
        A.DOCUMENTO_GLOBAL as documento_global,
        0 as monto_total_local,
        0 as monto_total_dolar,
        A.MONTO_TOTAL_LOCAL as monto_total_local,
        0 as monto_total_dolar,
        0 as monto_total_dolar,
        A.MONTO_TOTAL_DOLAR as monto_total_dolar,
        A.MAYOR_AUDITORIA as mayor_auditoria,
        A.EXPORTADO as exportado,
        A.TIPO_INGRESO_MAYOR as tipo_ingreso_mayor
      FROM FIDPLAN.ASIENTO_MAYORIZADO A(NOLOCK)
      WHERE ${whereConditions}
      ORDER BY A.ASIENTO ASC
      OFFSET ${(page - 1) * limit} ROWS
      FETCH NEXT ${limit} ROWS ONLY
    `;

    console.log('Query ejecutado:', query);

    try {
      const resultados = await exactusSequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: { conjunto }
      });

      return resultados as LibroMayorAsientos[];
    } catch (error) {
      console.error('Error ejecutando query:', error);
      throw new Error(`Error al obtener datos del reporte: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async obtenerFiltros(conjunto: string): Promise<FiltroAsientosResponse> {
    try {
      // Query para obtener asientos únicos
      const asientosQuery = `
        SELECT DISTINCT ASIENTO 
        FROM FIDPLAN.ASIENTO_MAYORIZADO A(NOLOCK)
        WHERE ASIENTO IS NOT NULL AND ASIENTO != ''
        ORDER BY ASIENTO
      `;

      // Query para obtener tipos de asiento únicos
      const tiposAsientoQuery = `
        SELECT DISTINCT TIPO_ASIENTO 
        FROM FIDPLAN.ASIENTO_MAYORIZADO A(NOLOCK)
        WHERE TIPO_ASIENTO IS NOT NULL AND TIPO_ASIENTO != ''
        ORDER BY TIPO_ASIENTO
      `;

      // Query para obtener orígenes únicos
      const origenesQuery = `
        SELECT DISTINCT ORIGEN 
        FROM FIDPLAN.ASIENTO_MAYORIZADO A(NOLOCK)
        WHERE ORIGEN IS NOT NULL AND ORIGEN != ''
        ORDER BY ORIGEN
      `;

      const [asientosResult, tiposAsientoResult, origenesResult] = await Promise.all([
        exactusSequelize.query(asientosQuery, { type: QueryTypes.SELECT }),
        exactusSequelize.query(tiposAsientoQuery, { type: QueryTypes.SELECT }),
        exactusSequelize.query(origenesQuery, { type: QueryTypes.SELECT })
      ]);

      return {
        success: true,
        data: {
          asientos: asientosResult.map((item: any) => item.ASIENTO),
          tipos_asiento: tiposAsientoResult.map((item: any) => item.TIPO_ASIENTO),
          origenes: origenesResult.map((item: any) => item.ORIGEN)
        },
        message: 'Filtros obtenidos exitosamente'
      };
    } catch (error) {
      console.error('Error obteniendo filtros:', error);
      return {
        success: false,
        data: {
          asientos: [],
          tipos_asiento: [],
          origenes: []
        },
        message: `Error al obtener filtros: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }

  async exportarExcel(conjunto: string, filtros: FiltrosLibroMayorAsientos): Promise<Buffer> {
    try {
      // Obtener todos los datos sin paginación para exportar
      const datos = await this.obtener(conjunto, { ...filtros, page: 1, limit: 100000 });

      // Crear workbook
      const workbook = XLSX.utils.book_new();

      // Preparar datos para Excel
      const excelData = datos.map(item => ({
        'Asiento': item.asiento,
        'Fuente': item.fuente,
        'Contabilidad': item.contabilidad,
        'Tipo Asiento': item.tipo_asiento,
        'Fecha': item.fecha,
        'Origen': item.origen,
        'Documento Global': item.documento_global,
        'Monto Total Local': item.monto_total_local,
        'Monto Total Dólar': item.monto_total_dolar,
        'Mayor Auditoría': item.mayor_auditoria,
        'Exportado': item.exportado,
        'Tipo Ingreso Mayor': item.tipo_ingreso_mayor
      }));

      // Crear worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Ajustar ancho de columnas
      const columnWidths = [
        { wch: 12 }, // Asiento
        { wch: 10 }, // Fuente
        { wch: 12 }, // Contabilidad
        { wch: 15 }, // Tipo Asiento
        { wch: 12 }, // Fecha
        { wch: 10 }, // Origen
        { wch: 15 }, // Documento Global
        { wch: 18 }, // Monto Total Local
        { wch: 18 }, // Monto Total Dólar
        { wch: 15 }, // Mayor Auditoría
        { wch: 10 }, // Exportado
        { wch: 18 }  // Tipo Ingreso Mayor
      ];
      worksheet['!cols'] = columnWidths;

      // Agregar worksheet al workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Libro Mayor Asientos');

      // Generar buffer
      const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      return excelBuffer;
    } catch (error) {
      console.error('Error exportando a Excel:', error);
      throw new Error(`Error al exportar a Excel: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async exportarPDF(conjunto: string, filtros: FiltrosLibroMayorAsientos): Promise<Buffer> {
    try {
      // Obtener datos
      const datos = await this.obtener(conjunto, { ...filtros, page: 1, limit: 100000 });

      // Por ahora, generar un PDF simple usando el generador existente
      // En el futuro se puede implementar un generador más sofisticado
      const pdfContent = this.generarContenidoPDF(datos);
      
      // Convertir a buffer (implementación básica)
      const pdfBuffer = Buffer.from(pdfContent, 'utf-8');
      
      return pdfBuffer;
    } catch (error) {
      console.error('Error exportando a PDF:', error);
      throw new Error(`Error al exportar a PDF: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  private generarContenidoPDF(datos: LibroMayorAsientos[]): string {
    let contenido = `
      <html>
        <head>
          <title>Reporte Libro Mayor Asientos</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Reporte Libro Mayor Asientos</h1>
          <table>
            <thead>
              <tr>
                <th>Asiento</th>
                <th>Tipo Asiento</th>
                <th>Fecha</th>
                <th>Origen</th>
                <th>Documento Global</th>
                <th>Monto Total Local</th>
                <th>Monto Total Dólar</th>
                <th>Exportado</th>
              </tr>
            </thead>
            <tbody>
    `;

    datos.forEach(item => {
      contenido += `
        <tr>
          <td>${item.asiento}</td>
          <td>${item.tipo_asiento}</td>
          <td>${new Date(item.fecha).toLocaleDateString()}</td>
          <td>${item.origen}</td>
          <td>${item.documento_global}</td>
          <td>${item.monto_total_local}</td>
          <td>${item.monto_total_dolar}</td>
          <td>${item.exportado}</td>
        </tr>
      `;
    });

    contenido += `
            </tbody>
          </table>
          <p>Total de registros: ${datos.length}</p>
        </body>
      </html>
    `;

    return contenido;
  }
}
