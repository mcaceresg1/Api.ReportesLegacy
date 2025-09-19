import { IQuery } from "../../../domain/cqrs/IQuery";
import {
  LibroInventarioBalanceOficonRequest,
  LibroInventarioBalanceOficon,
} from "../../../domain/entities/LibroInventarioBalanceOficon";
import { v4 as uuid } from "uuid";

export class GetLibroInventarioBalanceOficonQuery
  implements IQuery<LibroInventarioBalanceOficon[]>
{
  readonly queryId = uuid();
  readonly timestamp = new Date();

  constructor(public readonly request: LibroInventarioBalanceOficonRequest) {}
}
