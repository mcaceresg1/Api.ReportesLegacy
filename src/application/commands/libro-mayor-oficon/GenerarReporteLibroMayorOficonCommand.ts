import { ICommand } from "../../../domain/cqrs/ICommand";
import { v4 as uuid } from "uuid";
import { LibroMayorOficonRequest } from "../../../domain/entities/LibroMayorOficon";

export class GenerarReporteLibroMayorOficonCommand implements ICommand {
  readonly commandId = uuid();
  readonly timestamp = new Date();

  constructor(public readonly request: LibroMayorOficonRequest) {}
}
