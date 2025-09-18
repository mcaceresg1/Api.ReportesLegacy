import { ICommandHandler } from "../../../domain/cqrs/ICommandHandler";
import { GenerarReporteRegistroComprasOficonCommand } from "../../commands/registro-compras-oficon/GenerarReporteRegistroComprasOficonCommand";
import { IRegistroComprasOficonService } from "../../../domain/services/IRegistroComprasOficonService";
import { RegistroComprasOficon } from "../../../domain/entities/RegistroComprasOficon";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/container/types";

@injectable()
export class GenerarReporteRegistroComprasOficonHandler
  implements
    ICommandHandler<
      GenerarReporteRegistroComprasOficonCommand,
      RegistroComprasOficon[]
    >
{
  constructor(
    @inject(TYPES.IRegistroComprasOficonService)
    private readonly registroComprasOficonService: IRegistroComprasOficonService
  ) {}

  async handle(
    command: GenerarReporteRegistroComprasOficonCommand
  ): Promise<RegistroComprasOficon[]> {
    return await this.registroComprasOficonService.generarReporteRegistroComprasOficon(
      command.request
    );
  }
}
