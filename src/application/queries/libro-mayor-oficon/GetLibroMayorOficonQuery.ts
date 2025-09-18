import { IQuery } from "../../../domain/cqrs/IQuery";
import { LibroMayorOficonRequest } from "../../../domain/entities/LibroMayorOficon";
import { v4 as uuid } from "uuid";

export class GetLibroMayorOficonQuery implements IQuery {
  readonly queryId = uuid();
  readonly timestamp = new Date();

  constructor(public readonly request: LibroMayorOficonRequest) {}
}
