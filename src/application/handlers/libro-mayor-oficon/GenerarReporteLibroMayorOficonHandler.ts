import { ICommandHandler } from "../../../domain/cqrs/ICommandHandler";
import { GenerarReporteLibroMayorOficonCommand } from "../../commands/libro-mayor-oficon/GenerarReporteLibroMayorOficonCommand";
import { ILibroMayorOficonService } from "../../../domain/services/ILibroMayorOficonService";
import { LibroMayorOficon } from "../../../domain/entities/LibroMayorOficon";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/container/types";

@injectable()
export class GenerarReporteLibroMayorOficonHandler
  implements
    ICommandHandler<GenerarReporteLibroMayorOficonCommand, LibroMayorOficon[]>
{
  constructor(
    @inject(TYPES.ILibroMayorOficonService)
    private readonly libroMayorOficonService: ILibroMayorOficonService
  ) {}

  async handle(
    command: GenerarReporteLibroMayorOficonCommand
  ): Promise<LibroMayorOficon[]> {
    return await this.libroMayorOficonService.generarReporteLibroMayorOficon(
      command.request
    );
  }
}
