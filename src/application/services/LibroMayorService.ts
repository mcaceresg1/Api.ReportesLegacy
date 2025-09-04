import { injectable, inject } from "inversify";
import { ILibroMayorService } from "../../domain/services/ILibroMayorService";
import { LibroMayorRepository } from "../../infrastructure/repositories/LibroMayorRepository";
import {
  LibroMayorFiltros,
  LibroMayorResponse,
  GenerarLibroMayorParams,
  ExportarLibroMayorExcelParams,
  ExportarLibroMayorPDFParams,
  CuentaContableInfo,
  PeriodoContableInfo,
} from "../../domain/entities/LibroMayor";
import * as ExcelJS from "exceljs";

@injectable()
export class LibroMayorService implements ILibroMayorService {
  constructor(
    @inject("LibroMayorRepository")
    private libroMayorRepository: LibroMayorRepository
  ) {}

  /**
   * Obtiene las cuentas contables para un conjunto específico
   */
  async obtenerCuentasContables(conjunto: string): Promise<CuentaContableInfo[]> {
    try {
      console.log(`Obteniendo cuentas contables para conjunto: ${conjunto}`);
      const cuentas = await this.libroMayorRepository.obtenerCuentasContables(conjunto);
      console.log(`Cuentas contables obtenidas: ${cuentas.length} registros`);
      return cuentas;
    } catch (error) {
      console.error("Error al obtener cuentas contables:", error);
      throw new Error(`Error al obtener cuentas contables: ${error instanceof Error ? error.message : "Error desconocido"}`);
    }
  }

  /**
   * Obtiene los períodos contables para un conjunto específico
   */
  async obtenerPeriodosContables(conjunto: string): Promise<PeriodoContableInfo[]> {
    try {
      console.log(`Obteniendo períodos contables para conjunto: ${conjunto}`);
      const periodos = await this.libroMayorRepository.obtenerPeriodosContables(conjunto);
      console.log(`Períodos contables obtenidos: ${periodos.length} registros`);
      return periodos;
    } catch (error) {
      console.error("Error al obtener períodos contables:", error);
      throw new Error(`Error al obtener períodos contables: ${error instanceof Error ? error.message : "Error desconocido"}`);
    }
  }

