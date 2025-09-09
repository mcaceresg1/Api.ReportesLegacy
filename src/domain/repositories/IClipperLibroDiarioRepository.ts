import { ClipperLibroDiario } from "../entities/LibroDiarioClipper";

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface IClipperLibroDiarioRepository {
  /**
   * Obtiene todos los comprobantes del libro diario para un mes y libro determinado.
   * @param libro Código del libro contable (ej. "D", "C", etc.)
   * @param mes Mes contable en formato "MM" (ej. "12")
   * @param bdClipperGPC Nombre de la base de datos de origen (por ejemplo: "CLIPPER_GPC_EMP009")
   * @param pagination Opciones de paginación
   */
  getComprobantes(
    libro: string,
    mes: string,
    bdClipperGPC: string,
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<ClipperLibroDiario>>;

  /**
   * Obtiene los comprobantes agrupados por número de comprobante.
   * @param libro Código del libro contable
   * @param mes Mes contable
   * @param bdClipperGPC Nombre de la base de datos de origen
   * @param pagination Opciones de paginación
   */
  getComprobantesAgrupados(
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
   * Obtiene un comprobante específico por su número.
   * @param numeroComprobante Número del comprobante (ej. "D00/00001")
   * @param bdClipperGPC Nombre de la base de datos de origen
   */
  getComprobantePorNumero(
    numeroComprobante: string,
    bdClipperGPC: string
  ): Promise<ClipperLibroDiario | null>;

  /**
   * Obtiene el total de comprobantes para un libro y mes determinado.
   * @param libro Código del libro contable
   * @param mes Mes contable
   * @param bdClipperGPC Nombre de la base de datos de origen
   */
  getTotalComprobantes(
    libro: string,
    mes: string,
    bdClipperGPC: string
  ): Promise<number>;
}
