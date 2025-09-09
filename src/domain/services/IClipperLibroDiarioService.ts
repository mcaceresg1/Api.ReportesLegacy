import { ClipperLibroDiario } from "../entities/LibroDiarioClipper";
import {
  PaginationOptions,
  PaginatedResult,
} from "../repositories/IClipperLibroDiarioRepository";

export interface IClipperLibroDiarioService {
  /**
   * Obtiene todos los comprobantes para un libro y mes contable.
   * @param libro Código del libro contable (ej. "D", "C")
   * @param mes Mes contable (ej. "12")
   * @param bdClipperGPC Nombre de la base de datos de origen
   * @param pagination Opciones de paginación
   */
  listarComprobantes(
    libro: string,
    mes: string,
    bdClipperGPC: string,
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<ClipperLibroDiario>>;

  /**
   * Obtiene comprobantes agrupados por número, incluyendo totales.
   * @param libro Código del libro contable
   * @param mes Mes contable
   * @param bdClipperGPC Nombre de la base de datos de origen
   * @param pagination Opciones de paginación
   */
  listarComprobantesAgrupados(
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
  >;

  /**
   * Obtiene los totales generales del libro diario.
   * @param libro Código del libro contable
   * @param mes Mes contable
   * @param bdClipperGPC Nombre de la base de datos de origen
   */
  obtenerTotalesGenerales(
    libro: string,
    mes: string,
    bdClipperGPC: string
  ): Promise<{
    totalDebe: number;
    totalHaber: number;
  }>;

  /**
   * Obtiene el detalle de un comprobante específico.
   * @param numeroComprobante Número del comprobante (ej. "D00/00001")
   * @param bdClipperGPC Nombre de la base de datos de origen
   */
  obtenerDetalleComprobante(
    numeroComprobante: string,
    bdClipperGPC: string
  ): Promise<ClipperLibroDiario[]>;
}
