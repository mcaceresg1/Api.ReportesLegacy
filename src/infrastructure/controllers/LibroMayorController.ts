import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { ILibroMayorService } from "../../domain/services/ILibroMayorService";
import {
  LibroMayorFiltros,
  LibroMayorResponse,
  GenerarLibroMayorParams,
  ExportarLibroMayorExcelParams,
  ExportarLibroMayorPDFParams,
} from "../../domain/entities/LibroMayor";

@injectable()
export class LibroMayorController {
  constructor(
    @inject("ILibroMayorService")
    private libroMayorService: ILibroMayorService
  ) {}

  /**
   * Health check endpoint
   */
  async health(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: "Servicio de Libro Mayor funcionando correctamente",
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Obtiene las cuentas contables para un conjunto específico
   * @swagger
   * /api/libro-mayor/{conjunto}/cuentas-contables:
   *   get:
   *     tags:
   *       - Libro Mayor
   *     summary: Obtiene las cuentas contables
   *     description: Recupera las cuentas contables disponibles para un conjunto
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "FIDPLAN"
   *     responses:
   *       200:
   *         description: Cuentas contables obtenidas exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/CuentaContableInfo'
   *                 message:
   *                   type: string
   *                   example: "Cuentas contables obtenidas exitosamente"
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async obtenerCuentasContables(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro conjunto es obligatorio",
        });
        return;
      }

      const cuentas = await this.libroMayorService.obtenerCuentasContables(conjunto);

      res.status(200).json({
        success: true,
        data: cuentas,
        message: "Cuentas contables obtenidas exitosamente",
      });
    } catch (error) {
      console.error("Error en obtenerCuentasContables:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener cuentas contables",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  /**
   * Obtiene los períodos contables para un conjunto específico
   * @swagger
   * /api/libro-mayor/{conjunto}/periodos-contables:
   *   get:
   *     tags:
   *       - Libro Mayor
   *     summary: Obtiene los períodos contables
   *     description: Recupera los períodos contables disponibles para un conjunto
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "FIDPLAN"
   *     responses:
   *       200:
   *         description: Períodos contables obtenidos exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/PeriodoContableInfo'
   *                 message:
   *                   type: string
   *                   example: "Períodos contables obtenidos exitosamente"
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async obtenerPeriodosContables(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro conjunto es obligatorio",
        });
        return;
      }

      const periodos = await this.libroMayorService.obtenerPeriodosContables(conjunto);

      res.status(200).json({
        success: true,
        data: periodos,
        message: "Períodos contables obtenidos exitosamente",
      });
    } catch (error) {
      console.error("Error en obtenerPeriodosContables:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener períodos contables",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  /**
   * Genera el reporte de Libro Mayor
   * @swagger
   * /api/libro-mayor/{conjunto}/generar:
   *   get:
   *     tags:
   *       - Libro Mayor
   *     summary: Genera el reporte de Libro Mayor
   *     description: Ejecuta el proceso para generar el reporte de Libro Mayor
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "FIDPLAN"
   *       - in: query
   *         name: cuentaContableDesde
   *         schema:
   *           type: string
   *         description: Cuenta contable desde
   *         example: "01.1.1.1.004"
   *       - in: query
   *         name: cuentaContableHasta
   *         schema:
   *           type: string
   *         description: Cuenta contable hasta
   *         example: "02.Z.Z.Z.ZZZ"
   *       - in: query
   *         name: fechaDesde
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha de inicio
   *         example: "2011-01-31"
   *       - in: query
   *         name: fechaHasta
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha de fin
   *         example: "2022-12-31"
   *       - in: query
   *         name: centroCosto
   *         schema:
   *           type: string
   *         description: Centro de costo
   *         example: "001"
   *     responses:
   *       200:
   *         description: Reporte generado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/LibroMayor'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     page:
   *                       type: integer
   *                       example: 1
   *                     limit:
   *                       type: integer
   *                       example: 1000
   *                     total:
   *                       type: integer
   *                       example: 150
   *                     totalPages:
   *                       type: integer
   *                       example: 1
   *                     hasNext:
   *                       type: boolean
   *                       example: false
   *                     hasPrev:
   *                       type: boolean
   *                       example: false
   *                 message:
   *                   type: string
   *                   example: "Reporte generado exitosamente"
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async generarReporte(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const {
        cuentaContableDesde,
        cuentaContableHasta,
        fechaDesde,
        fechaHasta,
        centroCosto,
      } = req.query;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro conjunto es obligatorio",
        });
        return;
      }

      if (!fechaDesde || !fechaHasta) {
        res.status(400).json({
          success: false,
          message: "Las fechas de inicio y fin son obligatorias",
        });
        return;
      }

      // Preparar filtros
      const filtros: GenerarLibroMayorParams = {
        conjunto,
        cuentaContableDesde: cuentaContableDesde as string,
        cuentaContableHasta: cuentaContableHasta as string,
        fechaDesde: fechaDesde as string,
        fechaHasta: fechaHasta as string,
        centroCosto: centroCosto as string,
      };

      // Validar fechas
      const fechaInicio = new Date(filtros.fechaDesde);
      const fechaFin = new Date(filtros.fechaHasta);

      if (isNaN(fechaInicio.getTime())) {
        res.status(400).json({
          success: false,
          message: "La fecha de inicio debe tener un formato válido (YYYY-MM-DD)",
        });
        return;
      }

      if (isNaN(fechaFin.getTime())) {
        res.status(400).json({
          success: false,
          message: "La fecha de fin debe tener un formato válido (YYYY-MM-DD)",
        });
        return;
      }

      if (fechaInicio > fechaFin) {
        res.status(400).json({
          success: false,
          message: "La fecha de inicio no puede ser mayor que la fecha de fin",
        });
        return;
      }

      const resultado = await this.libroMayorService.generarReporte(conjunto, filtros);

      res.status(200).json(resultado);
    } catch (error) {
      console.error("Error en generarReporte:", error);
      res.status(500).json({
        success: false,
        message: "Error al generar el reporte",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  /**
   * Obtiene los datos paginados del reporte
   * @swagger
   * /api/libro-mayor/{conjunto}/obtener:
   *   get:
   *     tags:
   *       - Libro Mayor
   *     summary: Obtiene los datos del Libro Mayor
   *     description: Recupera los datos del reporte con filtros opcionales y paginación
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "FIDPLAN"
   *       - in: query
   *         name: cuentaContableDesde
   *         schema:
   *           type: string
   *         description: Cuenta contable desde
   *         example: "01.1.1.1.004"
   *       - in: query
   *         name: cuentaContableHasta
   *         schema:
   *           type: string
   *         description: Cuenta contable hasta
   *         example: "02.Z.Z.Z.ZZZ"
   *       - in: query
   *         name: fechaDesde
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha de inicio
   *         example: "2011-01-31"
   *       - in: query
   *         name: fechaHasta
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha de fin
   *         example: "2022-12-31"
   *       - in: query
   *         name: centroCosto
   *         schema:
   *           type: string
   *         description: Centro de costo
   *         example: "001"
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: Número de página
   *         example: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 1000
   *         description: Registros por página
   *         example: 25
   *     responses:
   *       200:
   *         description: Datos obtenidos exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/LibroMayor'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     page:
   *                       type: integer
   *                       example: 1
   *                     limit:
   *                       type: integer
   *                       example: 25
   *                     total:
   *                       type: integer
   *                       example: 150
   *                     totalPages:
   *                       type: integer
   *                       example: 6
   *                     hasNext:
   *                       type: boolean
   *                       example: true
   *                     hasPrev:
   *                       type: boolean
   *                       example: false
   *                 message:
   *                   type: string
   *                   example: "Datos obtenidos exitosamente"
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async obtenerLibroMayor(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const {
        cuentaContableDesde,
        cuentaContableHasta,
        fechaDesde,
        fechaHasta,
        centroCosto,
        page,
        limit,
      } = req.query;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro conjunto es obligatorio",
        });
        return;
      }

      if (!fechaDesde || !fechaHasta) {
        res.status(400).json({
          success: false,
          message: "Las fechas de inicio y fin son obligatorias",
        });
        return;
      }

      // Validar y convertir paginación
      const pageNum = page ? parseInt(page as string, 10) : 1;
      const limitNum = limit ? parseInt(limit as string, 10) : 25;

      if (pageNum < 1 || limitNum < 1 || limitNum > 1000) {
        res.status(400).json({
          success: false,
          message: "La página debe ser >= 1 y el límite debe estar entre 1 y 1000",
        });
        return;
      }

      // Preparar filtros
      const filtros: LibroMayorFiltros = {
        conjunto,
        cuentaContableDesde: cuentaContableDesde as string,
        cuentaContableHasta: cuentaContableHasta as string,
        fechaDesde: fechaDesde as string,
        fechaHasta: fechaHasta as string,
        centroCosto: centroCosto as string,
        page: pageNum,
        limit: limitNum,
      };

      // Validar fechas
      const fechaInicio = new Date(filtros.fechaDesde);
      const fechaFin = new Date(filtros.fechaHasta);

      if (isNaN(fechaInicio.getTime())) {
        res.status(400).json({
          success: false,
          message: "La fecha de inicio debe tener un formato válido (YYYY-MM-DD)",
        });
        return;
      }

      if (isNaN(fechaFin.getTime())) {
        res.status(400).json({
          success: false,
          message: "La fecha de fin debe tener un formato válido (YYYY-MM-DD)",
        });
        return;
      }

      if (fechaInicio > fechaFin) {
        res.status(400).json({
          success: false,
          message: "La fecha de inicio no puede ser mayor que la fecha de fin",
        });
        return;
      }

      const resultado = await this.libroMayorService.obtenerLibroMayor(conjunto, filtros);

      res.status(200).json(resultado);
    } catch (error) {
      console.error("Error en obtenerLibroMayor:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener libro mayor",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  /**
   * Exporta el reporte a Excel
   * @swagger
   * /api/libro-mayor/{conjunto}/exportar-excel:
   *   get:
   *     tags:
   *       - Libro Mayor
   *     summary: Exporta el Libro Mayor a Excel
   *     description: Genera y descarga un archivo Excel con los datos del Libro Mayor
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "FIDPLAN"
   *       - in: query
   *         name: cuentaContableDesde
   *         schema:
   *           type: string
   *         description: Cuenta contable desde
   *         example: "01.1.1.1.004"
   *       - in: query
   *         name: cuentaContableHasta
   *         schema:
   *           type: string
   *         description: Cuenta contable hasta
   *         example: "02.Z.Z.Z.ZZZ"
   *       - in: query
   *         name: fechaDesde
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha de inicio
   *         example: "2011-01-31"
   *       - in: query
   *         name: fechaHasta
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha de fin
   *         example: "2022-12-31"
   *       - in: query
   *         name: centroCosto
   *         schema:
   *           type: string
   *         description: Centro de costo
   *         example: "001"
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 50000
   *         description: Límite de registros a exportar
   *         example: 10000
   *     responses:
   *       200:
   *         description: Archivo Excel generado exitosamente
   *         content:
   *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
   *             schema:
   *               type: string
   *               format: binary
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async exportarExcel(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const {
        cuentaContableDesde,
        cuentaContableHasta,
        fechaDesde,
        fechaHasta,
        centroCosto,
        limit,
      } = req.query;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro conjunto es obligatorio",
        });
        return;
      }

      if (!fechaDesde || !fechaHasta) {
        res.status(400).json({
          success: false,
          message: "Las fechas de inicio y fin son obligatorias",
        });
        return;
      }

      // Validar límite
      const limitNum = limit ? parseInt(limit as string, 10) : 10000;
      if (limitNum < 1 || limitNum > 50000) {
        res.status(400).json({
          success: false,
          message: "El límite debe estar entre 1 y 50000",
        });
        return;
      }

      // Preparar filtros
      const filtros: ExportarLibroMayorExcelParams = {
        conjunto,
        cuentaContableDesde: cuentaContableDesde as string,
        cuentaContableHasta: cuentaContableHasta as string,
        fechaDesde: fechaDesde as string,
        fechaHasta: fechaHasta as string,
        centroCosto: centroCosto as string,
        limit: limitNum,
      };

      // Validar fechas
      const fechaInicio = new Date(filtros.fechaDesde);
      const fechaFin = new Date(filtros.fechaHasta);

      if (isNaN(fechaInicio.getTime())) {
        res.status(400).json({
          success: false,
          message: "La fecha de inicio debe tener un formato válido (YYYY-MM-DD)",
        });
        return;
      }

      if (isNaN(fechaFin.getTime())) {
        res.status(400).json({
          success: false,
          message: "La fecha de fin debe tener un formato válido (YYYY-MM-DD)",
        });
        return;
      }

      if (fechaInicio > fechaFin) {
        res.status(400).json({
          success: false,
          message: "La fecha de inicio no puede ser mayor que la fecha de fin",
        });
        return;
      }

      const excelBuffer = await this.libroMayorService.exportarExcel(conjunto, filtros);

      // Configurar headers para descarga
      const fileName = `libro-mayor-${conjunto}-${new Date().toISOString().split('T')[0]}.xlsx`;
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );
      res.setHeader("Content-Length", excelBuffer.length);

      // Enviar archivo
      res.send(excelBuffer);
    } catch (error) {
      console.error("Error en exportarExcel:", error);
      res.status(500).json({
        success: false,
        message: "Error al exportar Libro Mayor a Excel",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  /**
   * Exporta el reporte a PDF
   * @swagger
   * /api/libro-mayor/{conjunto}/exportar-pdf:
   *   get:
   *     tags:
   *       - Libro Mayor
   *     summary: Exporta el Libro Mayor a PDF
   *     description: Genera y descarga un archivo PDF con los datos del Libro Mayor
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "FIDPLAN"
   *       - in: query
   *         name: cuentaContableDesde
   *         schema:
   *           type: string
   *         description: Cuenta contable desde
   *         example: "01.1.1.1.004"
   *       - in: query
   *         name: cuentaContableHasta
   *         schema:
   *           type: string
   *         description: Cuenta contable hasta
   *         example: "02.Z.Z.Z.ZZZ"
   *       - in: query
   *         name: fechaDesde
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha de inicio
   *         example: "2011-01-31"
   *       - in: query
   *         name: fechaHasta
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha de fin
   *         example: "2022-12-31"
   *       - in: query
   *         name: centroCosto
   *         schema:
   *           type: string
   *         description: Centro de costo
   *         example: "001"
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 50000
   *         description: Límite de registros a exportar
   *         example: 10000
   *     responses:
   *       200:
   *         description: Archivo PDF generado exitosamente
   *         content:
   *           application/pdf:
   *             schema:
   *               type: string
   *               format: binary
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async exportarPDF(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const {
        cuentaContableDesde,
        cuentaContableHasta,
        fechaDesde,
        fechaHasta,
        centroCosto,
        limit,
      } = req.query;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro conjunto es obligatorio",
        });
        return;
      }

      if (!fechaDesde || !fechaHasta) {
        res.status(400).json({
          success: false,
          message: "Las fechas de inicio y fin son obligatorias",
        });
        return;
      }

      // Validar límite
      const limitNum = limit ? parseInt(limit as string, 10) : 10000;
      if (limitNum < 1 || limitNum > 50000) {
        res.status(400).json({
          success: false,
          message: "El límite debe estar entre 1 y 50000",
        });
        return;
      }

      // Preparar filtros
      const filtros: ExportarLibroMayorPDFParams = {
        conjunto,
        cuentaContableDesde: cuentaContableDesde as string,
        cuentaContableHasta: cuentaContableHasta as string,
        fechaDesde: fechaDesde as string,
        fechaHasta: fechaHasta as string,
        centroCosto: centroCosto as string,
        limit: limitNum,
      };

      // Validar fechas
      const fechaInicio = new Date(filtros.fechaDesde);
      const fechaFin = new Date(filtros.fechaHasta);

      if (isNaN(fechaInicio.getTime())) {
        res.status(400).json({
          success: false,
          message: "La fecha de inicio debe tener un formato válido (YYYY-MM-DD)",
        });
        return;
      }

      if (isNaN(fechaFin.getTime())) {
        res.status(400).json({
          success: false,
          message: "La fecha de fin debe tener un formato válido (YYYY-MM-DD)",
        });
        return;
      }

      if (fechaInicio > fechaFin) {
        res.status(400).json({
          success: false,
          message: "La fecha de inicio no puede ser mayor que la fecha de fin",
        });
        return;
      }

      const pdfBuffer = await this.libroMayorService.exportarPDF(conjunto, filtros);

      // Configurar headers para descarga
      const fileName = `libro-mayor-${conjunto}-${new Date().toISOString().split('T')[0]}.pdf`;
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );
      res.setHeader("Content-Length", pdfBuffer.length);

      // Enviar archivo
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error en exportarPDF:", error);
      res.status(500).json({
        success: false,
        message: "Error al exportar Libro Mayor a PDF",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}
