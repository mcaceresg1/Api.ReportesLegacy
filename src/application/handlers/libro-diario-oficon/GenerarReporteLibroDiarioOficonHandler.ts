import { ICommandHandler } from "../../../domain/cqrs/ICommandHandler";
import { GenerarReporteLibroDiarioOficonCommand } from "../../commands/libro-diario-oficon/GenerarReporteLibroDiarioOficonCommand";
import { ILibroDiarioOficonService } from "../../../domain/services/ILibroDiarioOficonService";
import { LibroDiarioOficonResponse } from "../../../domain/entities/LibroDiarioOficon";

export class GenerarReporteLibroDiarioOficonHandler
  implements ICommandHandler<GenerarReporteLibroDiarioOficonCommand>
{
  constructor(
    private readonly libroDiarioOficonService: ILibroDiarioOficonService
  ) {}

  async execute(
    command: GenerarReporteLibroDiarioOficonCommand
  ): Promise<LibroDiarioOficonResponse> {
    return await this.libroDiarioOficonService.generarReporteLibroDiarioOficon(
      command.request
    );
  }
}
