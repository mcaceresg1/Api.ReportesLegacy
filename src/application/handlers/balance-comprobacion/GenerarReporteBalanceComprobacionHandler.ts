import { injectable, inject } from "inversify";
import { ICommandHandler } from "../../../domain/cqrs/ICommandHandler";
import { GenerarReporteBalanceComprobacionCommand } from "../../commands/balance-comprobacion/GenerarReporteBalanceComprobacionCommand";
import { IBalanceComprobacionService } from "../../../domain/services/IBalanceComprobacionService";

@injectable()
export class GenerarReporteBalanceComprobacionHandler
  implements ICommandHandler<GenerarReporteBalanceComprobacionCommand>
{
  constructor(
    @inject("IBalanceComprobacionService")
    private balanceComprobacionService: IBalanceComprobacionService
  ) {}

  async handle(
    command: GenerarReporteBalanceComprobacionCommand
  ): Promise<void> {
    console.log("Ejecutando comando GenerarReporteBalanceComprobacionCommand");

    await this.balanceComprobacionService.generarReporteBalanceComprobacion(
      command.conjunto,
      command.usuario,
      command.fechaInicio,
      command.fechaFin,
      command.contabilidad,
      command.tipoReporte
    );

    console.log(
      "Comando GenerarReporteBalanceComprobacionCommand ejecutado exitosamente"
    );
  }
}
