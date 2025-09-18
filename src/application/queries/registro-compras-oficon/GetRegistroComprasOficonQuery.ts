import { IQuery } from "../../../domain/cqrs/IQuery";
import {
  RegistroComprasOficonRequest,
  RegistroComprasOficon,
} from "../../../domain/entities/RegistroComprasOficon";
import { v4 as uuid } from "uuid";

export class GetRegistroComprasOficonQuery
  implements IQuery<RegistroComprasOficon[]>
{
  readonly queryId = uuid();
  readonly timestamp = new Date();

  constructor(public readonly request: RegistroComprasOficonRequest) {}
}
