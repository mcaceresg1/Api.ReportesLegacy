import { ClipperLibroDiario } from "../entities/LibroDiarioClipper";
import { ComprobanteResumen } from "../entities/ComprobanteResumen";

export interface IClipperLibroDiarioRepository {
  /**
   * Obtiene todos los comprobantes del libro diario para un mes y libro determinado.
   * @param libro Código del libro contable (ej. "D", "C", etc.)
   * @param mes Mes contable en formato "MM" (ej. "12")
   * @param bdClipperGPC Nombre de la base de datos de origen (por ejemplo: "CLIPPER_GPC_EMP009")
   */
  getComprobantes(
    libro: string,
    mes: string,
    bdClipperGPC: string
  ): Promise<ClipperLibroDiario[]>;

  /**
   * Obtiene comprobantes filtrados por clase específica.
   * @param libro Código del libro contable
   * @param mes Mes contable
   * @param bdClipperGPC Nombre de la base de datos de origen
   * @param clase Clase de comprobante a filtrar (ej. "COMPRAS", "VENTAS")
   */
  getComprobantesPorClase(
    libro: string,
    mes: string,
    bdClipperGPC: string,
    clase: string
  ): Promise<ClipperLibroDiario[]>;

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

  /**
   * Obtiene la lista de comprobantes únicos para resumen.
   * @param libro Código del libro contable
   * @param mes Mes contable
   * @param bdClipperGPC Nombre de la base de datos de origen
   */
  getComprobantesResumen(
    libro: string,
    mes: string,
    bdClipperGPC: string
  ): Promise<ComprobanteResumen[]>;
}
