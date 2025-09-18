import { injectable, inject } from "inversify";
import { IRegistroComprasOficonService } from "../../domain/services/IRegistroComprasOficonService";
import { IRegistroComprasOficonRepository } from "../../domain/repositories/IRegistroComprasOficonRepository";
import {
  RegistroComprasOficon,
  RegistroComprasOficonRequest,
} from "../../domain/entities/RegistroComprasOficon";

@injectable()
export class RegistroComprasOficonService
  implements IRegistroComprasOficonService
{
  constructor(
    @inject("IRegistroComprasOficonRepository")
    private readonly registroComprasOficonRepository: IRegistroComprasOficonRepository
  ) {}

  async generarReporteRegistroComprasOficon(
    request: RegistroComprasOficonRequest
  ): Promise<RegistroComprasOficon[]> {
    try {
      console.log(
        "🔍 RegistroComprasOficonService - Iniciando generación de reporte"
      );
      console.log("📋 Parámetros:", request);

      const result =
        await this.registroComprasOficonRepository.generarReporteRegistroComprasOficon(
          request
        );

      console.log(
        `✅ RegistroComprasOficonService - Reporte generado exitosamente. Registros: ${result.length}`
      );
      return result;
    } catch (error) {
      console.error(
        "Error en RegistroComprasOficonService.generarReporteRegistroComprasOficon:",
        error
      );
      throw error;
    }
  }
}
