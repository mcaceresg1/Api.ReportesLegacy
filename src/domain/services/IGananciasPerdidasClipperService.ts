import {
  ClipperEstadoGananciasYResultados,
  FiltrosGananciasPerdidasClipper,
} from "../entities/GananciasPerdidasClipper";

/**
 * Interfaz del servicio para Ganancias y Pérdidas Clipper
 * Define los contratos para la lógica de negocio del reporte de Ganancias y Pérdidas desde Clipper
 */
export interface IGananciasPerdidasClipperService {
  /**
   * Obtiene los datos del Estado de Ganancias y Pérdidas desde Clipper
   * @param bdClipperGPC Nombre de la base de datos Clipper GPC a utilizar
   * @param filtros Filtros de período para el reporte
   * @returns Lista de registros del estado de ganancias y pérdidas
   */
  obtenerGananciasPerdidasClipper(
    bdClipperGPC: string,
    filtros: FiltrosGananciasPerdidasClipper
  ): Promise<ClipperEstadoGananciasYResultados[]>;
}
