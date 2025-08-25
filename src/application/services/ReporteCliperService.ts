// src/application/services/ReporteClipperService.ts
import { inject, injectable } from 'inversify';
import { ClipperContrato } from '../../domain/entities/ClipperContrato';
import { IReporteClipperRepository } from '../../domain/repositories/IReporteClipperRepository';
import { IReporteClipperService } from '../../domain/services/IReporteClipperService';

@injectable()
export class ReporteClipperService implements IReporteClipperService {
  constructor(
    @inject('IReporteClipperRepository')
    private readonly clipperRepo: IReporteClipperRepository
  ) {}

  async obtenerContratos(ruta: string): Promise<ClipperContrato[]> {
    return await this.clipperRepo.obtenerContratos(ruta);
  }
  // async obtenerReporteContratos(ruta: string): Promise<ClipperContrato[]> {
  //   return await this.clipperRepo.obtenerContratos(ruta);
  // }

}
