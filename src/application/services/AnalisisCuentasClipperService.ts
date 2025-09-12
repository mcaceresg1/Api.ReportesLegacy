import { injectable, inject } from "inversify";
import { IAnalisisCuentasClipperService } from "../../domain/services/IAnalisisCuentasClipperService";
import { IAnalisisCuentasClipperRepository } from "../../domain/repositories/IAnalisisCuentasClipperRepository";
import {
  AnalisisCuentasClipperResponse,
  AnalisisCuentasClipperFiltros,
  AnalisisCuentasRangoClipperFiltros,
  AnalisisCuentasRangoClipperResponse,
  AnalisisCuentasFechasClipperFiltros,
  AnalisisCuentasFechasClipperResponse,
  AnalisisCuentasVencimientoClipperFiltros,
  AnalisisCuentasVencimientoClipperResponse,
} from "../../domain/entities/AnalisisCuentasClipper";

/**
 * Implementación del servicio para Análisis de Cuentas Clipper
 * Maneja la lógica de negocio para el reporte
 */
@injectable()
export class AnalisisCuentasClipperService
  implements IAnalisisCuentasClipperService
{
  constructor(
    @inject("IAnalisisCuentasClipperRepository")
    private readonly analisisCuentasClipperRepository: IAnalisisCuentasClipperRepository
  ) {}

  async obtenerReporteAnalisisCuentasClipper(
    filtros: AnalisisCuentasClipperFiltros
  ): Promise<AnalisisCuentasClipperResponse> {
    try {
      return await this.analisisCuentasClipperRepository.obtenerReporteAnalisisCuentasClipper(
        filtros
      );
    } catch (error) {
      console.error("Error en obtenerReporteAnalisisCuentasClipper:", error);
      throw new Error(
        `Error al obtener el reporte: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  async obtenerReporteAnalisisCuentaRangoClipper(
    filtros: AnalisisCuentasRangoClipperFiltros
  ): Promise<AnalisisCuentasRangoClipperResponse> {
    try {
      // Validar que los filtros requeridos estén presentes
      if (!filtros.baseDatos) {
        throw new Error("La base de datos es requerida");
      }

      if (!filtros.cuentaDesde) {
        throw new Error("La cuenta desde es requerida");
      }

      if (!filtros.cuentaHasta) {
        throw new Error("La cuenta hasta es requerida");
      }

      // Validar que cuentaDesde sea menor o igual a cuentaHasta
      if (filtros.cuentaDesde > filtros.cuentaHasta) {
        throw new Error(
          "La cuenta desde debe ser menor o igual a la cuenta hasta"
        );
      }

      console.log(
        "Obteniendo reporte de análisis por rango con filtros:",
        filtros
      );

      // Delegar al repositorio
      const resultado =
        await this.analisisCuentasClipperRepository.obtenerReporteAnalisisCuentaRangoClipper(
          filtros
        );

      console.log(
        `Reporte de análisis por rango generado exitosamente. Registros: ${resultado.data.length}`
      );

      return resultado;
    } catch (error) {
      console.error("Error en AnalisisCuentasRangoClipperService:", error);
      throw new Error(
        `Error al obtener el reporte de análisis por rango: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  async obtenerReporteAnalisisCuentasFechasClipper(
    filtros: AnalisisCuentasFechasClipperFiltros
  ): Promise<AnalisisCuentasFechasClipperResponse> {
    try {
      // Validar que los filtros requeridos estén presentes
      if (!filtros.baseDatos) {
        throw new Error("La base de datos es requerida");
      }

      if (!filtros.fechaDesde) {
        throw new Error("La fecha desde es requerida");
      }

      if (!filtros.fechaHasta) {
        throw new Error("La fecha hasta es requerida");
      }

      // Validar formato de fechas (formato DD/MM/YYYY)
      const fechaDesdeRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      const fechaHastaRegex = /^\d{2}\/\d{2}\/\d{4}$/;

      if (!fechaDesdeRegex.test(filtros.fechaDesde)) {
        throw new Error(
          "La fecha desde debe tener el formato DD/MM/YYYY (ej: 01/01/2000)"
        );
      }

      if (!fechaHastaRegex.test(filtros.fechaHasta)) {
        throw new Error(
          "La fecha hasta debe tener el formato DD/MM/YYYY (ej: 31/12/2000)"
        );
      }

      // Validar que fechaDesde sea menor o igual a fechaHasta
      const [diaDesde, mesDesde, añoDesde] = filtros.fechaDesde.split("/");
      const [diaHasta, mesHasta, añoHasta] = filtros.fechaHasta.split("/");

      const fechaDesdeDate = new Date(
        parseInt(añoDesde!),
        parseInt(mesDesde!) - 1,
        parseInt(diaDesde!)
      );
      const fechaHastaDate = new Date(
        parseInt(añoHasta!),
        parseInt(mesHasta!) - 1,
        parseInt(diaHasta!)
      );

      if (fechaDesdeDate > fechaHastaDate) {
        throw new Error(
          "La fecha desde debe ser menor o igual a la fecha hasta"
        );
      }

      console.log(
        "Obteniendo reporte de análisis por fechas con filtros:",
        filtros
      );

      // Delegar al repositorio
      const resultado =
        await this.analisisCuentasClipperRepository.obtenerReporteAnalisisCuentasFechasClipper(
          filtros
        );

      console.log(
        `Reporte de análisis por fechas generado exitosamente. Registros: ${resultado.data.length}`
      );

      return resultado;
    } catch (error) {
      console.error("Error en AnalisisCuentasFechasClipperService:", error);
      throw new Error(
        `Error al obtener el reporte de análisis por fechas: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  async obtenerReporteAnalisisCuentasVencimientoClipper(
    filtros: AnalisisCuentasVencimientoClipperFiltros
  ): Promise<AnalisisCuentasVencimientoClipperResponse> {
    try {
      // Validar que los filtros requeridos estén presentes
      if (!filtros.baseDatos) {
        throw new Error("La base de datos es requerida");
      }

      if (!filtros.cuentaDesde) {
        throw new Error("La cuenta desde es requerida");
      }

      if (!filtros.cuentaHasta) {
        throw new Error("La cuenta hasta es requerida");
      }

      if (!filtros.fechaVencimientoDesde) {
        throw new Error("La fecha de vencimiento desde es requerida");
      }

      if (!filtros.fechaVencimientoHasta) {
        throw new Error("La fecha de vencimiento hasta es requerida");
      }

      // Validar que cuentaDesde sea menor o igual a cuentaHasta
      if (filtros.cuentaDesde > filtros.cuentaHasta) {
        throw new Error(
          "La cuenta desde debe ser menor o igual a la cuenta hasta"
        );
      }

      // Validar formato de fechas de vencimiento (formato DD/MM/YYYY)
      const fechaVencimientoDesdeRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      const fechaVencimientoHastaRegex = /^\d{2}\/\d{2}\/\d{4}$/;

      if (!fechaVencimientoDesdeRegex.test(filtros.fechaVencimientoDesde)) {
        throw new Error(
          "La fecha de vencimiento desde debe tener el formato DD/MM/YYYY (ej: 01/01/2000)"
        );
      }

      if (!fechaVencimientoHastaRegex.test(filtros.fechaVencimientoHasta)) {
        throw new Error(
          "La fecha de vencimiento hasta debe tener el formato DD/MM/YYYY (ej: 31/12/2000)"
        );
      }

      // Validar que fechaVencimientoDesde sea menor o igual a fechaVencimientoHasta
      const [diaDesde, mesDesde, añoDesde] =
        filtros.fechaVencimientoDesde.split("/");
      const [diaHasta, mesHasta, añoHasta] =
        filtros.fechaVencimientoHasta.split("/");

      const fechaVencimientoDesdeDate = new Date(
        parseInt(añoDesde!),
        parseInt(mesDesde!) - 1,
        parseInt(diaDesde!)
      );
      const fechaVencimientoHastaDate = new Date(
        parseInt(añoHasta!),
        parseInt(mesHasta!) - 1,
        parseInt(diaHasta!)
      );

      if (fechaVencimientoDesdeDate > fechaVencimientoHastaDate) {
        throw new Error(
          "La fecha de vencimiento desde debe ser menor o igual a la fecha de vencimiento hasta"
        );
      }

      console.log(
        "Obteniendo reporte de análisis por fecha de vencimiento con filtros:",
        filtros
      );

      // Delegar al repositorio
      const resultado =
        await this.analisisCuentasClipperRepository.obtenerReporteAnalisisCuentasVencimientoClipper(
          filtros
        );

      console.log(
        `Reporte de análisis por fecha de vencimiento generado exitosamente. Registros: ${resultado.data.length}`
      );

      return resultado;
    } catch (error) {
      console.error(
        "Error en AnalisisCuentasVencimientoClipperService:",
        error
      );
      throw new Error(
        `Error al obtener el reporte de análisis por fecha de vencimiento: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }
}
