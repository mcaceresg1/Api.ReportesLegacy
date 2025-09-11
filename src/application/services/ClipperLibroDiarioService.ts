// src/application/services/ClipperLibroDiarioService.ts
import { inject, injectable } from "inversify";
import { ClipperLibroDiario } from "../../domain/entities/LibroDiarioClipper";
import { ComprobanteResumen } from "../../domain/entities/ComprobanteResumen";
import { IClipperLibroDiarioService } from "../../domain/services/IClipperLibroDiarioService";
import { IClipperLibroDiarioRepository } from "../../domain/repositories/IClipperLibroDiarioRepository";
import { ClipperLibroDiarioCacheService } from "./ClipperLibroDiarioCacheService";

@injectable()
export class ClipperLibroDiarioService implements IClipperLibroDiarioService {
  constructor(
    @inject("IClipperLibroDiarioRepository")
    private readonly clipperRepo: IClipperLibroDiarioRepository,
    @inject("ClipperLibroDiarioCacheService")
    private readonly cacheService: ClipperLibroDiarioCacheService
  ) {}

  async listarComprobantes(
    libro: string,
    mes: string,
    bdClipperGPC: string
  ): Promise<ClipperLibroDiario[]> {
    // TEMPORAL: Deshabilitar cache para forzar regeneración con campo cuenta
    console.log(
      `🔄 [SERVICE] Obteniendo comprobantes directamente de BD (cache deshabilitado): ${libro}/${mes}/${bdClipperGPC}`
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

    // TEMPORAL: No guardar en cache hasta que se confirme que funciona
    // await this.cacheService.setComprobantes(
    //   libro,
    //   mes,
    //   bdClipperGPC,
    //   result
    // );

    return result;
  }

  async listarComprobantesPorClase(
    libro: string,
    mes: string,
    bdClipperGPC: string,
    clase: string
  ): Promise<ClipperLibroDiario[]> {
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
