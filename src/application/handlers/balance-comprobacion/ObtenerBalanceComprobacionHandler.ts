import { injectable, inject } from "inversify";
import { IQueryHandler } from "../../../domain/cqrs/IQueryHandler";
import { ObtenerBalanceComprobacionQuery } from "../../queries/balance-comprobacion/ObtenerBalanceComprobacionQuery";
import { IBalanceComprobacionService } from "../../../domain/services/IBalanceComprobacionService";
import { BalanceComprobacionResponse } from "../../../domain/entities/BalanceComprobacion";

@injectable()
export class ObtenerBalanceComprobacionHandler
  implements
    IQueryHandler<ObtenerBalanceComprobacionQuery, BalanceComprobacionResponse>
{
  constructor(
    @inject("IBalanceComprobacionService")
    private balanceComprobacionService: IBalanceComprobacionService
  ) {}

  async handle(
    query: ObtenerBalanceComprobacionQuery
  ): Promise<BalanceComprobacionResponse> {
    console.log("Ejecutando query ObtenerBalanceComprobacionQuery");

    const resultado =
      await this.balanceComprobacionService.obtenerBalanceComprobacion(
        query.filtros.conjunto,
        query.filtros
      );

    console.log("Query ObtenerBalanceComprobacionQuery ejecutada exitosamente");
    return resultado;
  }
}
