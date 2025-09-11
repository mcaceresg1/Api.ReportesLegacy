import { ClipperLibroDiario } from "../entities/LibroDiarioClipper";
import { ComprobanteResumen } from "../entities/ComprobanteResumen";

export interface IClipperLibroDiarioService {
  /**
   * Obtiene todos los comprobantes para un libro y mes contable.
   * @param libro Código del libro contable (ej. "D", "C")
   * @param mes Mes contable (ej. "12")
   * @param bdClipperGPC Nombre de la base de datos de origen
   */
  listarComprobantes(
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
  listarComprobantesPorClase(
    libro: string,
    mes: string,
    bdClipperGPC: string,
    clase: string
  ): Promise<ClipperLibroDiario[]>;

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
