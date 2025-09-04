import { injectable, inject } from "inversify";
import { IQueryHandler } from "../../../domain/cqrs/IQueryHandler";
import { ExportarLibroMayorAsientosExcelQuery } from "../../queries/libro-mayor-asientos/ExportarLibroMayorAsientosExcelQuery";
import { ILibroMayorAsientosService } from "../../../domain/services/ILibroMayorAsientosService";

@injectable()
export class ExportarLibroMayorAsientosExcelHandler
  implements IQueryHandler<ExportarLibroMayorAsientosExcelQuery, Buffer>
{
  constructor(
    @inject("ILibroMayorAsientosService")
    private libroMayorAsientosService: ILibroMayorAsientosService
  ) {}

  async handle(query: ExportarLibroMayorAsientosExcelQuery): Promise<Buffer> {
    console.log("Ejecutando query ExportarLibroMayorAsientosExcelQuery");

    const resultado = await this.libroMayorAsientosService.exportarExcel(
      query.conjunto,
      query.filtros
    );

    console.log("Query ExportarLibroMayorAsientosExcelQuery ejecutada exitosamente");
    return resultado;
  }
}

