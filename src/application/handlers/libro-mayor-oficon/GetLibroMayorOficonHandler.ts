import { IQueryHandler } from "../../../domain/cqrs/IQueryHandler";
import { GetLibroMayorOficonQuery } from "../../queries/libro-mayor-oficon/GetLibroMayorOficonQuery";
import { ILibroMayorOficonService } from "../../../domain/services/ILibroMayorOficonService";
import { LibroMayorOficon } from "../../../domain/entities/LibroMayorOficon";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/container/types";

@injectable()
export class GetLibroMayorOficonHandler
  implements IQueryHandler<GetLibroMayorOficonQuery, LibroMayorOficon[]>
{
  constructor(
    @inject(TYPES.ILibroMayorOficonService)
    private readonly libroMayorOficonService: ILibroMayorOficonService
  ) {}

  async handle(query: GetLibroMayorOficonQuery): Promise<LibroMayorOficon[]> {
    return await this.libroMayorOficonService.generarReporteLibroMayorOficon(
      query.request
    );
  }
}
