import { ClipperBalanceGeneral } from "../entities/BalanceGeneralClipper";

/**
 * Interfaz del repositorio para Balance General Clipper
 * Define los métodos para acceder a los datos del balance general desde Clipper
 */
export interface IBalanceGeneralClipperRepository {
  /**
   * Obtiene el balance general por nivel
   * @param baseDatos Nombre de la base de datos Clipper a utilizar (bdclipperGPC, bdclipperGPC2, etc.)
   * @param nivel Nivel de las cuentas contables
   * @returns Lista de registros del balance general por nivel
   */
  obtenerBalanceGeneralPorNivel(
    baseDatos: string,
    nivel: number
  ): Promise<ClipperBalanceGeneral[]>;

  /**
   * Obtiene el balance general por mes y nivel
   * @param baseDatos Nombre de la base de datos Clipper a utilizar (bdclipperGPC, bdclipperGPC2, etc.)
   * @param mes Mes contable a consultar (1-12)
   * @param nivel Nivel de las cuentas contables
   * @returns Lista de registros del balance general por mes y nivel
   */
  obtenerBalanceGeneralPorMesYNivel(
    baseDatos: string,
    mes: number,
    nivel: number
  ): Promise<ClipperBalanceGeneral[]>;
}
