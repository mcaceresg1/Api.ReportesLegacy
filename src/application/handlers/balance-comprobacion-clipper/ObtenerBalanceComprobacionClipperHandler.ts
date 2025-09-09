import { injectable, inject } from "inversify";
import { IQueryHandler } from "../../../domain/cqrs/IQueryHandler";
import { ObtenerBalanceComprobacionClipperQuery } from "../../queries/balance-comprobacion-clipper/ObtenerBalanceComprobacionClipperQuery";
import { IBalanceComprobacionClipperService } from "../../../domain/services/IBalanceComprobacionClipperService";
import { ClipperBalanceComprobacion } from "../../../domain/entities/BalanceCmprobacionClipper";

/**
 * Handler para la query ObtenerBalanceComprobacionClipperQuery
 * Implementa el patrón CQRS para manejar operaciones de lectura
 */
@injectable()
export class ObtenerBalanceComprobacionClipperHandler
  implements
    IQueryHandler<
      ObtenerBalanceComprobacionClipperQuery,
      ClipperBalanceComprobacion[]
    >
{
  constructor(
    @inject("IBalanceComprobacionClipperService")
    private balanceComprobacionClipperService: IBalanceComprobacionClipperService
  ) {}

  /**
   * Maneja la query para obtener el balance de comprobación clipper
   * @param query Query a manejar
   * @returns Lista de registros del balance de comprobación
   */
  async handle(
    query: ObtenerBalanceComprobacionClipperQuery
  ): Promise<ClipperBalanceComprobacion[]> {
    try {
      console.log("Ejecutando ObtenerBalanceComprobacionClipperHandler");

      // Delegar al servicio de dominio
      const resultado =
        await this.balanceComprobacionClipperService.obtenerBalanceComprobacionClipper(
          query.bdClipperGPC
        );

      console.log(
        `Balance de comprobación clipper obtenido: ${resultado.length} registros`
      );

      return resultado;
    } catch (error) {
      console.error(
        "Error en ObtenerBalanceComprobacionClipperHandler.handle:",
        error
      );
      throw error;
    }
  }
}
