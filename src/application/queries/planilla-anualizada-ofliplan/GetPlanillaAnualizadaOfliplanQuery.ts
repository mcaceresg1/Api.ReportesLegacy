import { IQuery } from "../../../domain/cqrs/IQuery";
import {
  PlanillaAnualizadaOfliplanRequest,
  PlanillaAnualizadaOfliplan,
} from "../../../domain/entities/PlanillaAnualizadaOfliplan";
import { v4 as uuid } from "uuid";

export class GetPlanillaAnualizadaOfliplanQuery
  implements IQuery<PlanillaAnualizadaOfliplan[]>
{
  readonly queryId = uuid();
  readonly timestamp = new Date();

  constructor(public readonly request: PlanillaAnualizadaOfliplanRequest) {}
}
