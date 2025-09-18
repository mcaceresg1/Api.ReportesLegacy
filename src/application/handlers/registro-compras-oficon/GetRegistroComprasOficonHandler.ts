import { IQueryHandler } from "../../../domain/cqrs/IQueryHandler";
import { GetRegistroComprasOficonQuery } from "../../queries/registro-compras-oficon/GetRegistroComprasOficonQuery";
import { IRegistroComprasOficonService } from "../../../domain/services/IRegistroComprasOficonService";
import { RegistroComprasOficon } from "../../../domain/entities/RegistroComprasOficon";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/container/types";

@injectable()
export class GetRegistroComprasOficonHandler
  implements
    IQueryHandler<GetRegistroComprasOficonQuery, RegistroComprasOficon[]>
{
  constructor(
    @inject(TYPES.IRegistroComprasOficonService)
    private readonly registroComprasOficonService: IRegistroComprasOficonService
  ) {}

  async handle(
    query: GetRegistroComprasOficonQuery
  ): Promise<RegistroComprasOficon[]> {
    return await this.registroComprasOficonService.generarReporteRegistroComprasOficon(
      query.request
    );
  }
}
