import { ClipperLibroCaja } from "../entities/LibroCajaClipper";
import { ComprobanteResumen } from "../entities/ComprobanteResumen";

export interface IClipperLibroCajaService {
  /**
   * Obtiene todos los comprobantes para un libro y mes contable.
   * @param libro Código del libro contable (ej. "C", "D")
   * @param mes Mes contable (ej. "12")
   * @param bdClipperGPC Nombre de la base de datos de origen
   */
  listarComprobantes(
    libro: string,
    mes: string,
    bdClipperGPC: string
  ): Promise<ClipperLibroCaja[]>;

  /**
   * Obtiene comprobantes filtrados por clase específica.
   * @param libro Código del libro contable
   * @param mes Mes contable
   * @param bdClipperGPC Nombre de la base de datos de origen
   * @param clase Clase de comprobante a filtrar (ej. "COMPRAS", "VENTAS")
   */
  listarComprobantesPorClase(
    libro: string,
    mes: string,
    bdClipperGPC: string,
    clase: string
  ): Promise<ClipperLibroCaja[]>;

  /**
   * Obtiene la lista de comprobantes únicos para resumen.
   * @param libro Código del libro contable
   * @param mes Mes contable
   * @param bdClipperGPC Nombre de la base de datos de origen
   */
  listarComprobantesResumen(
    libro: string,
    mes: string,
    bdClipperGPC: string
  ): Promise<ComprobanteResumen[]>;
}