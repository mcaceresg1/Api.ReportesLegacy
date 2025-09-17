import { injectable, inject } from "inversify";
import { IBalanceGeneralClipperService } from "../../domain/services/IBalanceGeneralClipperService";
import { IBalanceGeneralClipperRepository } from "../../domain/repositories/IBalanceGeneralClipperRepository";
import { ClipperBalanceGeneral } from "../../domain/entities/BalanceGeneralClipper";

@injectable()
export class BalanceGeneralClipperService
  implements IBalanceGeneralClipperService
{
  constructor(
    @inject("IBalanceGeneralClipperRepository")
    private readonly balanceGeneralClipperRepository: IBalanceGeneralClipperRepository
  ) {}

  /**
   * Obtiene el balance general por nivel
   * @param baseDatos Nombre de la base de datos Clipper a utilizar (bdclipperGPC, bdclipperGPC2, etc.)
   * @param nivel Nivel de las cuentas contables
   * @returns Lista de registros del balance general por nivel
   */
  async obtenerBalanceGeneralPorNivel(
    baseDatos: string,
    nivel: number
  ): Promise<ClipperBalanceGeneral[]> {
    try {
      // Validar parámetros
      if (!baseDatos || typeof baseDatos !== "string") {
        throw new Error("El parámetro 'baseDatos' es obligatorio");
      }

      if (!nivel || nivel < 1 || nivel > 5) {
        throw new Error("El parámetro 'nivel' debe ser un número entre 1 y 5");
      }

      console.log(
        `BalanceGeneralClipperService.obtenerBalanceGeneralPorNivel - Iniciando para baseDatos: ${baseDatos}, nivel: ${nivel}`
      );

      const resultado =
        await this.balanceGeneralClipperRepository.obtenerBalanceGeneralPorNivel(
          baseDatos,
          nivel
        );

      console.log(
        `BalanceGeneralClipperService.obtenerBalanceGeneralPorNivel - Completado: ${resultado.length} registros`
      );

      return resultado;
    } catch (error) {
      console.error(
        "Error en BalanceGeneralClipperService.obtenerBalanceGeneralPorNivel:",
        error
      );
      throw error;
    }
  }

  /**
   * Obtiene el balance general por mes y nivel
   * @param baseDatos Nombre de la base de datos Clipper a utilizar (bdclipperGPC, bdclipperGPC2, etc.)
   * @param mes Mes contable a consultar (1-12)
   * @param nivel Nivel de las cuentas contables
   * @returns Lista de registros del balance general por mes y nivel
   */
  async obtenerBalanceGeneralPorMesYNivel(
    baseDatos: string,
    mes: number,
    nivel: number
  ): Promise<ClipperBalanceGeneral[]> {
    try {
      // Validar parámetros
      if (!baseDatos || typeof baseDatos !== "string") {
        throw new Error("El parámetro 'baseDatos' es obligatorio");
      }

      if (!mes || mes < 1 || mes > 12) {
        throw new Error("El parámetro 'mes' debe ser un número entre 1 y 12");
      }

      if (!nivel || nivel < 1 || nivel > 5) {
        throw new Error("El parámetro 'nivel' debe ser un número entre 1 y 5");
      }

      console.log(
        `BalanceGeneralClipperService.obtenerBalanceGeneralPorMesYNivel - Iniciando para baseDatos: ${baseDatos}, mes: ${mes}, nivel: ${nivel}`
      );

      const resultado =
        await this.balanceGeneralClipperRepository.obtenerBalanceGeneralPorMesYNivel(
          baseDatos,
          mes,
          nivel
        );

      console.log(
        `BalanceGeneralClipperService.obtenerBalanceGeneralPorMesYNivel - Completado: ${resultado.length} registros`
      );

      return resultado;
    } catch (error) {
      console.error(
        "Error en BalanceGeneralClipperService.obtenerBalanceGeneralPorMesYNivel:",
        error
      );
      throw error;
    }
  }
}
