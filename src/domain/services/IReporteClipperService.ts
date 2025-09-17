import { ClipperContratoResultado } from "../../infrastructure/repositories/ReporteClipperRepository";
import {
  ClipperContrato,
  ClipperContratoDetalle,
} from "../entities/ClipperContrato";

export interface IReporteClipperService {
  /**
   * Obtiene todos los contratos de una ruta específica.
   * @param ruta - La ruta o sede (ej. "lurin", "parque").
   */
  obtenerContratos(ruta: string): Promise<ClipperContrato[]>;

  /**
   * Obtiene contratos paginados por ruta
   * @param ruta - Sede (Parque, Lurín, etc.)
   * @param page - Número de página (base 0)
   * @param limit - Límite de registros por página
   * @param sortField - Campo para ordenar
   * @param sortOrder - Orden (1 ascendente, -1 descendente)
   * @param globalFilter - Filtro global de búsqueda
   */
  obtenerContratosPaginados(
    ruta: string,
    page: number,
    limit: number,
    sortField?: string,
    sortOrder?: number,
    globalFilter?: string
  ): Promise<{
    data: ClipperContrato[];
    totalRecords: number;
    page: number;
    limit: number;
  }>;

  /**
   * Obtiene un contrato específico por número y control dentro de la ruta dada.
   * @param ruta - Sede (ej. "lurin", "parque").
   * @param contrato - Número de contrato.
   * @param control - Número de control.
   */
  obtenerContratoPorId(
    ruta: string,
    contrato: string | null,
    control: string | null
  ): Promise<ClipperContratoResultado | null>;
}
