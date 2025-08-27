// src/application/services/ReporteClipperService.ts
import { inject, injectable } from 'inversify';
import { ClipperContrato} from '../../domain/entities/ClipperContrato';
import { IReporteClipperRepository } from '../../domain/repositories/IReporteClipperRepository';
import { IReporteClipperService } from '../../domain/services/IReporteClipperService';
import { ClipperContratoResultado } from '../../infrastructure/repositories/ReporteClipperRepository';


@injectable()
export class ReporteClipperService implements IReporteClipperService {
  constructor(
    @inject('IReporteClipperRepository')
    private readonly clipperRepo: IReporteClipperRepository
  ) {}

  async obtenerContratos(ruta: string): Promise<ClipperContrato[]> {
    return await this.clipperRepo.obtenerContratos(ruta);
  }
  
  async obtenerContratoPorId(ruta: string, contrato: string, control: string): Promise<ClipperContratoResultado | null> {
    return await this.clipperRepo.obtenerContratoPorId(ruta, contrato, control);
  
  }
}
