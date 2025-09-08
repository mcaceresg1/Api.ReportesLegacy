import { ClipperLibroDiario } from "../entities/LibroDiarioClipper";

export interface IClipperLibroDiarioRepository {
    /**
     * Obtiene todos los comprobantes del libro diario para un mes y libro determinado.
     * @param libro Código del libro contable (ej. "D", "C", etc.)
     * @param mes Mes contable en formato "MM" (ej. "12")
     */
    getComprobantes(libro: string, mes: string): Promise<ClipperLibroDiario[]>;
  
    /**
     * Obtiene los comprobantes agrupados por número de comprobante.
     * @param libro Código del libro contable
     * @param mes Mes contable
     */
    getComprobantesAgrupados(libro: string, mes: string): Promise<{
      numeroComprobante: string;
      clase: string;
      totalDebe: number;
      totalHaber: number;
      detalles: ClipperLibroDiario[];
    }[]>;
  
    /**
     * Obtiene un comprobante específico por su número.
     * @param numeroComprobante Número del comprobante (ej. "D00/00001")
     */
    getComprobantePorNumero(numeroComprobante: string): Promise<ClipperLibroDiario | null>;
  }
  