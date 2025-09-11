// src/application/services/ClipperLibroCajaService.ts
import { inject, injectable } from "inversify";
import { ClipperLibroCaja } from "../../domain/entities/LibroCajaClipper";
import { ComprobanteResumen } from "../../domain/entities/ComprobanteResumen";
import { IClipperLibroCajaService } from "../../domain/services/IClipperLibroCajaService";
import { IClipperLibroCajaRepository } from "../../domain/repositories/IClipperLibroCajaRepository";

@injectable()
export class ClipperLibroCajaService implements IClipperLibroCajaService {
  constructor(
    @inject("IClipperLibroCajaRepository")
    private readonly clipperRepo: IClipperLibroCajaRepository
  ) {}

  async listarComprobantes(
    libro: string,
    mes: string,
    bdClipperGPC: string
  ): Promise<ClipperLibroCaja[]> {
    console.log(
      `🔄 [SERVICE] Obteniendo comprobantes de libro caja: ${libro}/${mes}/${bdClipperGPC}`
    );
    const result = await this.clipperRepo.getComprobantes(
      libro,
      mes,
      bdClipperGPC
    );

    console.log("🔍 [SERVICE] Resultado del repositorio:", {
      type: typeof result,
      isArray: Array.isArray(result),
      length: Array.isArray(result) ? result.length : "N/A",
      hasPagination:
        result && typeof result === "object" && "pagination" in result,
      firstItem: Array.isArray(result) && result.length > 0 ? result[0] : "N/A",
    });

    return result;
  }

  async listarComprobantesPorClase(
    libro: string,
    mes: string,
    bdClipperGPC: string,
    clase: string
  ): Promise<ClipperLibroCaja[]> {
    console.log(
      `🔄 [SERVICE] Obteniendo comprobantes por clase: ${libro}/${mes}/${bdClipperGPC}/${clase}`
    );

    const result = await this.clipperRepo.getComprobantesPorClase(
      libro,
      mes,
      bdClipperGPC,
      clase
    );

    console.log("🔍 [SERVICE] Resultado del repositorio por clase:", {
      type: typeof result,
      isArray: Array.isArray(result),
      length: Array.isArray(result) ? result.length : "N/A",
      clase: clase,
      firstItem: Array.isArray(result) && result.length > 0 ? result[0] : "N/A",
    });

    return result;
  }

  async listarComprobantesResumen(
    libro: string,
    mes: string,
    bdClipperGPC: string
  ): Promise<ComprobanteResumen[]> {
    console.log(
      `🔍 [SERVICE] Obteniendo comprobantes de resumen: ${libro}/${mes}/${bdClipperGPC}`
    );

    const result = await this.clipperRepo.getComprobantesResumen(
      libro,
      mes,
      bdClipperGPC
    );

    console.log(
      `✅ [SERVICE] Comprobantes de resumen obtenidos: ${result.length}`
    );
    return result;
  }
}