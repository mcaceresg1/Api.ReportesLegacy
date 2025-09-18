import { injectable, inject } from "inversify";
import { ILibroMayorOficonService } from "../../domain/services/ILibroMayorOficonService";
import { ILibroMayorOficonRepository } from "../../domain/repositories/ILibroMayorOficonRepository";
import {
  LibroMayorOficon,
  LibroMayorOficonRequest,
} from "../../domain/entities/LibroMayorOficon";
import { TYPES } from "../../infrastructure/container/types";

@injectable()
export class LibroMayorOficonService implements ILibroMayorOficonService {
  constructor(
    @inject(TYPES.ILibroMayorOficonRepository)
    private readonly libroMayorOficonRepository: ILibroMayorOficonRepository
  ) {}

  async generarReporteLibroMayorOficon(
    request: LibroMayorOficonRequest
  ): Promise<LibroMayorOficon[]> {
    try {
      return await this.libroMayorOficonRepository.generarReporteLibroMayorOficon(
        request
      );
    } catch (error) {
      console.error(
        "Error en LibroMayorOficonService.generarReporteLibroMayorOficon:",
        error
      );
      throw new Error(
        `Error al generar reporte de libro mayor OFICON: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }
}
