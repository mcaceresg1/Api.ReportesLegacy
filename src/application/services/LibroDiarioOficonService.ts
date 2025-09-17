import { injectable, inject } from "inversify";
import { ILibroDiarioOficonService } from "../../domain/services/ILibroDiarioOficonService";
import { ILibroDiarioOficonRepository } from "../../domain/repositories/ILibroDiarioOficonRepository";
import {
  LibroDiarioOficonRequest,
  LibroDiarioOficonResponse,
} from "../../domain/entities/LibroDiarioOficon";
import { TYPES } from "../../infrastructure/container/types";

@injectable()
export class LibroDiarioOficonService implements ILibroDiarioOficonService {
  constructor(
    @inject(TYPES.ILibroDiarioOficonRepository)
    private readonly libroDiarioOficonRepository: ILibroDiarioOficonRepository
  ) {}

  async generarReporteLibroDiarioOficon(
    request: LibroDiarioOficonRequest
  ): Promise<LibroDiarioOficonResponse> {
    try {
      // Validar parámetros de entrada
      if (!request.IDEMPRESA || !request.FECHAINI || !request.FECHAFINAL) {
        return {
          success: false,
          data: [],
          message:
            "Los parámetros IDEMPRESA, FECHAINI y FECHAFINAL son requeridos",
        };
      }

      // Validar formato de fechas
      const fechaIni = new Date(request.FECHAINI);
      const fechaFin = new Date(request.FECHAFINAL);

      if (isNaN(fechaIni.getTime()) || isNaN(fechaFin.getTime())) {
        return {
          success: false,
          data: [],
          message: "El formato de las fechas debe ser válido (YYYY-MM-DD)",
        };
      }

      if (fechaIni > fechaFin) {
        return {
          success: false,
          data: [],
          message: "La fecha inicial no puede ser mayor que la fecha final",
        };
      }

      // Generar el reporte
      const data =
        await this.libroDiarioOficonRepository.generarReporteLibroDiarioOficon(
          request
        );

      return {
        success: true,
        data,
        totalRecords: data.length,
        message: `Reporte generado exitosamente. Se encontraron ${data.length} registros.`,
      };
    } catch (error) {
      console.error(
        "Error en LibroDiarioOficonService.generarReporteLibroDiarioOficon:",
        error
      );
      return {
        success: false,
        data: [],
        message: `Error al generar el reporte: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`,
      };
    }
  }
}
