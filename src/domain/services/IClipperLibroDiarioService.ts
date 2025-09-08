import { ClipperLibroDiario } from "../entities/LibroDiarioClipper";

export interface IClipperLibroDiarioService {
  /**
   * Obtiene todos los comprobantes para un libro y mes contable.
   * @param libro Código del libro contable (ej. "D", "C")
   * @param mes Mes contable (ej. "12")
   */
  listarComprobantes(libro: string, mes: string): Promise<ClipperLibroDiario[]>;

  /**
   * Obtiene comprobantes agrupados por número, incluyendo totales.
   * @param libro Código del libro contable
   * @param mes Mes contable
   */
  listarComprobantesAgrupados(libro: string, mes: string): Promise<{
    numeroComprobante: string;
    clase: string;
    totalDebe: number;
    totalHaber: number;
    detalles: ClipperLibroDiario[];
  }[]>;

  /**
   * Obtiene los totales generales del libro diario.
   * @param libro Código del libro contable
   * @param mes Mes contable
   */
  obtenerTotalesGenerales(libro: string, mes: string): Promise<{
    totalDebe: number;
    totalHaber: number;
  }>;

  /**
   * Obtiene el detalle de un comprobante específico.
   * @param numeroComprobante Número del comprobante (ej. "D00/00001")
   */
  obtenerDetalleComprobante(numeroComprobante: string): Promise<ClipperLibroDiario[]>;
}
