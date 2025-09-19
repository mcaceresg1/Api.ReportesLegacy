import { IQueryHandler } from "../../../domain/cqrs/IQueryHandler";
import { GetLibroInventarioBalanceOficonQuery } from "../../queries/libro-inventario-balance-oficon/GetLibroInventarioBalanceOficonQuery";
import { ILibroInventarioBalanceOficonService } from "../../../domain/services/ILibroInventarioBalanceOficonService";
import { LibroInventarioBalanceOficon } from "../../../domain/entities/LibroInventarioBalanceOficon";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/container/types";

@injectable()
export class GetLibroInventarioBalanceOficonHandler
  implements
    IQueryHandler<
      GetLibroInventarioBalanceOficonQuery,
      LibroInventarioBalanceOficon[]
    >
{
  constructor(
    @inject(TYPES.ILibroInventarioBalanceOficonService)
    private readonly libroInventarioBalanceOficonService: ILibroInventarioBalanceOficonService
  ) {}

  async handle(
    query: GetLibroInventarioBalanceOficonQuery
  ): Promise<LibroInventarioBalanceOficon[]> {
    return await this.libroInventarioBalanceOficonService.generarReporteLibroInventarioBalanceOficon(
      query.request
    );
  }
}
