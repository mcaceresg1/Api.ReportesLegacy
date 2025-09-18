import { IQuery } from "../../../domain/cqrs/IQuery";
import {
  BalanceComprobacionOficonRequest,
  BalanceComprobacionOficon,
} from "../../../domain/entities/BalanceComprobacionOficon";
import { v4 as uuid } from "uuid";

export class GetBalanceComprobacionOficonQuery
  implements IQuery<BalanceComprobacionOficon[]>
{
  readonly queryId = uuid();
  readonly timestamp = new Date();

  constructor(public readonly request: BalanceComprobacionOficonRequest) {}
}
