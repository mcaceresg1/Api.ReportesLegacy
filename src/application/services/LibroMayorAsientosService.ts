import { injectable, inject } from "inversify";
import { ILibroMayorAsientosService } from "../../domain/services/ILibroMayorAsientosService";
import { LibroMayorAsientosRepository } from "../../infrastructure/repositories/LibroMayorAsientosRepository";
import {
  LibroMayorAsientosFiltros,
  LibroMayorAsientosResponse,
  GenerarLibroMayorAsientosParams,
  ExportarLibroMayorAsientosExcelParams,
} from "../../domain/entities/LibroMayorAsientos";
import * as ExcelJS from "exceljs";

@injectable()
export class LibroMayorAsientosService implements ILibroMayorAsientosService {
  constructor(
    @inject("LibroMayorAsientosRepository")
    private libroMayorAsientosRepository: LibroMayorAsientosRepository
  ) {}

  /**
   * Obtiene los filtros disponibles (asientos y referencias)
   */
  async obtenerFiltros(conjunto: string): Promise<{ asiento: string; referencia: string }[]> {
    try {
      console.log(`Obteniendo filtros para conjunto: ${conjunto}`);
      const filtros = await this.libroMayorAsientosRepository.obtenerFiltros(conjunto);
      console.log(`Filtros obtenidos: ${filtros.length} registros`);
      return filtros;
    } catch (error) {
      console.error("Error al obtener filtros:", error);
      throw new Error(`Error al obtener filtros: ${error instanceof Error ? error.message : "Error desconocido"}`);
    }
  }

  /**
   * Genera el reporte de Libro Mayor Asientos
   */
  async generarReporte(
    conjunto: string,
    filtros: GenerarLibroMayorAsientosParams
  ): Promise<LibroMayorAsientosResponse> {
    try {
      console.log(`Generando reporte para conjunto: ${conjunto}`, filtros);
      
      const filtrosCompletos: LibroMayorAsientosFiltros = {
        ...filtros,
        conjunto,
        page: 1,
        limit: 1000, // Límite alto para el reporte completo
      };

      const resultado = await this.libroMayorAsientosRepository.obtenerAsientos(
        conjunto,
        filtrosCompletos
      );

      console.log(`Reporte generado: ${resultado.data.length} registros`);
      return resultado;
    } catch (error) {
      console.error("Error al generar reporte:", error);
      throw new Error(`Error al generar reporte: ${error instanceof Error ? error.message : "Error desconocido"}`);
    }
  }

  /**
   * Obtiene los datos paginados del reporte
   */
  async obtenerAsientos(
    conjunto: string,
    filtros: LibroMayorAsientosFiltros
  ): Promise<LibroMayorAsientosResponse> {
    try {
      console.log(`Obteniendo asientos para conjunto: ${conjunto}`, filtros);
      
      const resultado = await this.libroMayorAsientosRepository.obtenerAsientos(
        conjunto,
        filtros
      );

      console.log(`Asientos obtenidos: ${resultado.data.length} registros`);
      return resultado;
    } catch (error) {
      console.error("Error al obtener asientos:", error);
      throw new Error(`Error al obtener asientos: ${error instanceof Error ? error.message : "Error desconocido"}`);
    }
  }

  /**
   * Exporta el reporte a Excel
   */
  async exportarExcel(
    conjunto: string,
    filtros: ExportarLibroMayorAsientosExcelParams
  ): Promise<Buffer> {
    try {
      console.log(`Exportando a Excel para conjunto: ${conjunto}`, filtros);
      
      const datos = await this.libroMayorAsientosRepository.exportarExcel(conjunto, filtros);
      
      // Crear workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Libro Mayor Asientos");

      // Configurar columnas
      worksheet.columns = [
        { header: "Asiento", key: "asiento", width: 15 },
        { header: "Contabilidad", key: "contabilidad", width: 15 },
        { header: "Tipo Asiento", key: "tipo_asiento", width: 15 },
        { header: "Fecha", key: "fecha", width: 12 },
        { header: "Origen", key: "origen", width: 15 },
        { header: "Documento Global", key: "documento_global", width: 20 },
        { header: "Monto Total Local", key: "monto_total_local", width: 18 },
        { header: "Monto Total Dólar", key: "monto_total_dolar", width: 18 },
        { header: "Mayor Auditoría", key: "mayor_auditoria", width: 15 },
        { header: "Exportado", key: "exportado", width: 12 },
        { header: "Tipo Ingreso Mayor", key: "tipo_ingreso_mayor", width: 18 },
      ];

      // Estilo para el encabezado
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      };

      // Agregar datos
      datos.forEach((asiento) => {
        worksheet.addRow({
          asiento: asiento.asiento,
          contabilidad: asiento.contabilidad,
          tipo_asiento: asiento.tipo_asiento,
          fecha: asiento.fecha,
          origen: asiento.origen,
          documento_global: asiento.documento_global,
          monto_total_local: asiento.monto_total_local,
          monto_total_dolar: asiento.monto_total_dolar,
          mayor_auditoria: asiento.mayor_auditoria,
          exportado: asiento.exportado,
          tipo_ingreso_mayor: asiento.tipo_ingreso_mayor,
        });
      });

      // Aplicar bordes a todas las celdas
      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });

      // Generar buffer
      const buffer = await workbook.xlsx.writeBuffer();
      const bufferResult = Buffer.from(buffer);
      console.log(`Excel generado: ${bufferResult.length} bytes`);
      
      return bufferResult;
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
      throw new Error(`Error al exportar a Excel: ${error instanceof Error ? error.message : "Error desconocido"}`);
    }
  }

  /**
   * Exporta el reporte a PDF
   */
  async exportarPDF(
    conjunto: string,
    filtros: ExportarLibroMayorAsientosExcelParams
  ): Promise<Buffer> {
    try {
      console.log(`Exportando a PDF para conjunto: ${conjunto}`, filtros);
      
      // Por ahora, generar un PDF simple con los datos
      // En una implementación real, usarías una librería como PDFKit o jsPDF
      const datos = await this.libroMayorAsientosRepository.exportarExcel(conjunto, filtros);
      
      // Crear contenido PDF simple (esto es un placeholder)
      const pdfContent = `
        Libro Mayor Asientos - Conjunto: ${conjunto}
        Fecha de generación: ${new Date().toLocaleString()}
        
        Total de registros: ${datos.length}
        
        Datos:
        ${datos.map((asiento, index) => 
          `${index + 1}. Asiento: ${asiento.asiento}, Fecha: ${asiento.fecha}, Origen: ${asiento.origen}`
        ).join('\n')}
      `;

      // Convertir a buffer (esto es un placeholder)
      const buffer = Buffer.from(pdfContent, 'utf8');
      console.log(`PDF generado: ${buffer.length} bytes`);
      
      return buffer;
    } catch (error) {
      console.error("Error al exportar a PDF:", error);
      throw new Error(`Error al exportar a PDF: ${error instanceof Error ? error.message : "Error desconocido"}`);
    }
  }
}

