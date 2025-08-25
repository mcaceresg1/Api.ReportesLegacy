import { ClipperContrato } from '../entities/ClipperContrato';

export interface IReporteClipperService {
  obtenerContratos(
    ruta: string
  ): Promise<ClipperContrato[]>;

  // obtenerReporteContratos(
  //   conjunto: string
  // ): Promise<ClipperContrato[]>;


}
