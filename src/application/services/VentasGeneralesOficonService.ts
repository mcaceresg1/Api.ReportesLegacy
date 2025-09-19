import { injectable, inject } from "inversify";
import { IVentasGeneralesOficonService } from "../../domain/services/IVentasGeneralesOficonService";
import { IVentasGeneralesOficonRepository } from "../../domain/repositories/IVentasGeneralesOficonRepository";
import {
  VentasGeneralesOficon,
  VentasGeneralesOficonRequest,
} from "../../domain/entities/VentasGeneralesOficon";

@injectable()
export class VentasGeneralesOficonService
  implements IVentasGeneralesOficonService
{
  constructor(
    @inject("IVentasGeneralesOficonRepository")
    private readonly ventasGeneralesOficonRepository: IVentasGeneralesOficonRepository
  ) {}

  async generarReporteVentasGeneralesOficon(
    request: VentasGeneralesOficonRequest
  ): Promise<VentasGeneralesOficon[]> {
    try {
      console.log(
        "🔍 VentasGeneralesOficonService - Iniciando generación de reporte"
      );
      console.log("📋 Parámetros recibidos:", request);

      const result =
        await this.ventasGeneralesOficonRepository.generarReporteVentasGeneralesOficon(
          request
        );

      console.log(
        `✅ VentasGeneralesOficonService - Reporte generado exitosamente. Registros: ${result.length}`
      );
      return result;
    } catch (error) {
      console.error(
        "Error en VentasGeneralesOficonService.generarReporteVentasGeneralesOficon:",
        error
      );
      throw error;
    }
  }
}
