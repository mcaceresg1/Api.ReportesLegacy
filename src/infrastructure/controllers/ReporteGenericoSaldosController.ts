import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { ICommandBus } from "../../domain/cqrs/ICommandBus";
import { IQueryBus } from "../../domain/cqrs/IQueryBus";
import { GenerarReporteGenericoSaldosCommand } from "../../application/commands/reporte-generico-saldos/GenerarReporteGenericoSaldosCommand";
import { ObtenerReporteGenericoSaldosQuery } from "../../application/queries/reporte-generico-saldos/ObtenerReporteGenericoSaldosQuery";
import { ExportarReporteGenericoSaldosExcelQuery } from "../../application/queries/reporte-generico-saldos/ExportarReporteGenericoSaldosExcelQuery";
import { ObtenerEstadisticasReporteGenericoSaldosQuery } from "../../application/queries/reporte-generico-saldos/ObtenerEstadisticasReporteGenericoSaldosQuery";
import { FiltrosReporteGenericoSaldos } from "../../domain/entities/ReporteGenericoSaldos";

@injectable()
export class ReporteGenericoSaldosController {
  constructor(
    @inject("ICommandBus") private commandBus: ICommandBus,
    @inject("IQueryBus") private queryBus: IQueryBus
  ) {}

  /**
   * Genera el reporte genérico de saldos
   */
  async generarReporte(req: Request, res: Response): Promise<void> {
    try {
      const {
        conjunto,
        usuario,
        fechaInicio,
        fechaFin,
        contabilidad,
        tipoAsiento,
        claseAsiento,
      } = req.body;

      if (!conjunto || !usuario || !fechaInicio || !fechaFin) {
        res.status(400).json({
          success: false,
          message:
            "Faltan parámetros requeridos: conjunto, usuario, fechaInicio, fechaFin",
        });
        return;
      }

      const command = new GenerarReporteGenericoSaldosCommand(
        conjunto,
        usuario,
        new Date(fechaInicio),
        new Date(fechaFin),
        contabilidad,
        tipoAsiento,
        claseAsiento
      );

      await this.commandBus.execute(command);

      res.json({
        success: true,
        message: "Reporte genérico de saldos generado exitosamente",
      });
    } catch (error) {
      console.error("Error en generarReporte:", error);
      res.status(500).json({
        success: false,
        message: "Error al generar el reporte genérico de saldos",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  /**
   * Obtiene los datos del reporte genérico de saldos con filtros y paginación
   */
  async obtenerReporte(req: Request, res: Response): Promise<void> {
    try {
      const {
        conjunto,
        usuario,
        fechaInicio,
        fechaFin,
        contabilidad,
        tipoAsiento,
        claseAsiento,
        cuentaContable,
        nit,
        razonSocial,
        codTipoDoc,
        tipoDocSunat,
        asiento,
        consecutivo,
        saldoLocalMin,
        saldoLocalMax,
        saldoDolarMin,
        saldoDolarMax,
        page,
        limit,
      } = req.query;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro conjunto es requerido",
        });
        return;
      }

      const filtros: FiltrosReporteGenericoSaldos = {
        conjunto: conjunto as string,
        usuario: (usuario as string) || "ADMIN",
        fechaInicio: fechaInicio
          ? new Date(fechaInicio as string)
          : new Date("2020-01-01"),
        fechaFin: fechaFin ? new Date(fechaFin as string) : new Date(),
        contabilidad: (contabilidad as string) || "F,A",
        tipoAsiento: (tipoAsiento as string) || "06",
        claseAsiento: (claseAsiento as string) || "C",
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 25,
      };

      // Add optional properties only if they have values
      if (cuentaContable) {
        filtros.cuentaContable = cuentaContable as string;
      }
      if (nit) {
        filtros.nit = nit as string;
      }
      if (razonSocial) {
        filtros.razonSocial = razonSocial as string;
      }
      if (codTipoDoc) {
        filtros.codTipoDoc = codTipoDoc as string;
      }
      if (tipoDocSunat) {
        filtros.tipoDocSunat = tipoDocSunat as string;
      }
      if (asiento) {
        filtros.asiento = asiento as string;
      }
      if (consecutivo) {
        filtros.consecutivo = parseInt(consecutivo as string);
      }
      if (saldoLocalMin) {
        filtros.saldoLocalMin = parseFloat(saldoLocalMin as string);
      }
      if (saldoLocalMax) {
        filtros.saldoLocalMax = parseFloat(saldoLocalMax as string);
      }
      if (saldoDolarMin) {
        filtros.saldoDolarMin = parseFloat(saldoDolarMin as string);
      }
      if (saldoDolarMax) {
        filtros.saldoDolarMax = parseFloat(saldoDolarMax as string);
      }

      const query = new ObtenerReporteGenericoSaldosQuery(filtros);
      const resultado = await this.queryBus.execute(query);

      res.json({
        success: true,
        data: resultado,
      });
    } catch (error) {
      console.error("Error en obtenerReporte:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener el reporte genérico de saldos",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  /**
   * Exporta el reporte genérico de saldos a Excel
   */
  async exportarExcel(req: Request, res: Response): Promise<void> {
    try {
      const {
        conjunto,
        usuario,
        fechaInicio,
        fechaFin,
        contabilidad,
        tipoAsiento,
        claseAsiento,
        limit,
      } = req.body;

      if (!conjunto || !usuario || !fechaInicio || !fechaFin) {
        res.status(400).json({
          success: false,
          message:
            "Faltan parámetros requeridos: conjunto, usuario, fechaInicio, fechaFin",
        });
        return;
      }

      const query = new ExportarReporteGenericoSaldosExcelQuery(
        conjunto,
        usuario,
        new Date(fechaInicio),
        new Date(fechaFin),
        contabilidad,
        tipoAsiento,
        claseAsiento,
        limit
      );

      const excelBuffer = await this.queryBus.execute(query);

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="reporte-generico-saldos-${conjunto}-${
          new Date().toISOString().split("T")[0]
        }.xlsx"`
      );
      res.send(excelBuffer);
    } catch (error) {
      console.error("Error en exportarExcel:", error);
      res.status(500).json({
        success: false,
        message: "Error al exportar el reporte genérico de saldos a Excel",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  /**
   * Obtiene estadísticas del reporte genérico de saldos
   */
  async obtenerEstadisticas(req: Request, res: Response): Promise<void> {
    try {
      const {
        conjunto,
        usuario,
        fechaInicio,
        fechaFin,
        contabilidad,
        tipoAsiento,
        claseAsiento,
      } = req.query;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro conjunto es requerido",
        });
        return;
      }

      const filtros: FiltrosReporteGenericoSaldos = {
        conjunto: conjunto as string,
        usuario: (usuario as string) || "ADMIN",
        fechaInicio: fechaInicio
          ? new Date(fechaInicio as string)
          : new Date("2020-01-01"),
        fechaFin: fechaFin ? new Date(fechaFin as string) : new Date(),
        contabilidad: (contabilidad as string) || "F,A",
        tipoAsiento: (tipoAsiento as string) || "06",
        claseAsiento: (claseAsiento as string) || "C",
      };

      const query = new ObtenerEstadisticasReporteGenericoSaldosQuery(filtros);
      const estadisticas = await this.queryBus.execute(query);

      res.json({
        success: true,
        data: estadisticas,
      });
    } catch (error) {
      console.error("Error en obtenerEstadisticas:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener estadísticas del reporte genérico de saldos",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}
