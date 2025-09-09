import { injectable, inject } from "inversify";
import { IQueryHandler } from "../../../domain/cqrs/IQueryHandler";
import { GenerarLibroMayorAsientosQuery } from "../../queries/libro-mayor-asientos/GenerarLibroMayorAsientosQuery";
import { ILibroMayorAsientosService } from "../../../domain/services/ILibroMayorAsientosService";
import { LibroMayorAsientosResponse } from "../../../domain/entities/LibroMayorAsientos";

@injectable()
export class GenerarLibroMayorAsientosHandler
  implements IQueryHandler<GenerarLibroMayorAsientosQuery, LibroMayorAsientosResponse>
{
  constructor(
    @inject("ILibroMayorAsientosService")
    private libroMayorAsientosService: ILibroMayorAsientosService
  ) {}

  async handle(
    query: GenerarLibroMayorAsientosQuery
  ): Promise<LibroMayorAsientosResponse> {
    console.log("Ejecutando query GenerarLibroMayorAsientosQuery");

    const resultado = await this.libroMayorAsientosService.generarReporte(
      query.conjunto,
      query.filtros
    );

    console.log("Query GenerarLibroMayorAsientosQuery ejecutada exitosamente");
    return resultado;
  }
}





