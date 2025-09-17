import { IQuery } from "../../../domain/cqrs/IQuery";
import { LibroDiarioOficonRequest } from "../../../domain/entities/LibroDiarioOficon";
import { v4 as uuid } from "uuid";

export class GetLibroDiarioOficonQuery implements IQuery {
  readonly queryId = uuid();
  readonly timestamp = new Date();

  constructor(public readonly request: LibroDiarioOficonRequest) {}
}
