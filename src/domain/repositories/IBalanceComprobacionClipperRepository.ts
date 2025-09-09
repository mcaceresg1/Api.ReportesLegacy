import { ClipperBalanceComprobacion } from "../entities/BalanceCmprobacionClipper";

/**
 * Interfaz del repositorio para Balance de Comprobación Clipper
 * Define los contratos para el acceso a datos del reporte de Balance de Comprobación desde Clipper
 */
export interface IBalanceComprobacionClipperRepository {
  /**
   * Obtiene los datos del Balance de Comprobación desde Clipper
   * @param bdClipperGPC Nombre de la base de datos Clipper GPC a utilizar
   * @returns Lista de registros del balance de comprobación
   */
  obtenerBalanceComprobacionClipper(
    bdClipperGPC: string
  ): Promise<ClipperBalanceComprobacion[]>;
}
