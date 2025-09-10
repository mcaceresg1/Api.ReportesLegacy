import { injectable, inject } from "inversify";
import { IQueryHandler } from "../../../domain/cqrs/IQueryHandler";
import { GenerarLibroDiarioAsientosQuery } from "../../queries/libro-diario-asientos/GenerarLibroDiarioAsientosQuery";
import { ILibroDiarioAsientosService } from "../../../domain/services/ILibroDiarioAsientosService";
import { LibroDiarioAsientos } from "../../../domain/entities/LibroDiarioAsientos";

@injectable()
export class GenerarLibroDiarioAsientosHandler
  implements IQueryHandler<GenerarLibroDiarioAsientosQuery, LibroDiarioAsientos[]>
{
  constructor(
    @inject("ILibroDiarioAsientosService")
    private libroDiarioAsientosService: ILibroDiarioAsientosService
  ) {}

  async handle(
    query: GenerarLibroDiarioAsientosQuery
  ): Promise<LibroDiarioAsientos[]> {
    console.log("Ejecutando query GenerarLibroDiarioAsientosQuery");

    const resultado = await this.libroDiarioAsientosService.generarReporte(
      query.conjunto,
      query.filtros
    );

    console.log("Query GenerarLibroDiarioAsientosQuery ejecutada exitosamente");
    return resultado;
  }
}
