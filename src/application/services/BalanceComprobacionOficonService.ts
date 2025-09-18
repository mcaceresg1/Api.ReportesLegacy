import { injectable, inject } from "inversify";
import { IBalanceComprobacionOficonService } from "../../domain/services/IBalanceComprobacionOficonService";
import { IBalanceComprobacionOficonRepository } from "../../domain/repositories/IBalanceComprobacionOficonRepository";
import {
  BalanceComprobacionOficon,
  BalanceComprobacionOficonRequest,
} from "../../domain/entities/BalanceComprobacionOficon";

@injectable()
export class BalanceComprobacionOficonService
  implements IBalanceComprobacionOficonService
{
  constructor(
    @inject("IBalanceComprobacionOficonRepository")
    private readonly balanceComprobacionOficonRepository: IBalanceComprobacionOficonRepository
  ) {}

  async generarReporteBalanceComprobacionOficon(
    request: BalanceComprobacionOficonRequest
  ): Promise<BalanceComprobacionOficon[]> {
    try {
      console.log(
        "🔍 BalanceComprobacionOficonService - Iniciando generación de reporte"
      );
      console.log("📋 Parámetros recibidos:", request);

      const result =
        await this.balanceComprobacionOficonRepository.generarReporteBalanceComprobacionOficon(
          request
        );

      console.log(
        `✅ BalanceComprobacionOficonService - Reporte generado exitosamente. Registros: ${result.length}`
      );
      return result;
    } catch (error) {
      console.error(
        "Error en BalanceComprobacionOficonService.generarReporteBalanceComprobacionOficon:",
        error
      );
      throw error;
    }
  }
}
