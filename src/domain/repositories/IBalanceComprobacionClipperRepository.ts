import { ClipperBalanceComprobacion } from "../entities/BalanceCmprobacionClipper";

/**
 * Interfaz del repositorio para Balance de Comprobación Clipper
 * Define los contratos para el acceso a datos del reporte de Balance de Comprobación desde Clipper
 */
export interface IBalanceComprobacionClipperRepository {
  /**
   * Obtiene los datos del Balance de Comprobación desde Clipper
   * @param baseDatos Nombre de la base de datos Clipper a utilizar (bdclipperGPC, bdclipperGPC2, etc.)
   * @returns Lista de registros del balance de comprobación
   */
  obtenerBalanceComprobacionClipper(
    baseDatos: string
  ): Promise<ClipperBalanceComprobacion[]>;
}
