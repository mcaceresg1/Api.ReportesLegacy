import { ClipperContratoResultado } from '../../infrastructure/repositories/ReporteClipperRepository';
import { ClipperContrato, ClipperContratoDetalle } from '../entities/ClipperContrato';

export interface IReporteClipperRepository {
  /**
   * Obtiene todos los contratos por ruta (Parque, Parque1, Lurín, etc.)
   */
  obtenerContratos(ruta: string): Promise<ClipperContrato[]>;

  /**
   * Obtiene un contrato específico por número y control dentro de la ruta dada.
   * @param ruta - Sede (Parque, Lurín, etc.)
   * @param contrato - Número de contrato
   * @param control - Número de control
   */
  obtenerContratoPorId(
    ruta: string,
    contrato: string,
    control: string
  ): Promise<ClipperContratoResultado  | null>;
}
