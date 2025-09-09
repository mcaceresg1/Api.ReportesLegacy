// src/application/services/ClipperLibroDiarioService.ts
import { inject, injectable } from "inversify";
import { ClipperLibroDiario } from "../../domain/entities/LibroDiarioClipper";
import { IClipperLibroDiarioService } from "../../domain/services/IClipperLibroDiarioService";
import { IClipperLibroDiarioRepository } from "../../domain/repositories/IClipperLibroDiarioRepository";

@injectable()
export class ClipperLibroDiarioService implements IClipperLibroDiarioService {
  constructor(
    @inject("IClipperLibroDiarioRepository")
    private readonly clipperRepo: IClipperLibroDiarioRepository
  ) {}

  async listarComprobantes(
    libro: string,
    mes: string,
    bdClipperGPC: string
  ): Promise<ClipperLibroDiario[]> {
    return await this.clipperRepo.getComprobantes(libro, mes, bdClipperGPC);
  }

  async listarComprobantesAgrupados(
    libro: string,
    mes: string,
    bdClipperGPC: string
  ): Promise<
    {
      numeroComprobante: string;
      clase: string;
      totalDebe: number;
      totalHaber: number;
      detalles: ClipperLibroDiario[];
    }[]
  > {
    return await this.clipperRepo.getComprobantesAgrupados(
      libro,
      mes,
      bdClipperGPC
    );
  }

  async obtenerTotalesGenerales(
    libro: string,
    mes: string,
    bdClipperGPC: string
  ): Promise<{
    totalDebe: number;
    totalHaber: number;
  }> {
    const comprobantes = await this.clipperRepo.getComprobantes(
      libro,
      mes,
      bdClipperGPC
    );

    const totalDebe = comprobantes.reduce((acc, c) => acc + (c.montod || 0), 0);
    const totalHaber = comprobantes.reduce(
      (acc, c) => acc + (c.montoh || 0),
      0
    );

    return { totalDebe, totalHaber };
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
