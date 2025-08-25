import { ClipperContrato } from '../entities/ClipperContrato';

export interface IReporteClipperRepository {
    obtenerContratos(ruta: string): Promise<ClipperContrato[]>;
  }