  /**
   * Genera el reporte de Libro Mayor
   */
  async generarReporte(
    conjunto: string,
    filtros: GenerarLibroMayorParams
  ): Promise<LibroMayorResponse> {
    try {
      console.log(`Generando reporte para conjunto: ${conjunto}`, filtros);
      
      const filtrosCompletos: LibroMayorFiltros = {
        ...filtros,
        conjunto,
        page: 1,
        limit: 1000, // Límite alto para el reporte completo
      };

      const resultado = await this.libroMayorRepository.obtenerLibroMayor(
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
  async obtenerLibroMayor(
    conjunto: string,
    filtros: LibroMayorFiltros
  ): Promise<LibroMayorResponse> {
    try {
      console.log(`Obteniendo libro mayor para conjunto: ${conjunto}`, filtros);
      
      const resultado = await this.libroMayorRepository.obtenerLibroMayor(
        conjunto,
        filtros
      );

      console.log(`Libro mayor obtenido: ${resultado.data.length} registros`);
      return resultado;
    } catch (error) {
      console.error("Error al obtener libro mayor:", error);
      throw new Error(`Error al obtener libro mayor: ${error instanceof Error ? error.message : "Error desconocido"}`);
    }
  }

  /**
   * Exporta el reporte a Excel
   */
  async exportarExcel(
    conjunto: string,
    filtros: ExportarLibroMayorExcelParams
  ): Promise<Buffer> {
    try {
      console.log(`Exportando a Excel para conjunto: ${conjunto}`, filtros);
      
      const datos = await this.libroMayorRepository.exportarExcel(conjunto, filtros);
      
      // Crear workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Libro Mayor");

      // Configurar columnas
      worksheet.columns = [
        { header: "Centro Costo", key: "centro_costo", width: 15 },
        { header: "Cuenta Contable", key: "cuenta_contable", width: 20 },
        { header: "Descripción", key: "descripcion_cuenta", width: 30 },
        { header: "Saldo Fisc Local", key: "saldo_fisc_local", width: 18 },
        { header: "Saldo Fisc Dólar", key: "saldo_fisc_dolar", width: 18 },
        { header: "Saldo Corp Local", key: "saldo_corp_local", width: 18 },
        { header: "Saldo Corp Dólar", key: "saldo_corp_dolar", width: 18 },
        { header: "Saldo Fisc Und", key: "saldo_fisc_und", width: 18 },
        { header: "Saldo Corp Und", key: "saldo_corp_und", width: 18 },
        { header: "Débito Fisc Local", key: "debito_fisc_local", width: 18 },
        { header: "Crédito Fisc Local", key: "credito_fisc_local", width: 18 },
        { header: "Débito Fisc Dólar", key: "debito_fisc_dolar", width: 18 },
        { header: "Crédito Fisc Dólar", key: "credito_fisc_dolar", width: 18 },
        { header: "Débito Corp Local", key: "debito_corp_local", width: 18 },
        { header: "Crédito Corp Local", key: "credito_corp_local", width: 18 },
        { header: "Débito Corp Dólar", key: "debito_corp_dolar", width: 18 },
        { header: "Crédito Corp Dólar", key: "credito_corp_dolar", width: 18 },
        { header: "Débito Fisc Und", key: "debito_fisc_und", width: 18 },
        { header: "Crédito Fisc Und", key: "credito_fisc_und", width: 18 },
        { header: "Débito Corp Und", key: "debito_corp_und", width: 18 },
        { header: "Crédito Corp Und", key: "credito_corp_und", width: 18 },
      ];

      // Estilo para el encabezado
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      };

      // Agregar datos
      datos.forEach((registro) => {
        worksheet.addRow({
          centro_costo: registro.centro_costo,
          cuenta_contable: registro.cuenta_contable,
          descripcion_cuenta: registro.descripcion_cuenta,
          saldo_fisc_local: registro.saldo_fisc_local,
          saldo_fisc_dolar: registro.saldo_fisc_dolar,
          saldo_corp_local: registro.saldo_corp_local,
          saldo_corp_dolar: registro.saldo_corp_dolar,
          saldo_fisc_und: registro.saldo_fisc_und,
          saldo_corp_und: registro.saldo_corp_und,
          debito_fisc_local: registro.debito_fisc_local,
          credito_fisc_local: registro.credito_fisc_local,
          debito_fisc_dolar: registro.debito_fisc_dolar,
          credito_fisc_dolar: registro.credito_fisc_dolar,
          debito_corp_local: registro.debito_corp_local,
          credito_corp_local: registro.credito_corp_local,
          debito_corp_dolar: registro.debito_corp_dolar,
          credito_corp_dolar: registro.credito_corp_dolar,
          debito_fisc_und: registro.debito_fisc_und,
          credito_fisc_und: registro.credito_fisc_und,
          debito_corp_und: registro.debito_corp_und,
          credito_corp_und: registro.credito_corp_und,
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
    filtros: ExportarLibroMayorPDFParams
  ): Promise<Buffer> {
    try {
      console.log(`Exportando a PDF para conjunto: ${conjunto}`, filtros);
      
      // Por ahora, generar un PDF simple con los datos
      // En una implementación real, usarías una librería como PDFKit o jsPDF
      const datos = await this.libroMayorRepository.exportarExcel(conjunto, filtros);
      
      // Crear contenido PDF simple (esto es un placeholder)
      const pdfContent = `
        Libro Mayor - Conjunto: ${conjunto}
        Fecha de generación: ${new Date().toLocaleString()}
        Período: ${filtros.fechaDesde} - ${filtros.fechaHasta}
        
        Total de registros: ${datos.length}
        
        Datos:
        ${datos.map((registro, index) => 
          `${index + 1}. Centro: ${registro.centro_costo}, Cuenta: ${registro.cuenta_contable}, Saldo Fisc Local: ${registro.saldo_fisc_local}`
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
