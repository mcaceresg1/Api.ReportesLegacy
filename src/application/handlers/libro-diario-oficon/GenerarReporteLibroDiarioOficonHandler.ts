import { injectable, inject } from "inversify";
import { ICommandHandler } from "../../../domain/cqrs/ICommandHandler";
import { GenerarReporteLibroDiarioOficonCommand } from "../../commands/libro-diario-oficon/GenerarReporteLibroDiarioOficonCommand";
import { ILibroDiarioOficonService } from "../../../domain/services/ILibroDiarioOficonService";
import { LibroDiarioOficonResponse } from "../../../domain/entities/LibroDiarioOficon";
import { TYPES } from "../../../infrastructure/container/types";

@injectable()
export class GenerarReporteLibroDiarioOficonHandler
  implements
    ICommandHandler<
      GenerarReporteLibroDiarioOficonCommand,
      LibroDiarioOficonResponse
    >
{
  constructor(
    @inject(TYPES.ILibroDiarioOficonService)
    private readonly libroDiarioOficonService: ILibroDiarioOficonService
  ) {}

  async handle(
    command: GenerarReporteLibroDiarioOficonCommand
  ): Promise<LibroDiarioOficonResponse> {
    return await this.libroDiarioOficonService.generarReporteLibroDiarioOficon(
      command.request
    );
  }

  async execute(
    command: GenerarReporteLibroDiarioOficonCommand
  ): Promise<LibroDiarioOficonResponse> {
    return await this.handle(command);
  }
}
