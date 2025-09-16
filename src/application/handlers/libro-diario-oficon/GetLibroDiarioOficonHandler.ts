import { IQueryHandler } from "../../../domain/cqrs/IQueryHandler";
import { GetLibroDiarioOficonQuery } from "../../queries/libro-diario-oficon/GetLibroDiarioOficonQuery";
import { ILibroDiarioOficonService } from "../../../domain/services/ILibroDiarioOficonService";
import { LibroDiarioOficonResponse } from "../../../domain/entities/LibroDiarioOficon";

export class GetLibroDiarioOficonHandler
  implements IQueryHandler<GetLibroDiarioOficonQuery>
{
  constructor(
    private readonly libroDiarioOficonService: ILibroDiarioOficonService
  ) {}

  async execute(
    query: GetLibroDiarioOficonQuery
  ): Promise<LibroDiarioOficonResponse> {
    return await this.libroDiarioOficonService.generarReporteLibroDiarioOficon(
      query.request
    );
  }
}
