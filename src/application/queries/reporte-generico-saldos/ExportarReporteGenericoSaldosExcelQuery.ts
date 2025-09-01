import { IQuery } from "../../../domain/cqrs/IQuery";
import { v4 as uuid } from "uuid";

export class ExportarReporteGenericoSaldosExcelQuery implements IQuery {
  readonly queryId = uuid();
  readonly timestamp = new Date();

  constructor(
    public readonly conjunto: string,
    public readonly usuario: string,
    public readonly fechaInicio: Date,
    public readonly fechaFin: Date,
    public readonly contabilidad: string = "F,A",
    public readonly tipoAsiento: string = "06",
    public readonly claseAsiento: string = "C",
    public readonly limit: number = 10000
  ) {}
}
