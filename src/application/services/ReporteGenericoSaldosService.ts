import { injectable, inject } from "inversify";
import { IReporteGenericoSaldosService } from "../../domain/services/IReporteGenericoSaldosService";
import { IReporteGenericoSaldosRepository } from "../../domain/repositories/IReporteGenericoSaldosRepository";
import {
  FiltrosReporteGenericoSaldos,
  ReporteGenericoSaldosResponse,
  EstadisticasReporteGenericoSaldos,
} from "../../domain/entities/ReporteGenericoSaldos";

@injectable()
export class ReporteGenericoSaldosService
  implements IReporteGenericoSaldosService
{
  constructor(
    @inject("IReporteGenericoSaldosRepository")
    private reporteGenericoSaldosRepository: IReporteGenericoSaldosRepository
  ) {}

  /**
   * Genera el reporte genérico de saldos
   */
  async generarReporteGenericoSaldos(
    conjunto: string,
    usuario: string,
    fechaInicio: Date,
    fechaFin: Date,
    contabilidad: string = "F,A",
    tipoAsiento: string = "06",
    claseAsiento: string = "C"
  ): Promise<void> {
    try {
      // Validar parámetros
      if (!conjunto || !usuario) {
        throw new Error("Conjunto y usuario son requeridos");
      }

      if (fechaInicio >= fechaFin) {
        throw new Error("La fecha de inicio debe ser anterior a la fecha fin");
      }

      // Aplicar valores por defecto
      const contabilidadFinal = contabilidad || "F,A";
      const tipoAsientoFinal = tipoAsiento || "06";
      const claseAsientoFinal = claseAsiento || "C";

      await this.reporteGenericoSaldosRepository.generarReporteGenericoSaldos(
        conjunto,
        usuario,
        fechaInicio,
        fechaFin,
        contabilidadFinal,
        tipoAsientoFinal,
        claseAsientoFinal
      );
    } catch (error) {
      console.error(
        "Error en ReporteGenericoSaldosService.generarReporteGenericoSaldos:",
        error
      );
      throw error;
    }
  }

  /**
   * Obtiene los datos del reporte genérico de saldos con filtros y paginación
   */
  async obtenerReporteGenericoSaldos(
    conjunto: string,
    filtros: FiltrosReporteGenericoSaldos
  ): Promise<ReporteGenericoSaldosResponse> {
    try {
      // Validar parámetros
      if (!conjunto) {
        throw new Error("Conjunto es requerido");
      }

      // Aplicar valores por defecto
      const filtrosConDefaults: FiltrosReporteGenericoSaldos = {
        ...filtros,
        conjunto,
        usuario: filtros.usuario || "ADMIN",
        fechaInicio: filtros.fechaInicio || new Date("2020-01-01"),
        fechaFin: filtros.fechaFin || new Date(),
        contabilidad: filtros.contabilidad || "F,A",
        tipoAsiento: filtros.tipoAsiento || "06",
        claseAsiento: filtros.claseAsiento || "C",
        page: filtros.page || 1,
        limit: filtros.limit || 25,
      };

      return await this.reporteGenericoSaldosRepository.obtenerReporteGenericoSaldos(
        conjunto,
        filtrosConDefaults
      );
    } catch (error) {
      console.error(
        "Error en ReporteGenericoSaldosService.obtenerReporteGenericoSaldos:",
        error
      );
      throw error;
    }
  }

  /**
   * Exporta el reporte genérico de saldos a Excel
   */
  async exportarExcel(
    conjunto: string,
    usuario: string,
    fechaInicio: Date,
    fechaFin: Date,
    contabilidad: string = "F,A",
    tipoAsiento: string = "06",
    claseAsiento: string = "C",
    limit: number = 10000
  ): Promise<Buffer> {
    try {
      // Validar parámetros
      if (!conjunto || !usuario) {
        throw new Error("Conjunto y usuario son requeridos");
      }

      if (fechaInicio >= fechaFin) {
        throw new Error("La fecha de inicio debe ser anterior a la fecha fin");
      }

      // Aplicar valores por defecto
      const contabilidadFinal = contabilidad || "F,A";
      const tipoAsientoFinal = tipoAsiento || "06";
      const claseAsientoFinal = claseAsiento || "C";
      const limitFinal = limit || 10000;

      return await this.reporteGenericoSaldosRepository.exportarExcel(
        conjunto,
        usuario,
        fechaInicio,
        fechaFin,
        contabilidadFinal,
        tipoAsientoFinal,
        claseAsientoFinal,
        limitFinal
      );
    } catch (error) {
      console.error(
        "Error en ReporteGenericoSaldosService.exportarExcel:",
        error
      );
      throw error;
    }
  }

  /**
   * Obtiene estadísticas del reporte genérico de saldos
   */
  async obtenerEstadisticas(
    conjunto: string,
    filtros: FiltrosReporteGenericoSaldos
  ): Promise<EstadisticasReporteGenericoSaldos> {
    try {
      // Validar parámetros
      if (!conjunto) {
        throw new Error("Conjunto es requerido");
      }

      // Aplicar valores por defecto
      const filtrosConDefaults: FiltrosReporteGenericoSaldos = {
        ...filtros,
        conjunto,
        usuario: filtros.usuario || "ADMIN",
        fechaInicio: filtros.fechaInicio || new Date("2020-01-01"),
        fechaFin: filtros.fechaFin || new Date(),
        contabilidad: filtros.contabilidad || "F,A",
        tipoAsiento: filtros.tipoAsiento || "06",
        claseAsiento: filtros.claseAsiento || "C",
      };

      return await this.reporteGenericoSaldosRepository.obtenerEstadisticas(
        conjunto,
        filtrosConDefaults
      );
    } catch (error) {
      console.error(
        "Error en ReporteGenericoSaldosService.obtenerEstadisticas:",
        error
      );
      throw error;
    }
  }
}
