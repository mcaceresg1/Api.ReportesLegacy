import { injectable, inject } from "inversify";
import { ILibroInventarioBalanceOficonService } from "../../domain/services/ILibroInventarioBalanceOficonService";
import { ILibroInventarioBalanceOficonRepository } from "../../domain/repositories/ILibroInventarioBalanceOficonRepository";
import {
  LibroInventarioBalanceOficon,
  LibroInventarioBalanceOficonRequest,
} from "../../domain/entities/LibroInventarioBalanceOficon";

@injectable()
export class LibroInventarioBalanceOficonService
  implements ILibroInventarioBalanceOficonService
{
  constructor(
    @inject("ILibroInventarioBalanceOficonRepository")
    private readonly libroInventarioBalanceOficonRepository: ILibroInventarioBalanceOficonRepository
  ) {}

  async generarReporteLibroInventarioBalanceOficon(
    request: LibroInventarioBalanceOficonRequest
  ): Promise<LibroInventarioBalanceOficon[]> {
    try {
      console.log(
        "🔍 LibroInventarioBalanceOficonService - Iniciando generación de reporte"
      );
      console.log("📋 Parámetros recibidos:", request);

      const result =
        await this.libroInventarioBalanceOficonRepository.generarReporteLibroInventarioBalanceOficon(
          request
        );

      console.log(
        `✅ LibroInventarioBalanceOficonService - Reporte generado exitosamente. Registros: ${result.length}`
      );
      return result;
    } catch (error) {
      console.error(
        "Error en LibroInventarioBalanceOficonService.generarReporteLibroInventarioBalanceOficon:",
        error
      );
      throw error;
    }
  }
}
