import {
  PlanillaAnualizadaOfliplan,
  PlanillaAnualizadaOfliplanRequest,
} from "../entities/PlanillaAnualizadaOfliplan";

export interface IPlanillaAnualizadaOfliplanService {
  generarReportePlanillaAnualizadaOfliplan(
    request: PlanillaAnualizadaOfliplanRequest
  ): Promise<PlanillaAnualizadaOfliplan[]>;
}
