import { IQuery } from "../../../domain/cqrs/IQuery";
import { LibroDiarioOficonRequest } from "../../../domain/entities/LibroDiarioOficon";

export class GetLibroDiarioOficonQuery implements IQuery {
  constructor(public readonly request: LibroDiarioOficonRequest) {}
}
