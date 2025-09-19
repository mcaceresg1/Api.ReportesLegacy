import { IQueryHandler } from "../../../domain/cqrs/IQueryHandler";
import { GetPlanillaAnualizadaOfliplanQuery } from "../../queries/planilla-anualizada-ofliplan/GetPlanillaAnualizadaOfliplanQuery";
import { IPlanillaAnualizadaOfliplanService } from "../../../domain/services/IPlanillaAnualizadaOfliplanService";
import { PlanillaAnualizadaOfliplan } from "../../../domain/entities/PlanillaAnualizadaOfliplan";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/container/types";

@injectable()
export class GetPlanillaAnualizadaOfliplanHandler
  implements
    IQueryHandler<
      GetPlanillaAnualizadaOfliplanQuery,
      PlanillaAnualizadaOfliplan[]
    >
{
  constructor(
    @inject(TYPES.IPlanillaAnualizadaOfliplanService)
    private readonly planillaAnualizadaOfliplanService: IPlanillaAnualizadaOfliplanService
  ) {}

  async handle(
    query: GetPlanillaAnualizadaOfliplanQuery
  ): Promise<PlanillaAnualizadaOfliplan[]> {
    return await this.planillaAnualizadaOfliplanService.generarReportePlanillaAnualizadaOfliplan(
      query.request
    );
  }
}
