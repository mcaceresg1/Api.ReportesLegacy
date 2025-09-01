import { ICommand } from "../../../domain/cqrs/ICommand";
import { v4 as uuid } from "uuid";

export class GenerarReporteGenericoSaldosCommand implements ICommand {
  readonly commandId = uuid();
  readonly timestamp = new Date();

  constructor(
    public readonly conjunto: string,
    public readonly usuario: string,
    public readonly fechaInicio: Date,
    public readonly fechaFin: Date,
    public readonly contabilidad: string = "F,A",
    public readonly tipoAsiento: string = "06",
    public readonly claseAsiento: string = "C"
  ) {}
}
