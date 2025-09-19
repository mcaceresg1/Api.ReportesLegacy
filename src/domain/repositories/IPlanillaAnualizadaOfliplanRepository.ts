import {
  PlanillaAnualizadaOfliplan,
  PlanillaAnualizadaOfliplanRequest,
} from "../entities/PlanillaAnualizadaOfliplan";

export interface IPlanillaAnualizadaOfliplanRepository {
  generarReportePlanillaAnualizadaOfliplan(
    request: PlanillaAnualizadaOfliplanRequest
  ): Promise<PlanillaAnualizadaOfliplan[]>;
}
