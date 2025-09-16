import { ICommand } from "../../../domain/cqrs/ICommand";
import { v4 as uuid } from "uuid";
import { LibroDiarioOficonRequest } from "../../../domain/entities/LibroDiarioOficon";

export class GenerarReporteLibroDiarioOficonCommand implements ICommand {
  readonly commandId = uuid();
  readonly timestamp = new Date();

  constructor(public readonly request: LibroDiarioOficonRequest) {}
}
