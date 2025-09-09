// src/application/services/ClipperLibroDiarioService.ts
import { inject, injectable } from "inversify";
import { ClipperLibroDiario } from "../../domain/entities/LibroDiarioClipper";
import { IClipperLibroDiarioService } from "../../domain/services/IClipperLibroDiarioService";
import {
  IClipperLibroDiarioRepository,
  PaginationOptions,
  PaginatedResult,
} from "../../domain/repositories/IClipperLibroDiarioRepository";
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
    bdClipperGPC: string,
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<ClipperLibroDiario>> {
    const paginationOptions = pagination || { page: 1, limit: 50 };

    // Intentar obtener del cache primero
    const cached = await this.cacheService.getComprobantes(
      libro,
      mes,
      bdClipperGPC,
      paginationOptions
    );
    if (cached) {
      console.log(
        `✅ Cache hit para comprobantes: ${libro}/${mes}/${bdClipperGPC}`
      );
      return cached;
    }

    // Si no está en cache, obtener de la base de datos
    console.log(
      `🔄 Cache miss para comprobantes: ${libro}/${mes}/${bdClipperGPC}`
    );
    const result = await this.clipperRepo.getComprobantes(
      libro,
      mes,
      bdClipperGPC,
      paginationOptions
    );

    // Guardar en cache
    await this.cacheService.setComprobantes(
      libro,
      mes,
      bdClipperGPC,
      paginationOptions,
      result
    );

    return result;
  }

  async listarComprobantesAgrupados(
    libro: string,
    mes: string,
    bdClipperGPC: string,
    pagination?: PaginationOptions
  ): Promise<
    PaginatedResult<{
      numeroComprobante: string;
      clase: string;
      totalDebe: number;
      totalHaber: number;
      detalles: ClipperLibroDiario[];
    }>
  > {
    const paginationOptions = pagination || { page: 1, limit: 50 };

    // Intentar obtener del cache primero
    const cached = await this.cacheService.getComprobantesAgrupados(
      libro,
      mes,
      bdClipperGPC,
      paginationOptions
    );
    if (cached) {
      console.log(
        `✅ Cache hit para comprobantes agrupados: ${libro}/${mes}/${bdClipperGPC}`
      );
      return cached;
    }

    // Si no está en cache, obtener de la base de datos
    console.log(
      `🔄 Cache miss para comprobantes agrupados: ${libro}/${mes}/${bdClipperGPC}`
    );
    const result = await this.clipperRepo.getComprobantesAgrupados(
      libro,
      mes,
      bdClipperGPC,
      paginationOptions
    );

    // Guardar en cache
    await this.cacheService.setComprobantesAgrupados(
      libro,
      mes,
      bdClipperGPC,
      paginationOptions,
      result
    );

    return result;
  }

  async obtenerTotalesGenerales(
    libro: string,
    mes: string,
    bdClipperGPC: string
  ): Promise<{
    totalDebe: number;
    totalHaber: number;
  }> {
    // Intentar obtener del cache primero
    const cached = await this.cacheService.getTotales(libro, mes, bdClipperGPC);
    if (cached) {
      console.log(`✅ Cache hit para totales: ${libro}/${mes}/${bdClipperGPC}`);
      return cached;
    }

    // Si no está en cache, calcular totales
    console.log(`🔄 Cache miss para totales: ${libro}/${mes}/${bdClipperGPC}`);

    // Para totales, obtenemos solo los primeros 1000 registros para evitar timeout
    const pagination = { page: 1, limit: 1000 };
    const result = await this.clipperRepo.getComprobantes(
      libro,
      mes,
      bdClipperGPC,
      pagination
    );

    const totalDebe = result.data.reduce((acc, c) => acc + (c.montod || 0), 0);
    const totalHaber = result.data.reduce((acc, c) => acc + (c.montoh || 0), 0);

    const totales = { totalDebe, totalHaber };

    // Guardar en cache
    await this.cacheService.setTotales(libro, mes, bdClipperGPC, totales);

    return totales;
  }

  async obtenerDetalleComprobante(
    numeroComprobante: string,
    bdClipperGPC: string
  ): Promise<ClipperLibroDiario[]> {
    const comprobante = await this.clipperRepo.getComprobantePorNumero(
      numeroComprobante,
      bdClipperGPC
    );
    return comprobante ? [comprobante] : [];
  }
}
