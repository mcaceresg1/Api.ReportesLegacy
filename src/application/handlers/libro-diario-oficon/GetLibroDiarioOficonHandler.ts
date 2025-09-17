import { injectable, inject } from "inversify";
import { IQueryHandler } from "../../../domain/cqrs/IQueryHandler";
import { GetLibroDiarioOficonQuery } from "../../queries/libro-diario-oficon/GetLibroDiarioOficonQuery";
import { ILibroDiarioOficonService } from "../../../domain/services/ILibroDiarioOficonService";
import { LibroDiarioOficonResponse } from "../../../domain/entities/LibroDiarioOficon";
import { TYPES } from "../../../infrastructure/container/types";

@injectable()
export class GetLibroDiarioOficonHandler
  implements
    IQueryHandler<GetLibroDiarioOficonQuery, LibroDiarioOficonResponse>
{
  constructor(
    @inject(TYPES.ILibroDiarioOficonService)
    private readonly libroDiarioOficonService: ILibroDiarioOficonService
  ) {}

  async handle(
    query: GetLibroDiarioOficonQuery
  ): Promise<LibroDiarioOficonResponse> {
    return await this.libroDiarioOficonService.generarReporteLibroDiarioOficon(
      query.request
    );
  }

  async execute(
    query: GetLibroDiarioOficonQuery
  ): Promise<LibroDiarioOficonResponse> {
    return await this.handle(query);
  }
}
