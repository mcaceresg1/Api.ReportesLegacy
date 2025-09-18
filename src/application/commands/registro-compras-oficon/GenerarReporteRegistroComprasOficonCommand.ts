import { ICommand } from "../../../domain/cqrs/ICommand";
import { v4 as uuid } from "uuid";
import { RegistroComprasOficonRequest } from "../../../domain/entities/RegistroComprasOficon";

export class GenerarReporteRegistroComprasOficonCommand implements ICommand {
  readonly commandId = uuid();
  readonly timestamp = new Date();

  constructor(public readonly request: RegistroComprasOficonRequest) {}
}
