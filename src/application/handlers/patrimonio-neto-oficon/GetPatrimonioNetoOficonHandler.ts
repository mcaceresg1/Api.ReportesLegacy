import { IQueryHandler } from "../../../domain/cqrs/IQueryHandler";
import { GetPatrimonioNetoOficonQuery } from "../../queries/patrimonio-neto-oficon/GetPatrimonioNetoOficonQuery";
import { IPatrimonioNetoOficonService } from "../../../domain/services/IPatrimonioNetoOficonService";
import { PatrimonioNetoOficon } from "../../../domain/entities/PatrimonioNetoOficon";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/container/types";

@injectable()
export class GetPatrimonioNetoOficonHandler
  implements
    IQueryHandler<GetPatrimonioNetoOficonQuery, PatrimonioNetoOficon[]>
{
  constructor(
    @inject(TYPES.IPatrimonioNetoOficonService)
    private readonly patrimonioNetoOficonService: IPatrimonioNetoOficonService
  ) {}

  async handle(
    query: GetPatrimonioNetoOficonQuery
  ): Promise<PatrimonioNetoOficon[]> {
    return await this.patrimonioNetoOficonService.generarReportePatrimonioNetoOficon(
      query.request
    );
  }
}
