import { IQueryHandler } from "../../../domain/cqrs/IQueryHandler";
import { GetBalanceComprobacionOficonQuery } from "../../queries/balance-comprobacion-oficon/GetBalanceComprobacionOficonQuery";
import { IBalanceComprobacionOficonService } from "../../../domain/services/IBalanceComprobacionOficonService";
import { BalanceComprobacionOficon } from "../../../domain/entities/BalanceComprobacionOficon";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/container/types";

@injectable()
export class GetBalanceComprobacionOficonHandler
  implements
    IQueryHandler<
      GetBalanceComprobacionOficonQuery,
      BalanceComprobacionOficon[]
    >
{
  constructor(
    @inject(TYPES.IBalanceComprobacionOficonService)
    private readonly balanceComprobacionOficonService: IBalanceComprobacionOficonService
  ) {}

  async handle(
    query: GetBalanceComprobacionOficonQuery
  ): Promise<BalanceComprobacionOficon[]> {
    return await this.balanceComprobacionOficonService.generarReporteBalanceComprobacionOficon(
      query.request
    );
  }
}
