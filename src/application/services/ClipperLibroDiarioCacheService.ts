import { inject, injectable } from "inversify";
import { ICacheService } from "../../domain/services/ICacheService";
import { ClipperLibroDiario } from "../../domain/entities/LibroDiarioClipper";

@injectable()
export class ClipperLibroDiarioCacheService {
  private readonly CACHE_TTL = 300; // 5 minutos
  private readonly CACHE_PREFIX = "clipper_libro_diario";

  constructor(
    @inject("ICacheService")
    private readonly cacheService: ICacheService
  ) {}

  /**
   * Genera una clave de cache para comprobantes
   */
  private generateComprobantesKey(
    libro: string,
    mes: string,
    bdClipperGPC: string
  ): string {
    return `${this.CACHE_PREFIX}:comprobantes:${bdClipperGPC}:${libro}:${mes}`;
  }

  /**
   * Genera una clave de cache para total de comprobantes
   */
  private generateTotalComprobantesKey(
    libro: string,
    mes: string,
    bdClipperGPC: string
  ): string {
    return `${this.CACHE_PREFIX}:total:${bdClipperGPC}:${libro}:${mes}`;
  }

  /**
   * Obtiene comprobantes del cache
   */
  async getComprobantes(
    libro: string,
    mes: string,
    bdClipperGPC: string
  ): Promise<ClipperLibroDiario[] | null> {
    const key = this.generateComprobantesKey(libro, mes, bdClipperGPC);
    return await this.cacheService.get<ClipperLibroDiario[]>(key);
  }

  /**
   * Establece comprobantes en el cache
   */
  async setComprobantes(
    libro: string,
    mes: string,
    bdClipperGPC: string,
    data: ClipperLibroDiario[]
  ): Promise<void> {
    const key = this.generateComprobantesKey(libro, mes, bdClipperGPC);
    await this.cacheService.set(key, data, this.CACHE_TTL);
  }

  /**
   * Obtiene total de comprobantes del cache
   */
  async getTotalComprobantes(
    libro: string,
    mes: string,
    bdClipperGPC: string
  ): Promise<number | null> {
    const key = this.generateTotalComprobantesKey(libro, mes, bdClipperGPC);
    return await this.cacheService.get<number>(key);
  }

  /**
   * Establece total de comprobantes en el cache
   */
  async setTotalComprobantes(
    libro: string,
    mes: string,
    bdClipperGPC: string,
    total: number
  ): Promise<void> {
    const key = this.generateTotalComprobantesKey(libro, mes, bdClipperGPC);
    await this.cacheService.set(key, total, this.CACHE_TTL);
  }

  /**
   * Invalida el cache para un libro y mes específico
   */
  async invalidateCache(
    libro: string,
    mes: string,
    bdClipperGPC: string
  ): Promise<void> {
    const pattern = `${this.CACHE_PREFIX}:*:${bdClipperGPC}:${libro}:${mes}:*`;
    await this.cacheService.deletePattern(pattern);
  }

  /**
   * Invalida todo el cache del libro diario
   */
  async invalidateAllCache(): Promise<void> {
    const pattern = `${this.CACHE_PREFIX}:*`;
    await this.cacheService.deletePattern(pattern);
  }
}
