import { injectable, inject } from "inversify";
import { ICommandHandler } from "../../../domain/cqrs/ICommandHandler";
import { GenerarReporteGenericoSaldosCommand } from "../../commands/reporte-generico-saldos/GenerarReporteGenericoSaldosCommand";
import { IReporteGenericoSaldosService } from "../../../domain/services/IReporteGenericoSaldosService";

@injectable()
export class GenerarReporteGenericoSaldosHandler
  implements ICommandHandler<GenerarReporteGenericoSaldosCommand>
{
  constructor(
    @inject("IReporteGenericoSaldosService")
    private reporteGenericoSaldosService: IReporteGenericoSaldosService
  ) {}

  async handle(command: GenerarReporteGenericoSaldosCommand): Promise<void> {
    await this.reporteGenericoSaldosService.generarReporteGenericoSaldos(
      command.conjunto,
      command.usuario,
      command.fechaInicio,
      command.fechaFin,
      command.contabilidad,
      command.tipoAsiento,
      command.claseAsiento
    );
  }
}
