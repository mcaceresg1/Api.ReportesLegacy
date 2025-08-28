import { ClipperContratoResultado } from '../../infrastructure/repositories/ReporteClipperRepository';
import { ClipperContrato, ClipperContratoDetalle } from '../entities/ClipperContrato';

export interface IReporteClipperService {
  /**
   * Obtiene todos los contratos de una ruta específica.
   * @param ruta - La ruta o sede (ej. "lurin", "parque").
   */
  obtenerContratos(ruta: string): Promise<ClipperContrato[]>;

  /**
   * Obtiene un contrato específico por número y control dentro de la ruta dada.
   * @param ruta - Sede (ej. "lurin", "parque").
   * @param contrato - Número de contrato.
   * @param control - Número de control.
   */
  obtenerContratoPorId(
    ruta: string,
    contrato: string,
    control: string
  ): Promise<ClipperContratoResultado | null>;
}
