import { ClipperBalanceGeneral } from "../entities/BalanceGeneralClipper";

/**
 * Interfaz del servicio para Balance General Clipper
 * Define los métodos de negocio para el balance general
 */
export interface IBalanceGeneralClipperService {
  /**
   * Obtiene el balance general por nivel
   * @param bdClipperGPC Nombre de la base de datos Clipper GPC
   * @param nivel Nivel de las cuentas contables
   * @returns Lista de registros del balance general por nivel
   */
  obtenerBalanceGeneralPorNivel(
    bdClipperGPC: string,
    nivel: number
  ): Promise<ClipperBalanceGeneral[]>;

  /**
   * Obtiene el balance general por mes y nivel
   * @param bdClipperGPC Nombre de la base de datos Clipper GPC
   * @param mes Mes contable a consultar (1-12)
   * @param nivel Nivel de las cuentas contables
   * @returns Lista de registros del balance general por mes y nivel
   */
  obtenerBalanceGeneralPorMesYNivel(
    bdClipperGPC: string,
    mes: number,
    nivel: number
  ): Promise<ClipperBalanceGeneral[]>;
}
