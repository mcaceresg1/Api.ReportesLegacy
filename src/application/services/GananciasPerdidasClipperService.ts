import { injectable, inject } from "inversify";
import { IGananciasPerdidasClipperService } from "../../domain/services/IGananciasPerdidasClipperService";
import { IGananciasPerdidasClipperRepository } from "../../domain/repositories/IGananciasPerdidasClipperRepository";
import {
  ClipperEstadoGananciasYResultados,
  FiltrosGananciasPerdidasClipper,
} from "../../domain/entities/GananciasPerdidasClipper";

@injectable()
export class GananciasPerdidasClipperService
  implements IGananciasPerdidasClipperService
{
  constructor(
    @inject("IGananciasPerdidasClipperRepository")
    private readonly gananciasPerdidasRepository: IGananciasPerdidasClipperRepository
  ) {}

  /**
   * Obtiene los datos del Estado de Ganancias y Pérdidas desde Clipper
   * @param bdClipperGPC Nombre de la base de datos Clipper GPC a utilizar
   * @param filtros Filtros de período para el reporte
   * @returns Lista de registros del estado de ganancias y pérdidas
   */
  async obtenerGananciasPerdidasClipper(
    bdClipperGPC: string,
    filtros: FiltrosGananciasPerdidasClipper
  ): Promise<ClipperEstadoGananciasYResultados[]> {
    try {
      // Validar filtros
      if (!filtros.periodoDesde || !filtros.periodoHasta) {
        throw new Error("Se requieren periodoDesde y periodoHasta");
      }

      if (filtros.periodoDesde < 1 || filtros.periodoDesde > 12) {
        throw new Error("periodoDesde debe estar entre 1 y 12");
      }

      if (filtros.periodoHasta < 1 || filtros.periodoHasta > 12) {
        throw new Error("periodoHasta debe estar entre 1 y 12");
      }

      if (filtros.periodoDesde > filtros.periodoHasta) {
        throw new Error("periodoDesde no puede ser mayor que periodoHasta");
      }

      return await this.gananciasPerdidasRepository.obtenerGananciasPerdidasClipper(
        bdClipperGPC,
        filtros
      );
    } catch (error) {
      console.error(
        "Error en GananciasPerdidasClipperService.obtenerGananciasPerdidasClipper:",
        error
      );
      throw error;
    }
  }
}
