import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { IQueryBus } from "../../domain/cqrs/IQueryBus";
import { ObtenerLibroDiarioAsientosQuery } from "../../application/queries/libro-diario-asientos/ObtenerLibroDiarioAsientosQuery";
import { GenerarLibroDiarioAsientosQuery } from "../../application/queries/libro-diario-asientos/GenerarLibroDiarioAsientosQuery";
import { ILibroDiarioAsientosService } from "../../domain/services/ILibroDiarioAsientosService";
import {
  GenerarLibroDiarioAsientosParams,
  LibroDiarioAsientosFiltros,
  ExportarLibroDiarioAsientosExcelParams,
} from "../../domain/entities/LibroDiarioAsientos";

@injectable()
export class LibroDiarioAsientosController {
  constructor(
    @inject("IQueryBus")
    private queryBus: IQueryBus,
    @inject("ILibroDiarioAsientosService")
    private libroDiarioAsientosService: ILibroDiarioAsientosService
  ) {}

  /**
   * Health check endpoint
   */
  async health(req: Request, res: Response): Promise<void> {
    res.json({
      success: true,
      message: "Libro Diario Asientos Controller is running",
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Obtiene los filtros disponibles
   */
  async obtenerFiltros(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro conjunto es requerido",
        });
        return;
      }

      const filtros = await this.libroDiarioAsientosService.obtenerFiltros(conjunto);

      res.json({
        success: true,
        data: filtros,
        message: "Filtros obtenidos exitosamente",
      });
    } catch (error) {
      console.error("Error obteniendo filtros:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Genera el reporte de Libro Diario Asientos
   */
  async generarReporte(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const filtros: GenerarLibroDiarioAsientosParams = {
        asiento: req.query['asiento'] as string,
        tipoAsiento: req.query['tipoAsiento'] as string,
        paquete: req.query['paquete'] as string,
        fechaDesde: req.query['fechaDesde'] as string,
        fechaHasta: req.query['fechaHasta'] as string,
      };

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro conjunto es requerido",
        });
        return;
      }

      const query = new GenerarLibroDiarioAsientosQuery(conjunto, filtros);
      const resultado = await this.queryBus.execute(query);

      res.json({
        success: true,
        data: resultado,
        message: "Reporte generado exitosamente",
      });
    } catch (error) {
      console.error("Error generando reporte:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Obtiene los datos paginados del Libro Diario Asientos
   */
  async obtenerAsientos(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const filtros: LibroDiarioAsientosFiltros = {
        conjunto: conjunto || '',
        asiento: req.query['asiento'] as string,
        tipoAsiento: req.query['tipoAsiento'] as string,
        paquete: req.query['paquete'] as string,
        fechaDesde: req.query['fechaDesde'] as string,
        fechaHasta: req.query['fechaHasta'] as string,
        page: req.query['page'] ? parseInt(req.query['page'] as string) : 1,
        limit: req.query['limit'] ? parseInt(req.query['limit'] as string) : 20,
      };

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro conjunto es requerido",
        });
        return;
      }

      const query = new ObtenerLibroDiarioAsientosQuery(conjunto, filtros);
      const resultado = await this.queryBus.execute(query);

      res.json(resultado);
    } catch (error) {
      console.error("Error obteniendo asientos:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Exporta el reporte a Excel
   */
  async exportarExcel(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const filtros: ExportarLibroDiarioAsientosExcelParams = {
        asiento: req.query['asiento'] as string,
        tipoAsiento: req.query['tipoAsiento'] as string,
        paquete: req.query['paquete'] as string,
        fechaDesde: req.query['fechaDesde'] as string,
        fechaHasta: req.query['fechaHasta'] as string,
      };

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro conjunto es requerido",
        });
        return;
      }

      const buffer = await this.libroDiarioAsientosService.exportarExcel(conjunto, filtros);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="libro-diario-asientos-${conjunto}.xlsx"`);
      res.setHeader('Content-Length', buffer.length.toString());

      res.send(buffer);
    } catch (error) {
      console.error("Error exportando Excel:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
