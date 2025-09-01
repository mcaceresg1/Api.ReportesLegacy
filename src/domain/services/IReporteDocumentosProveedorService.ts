import { DocumentosPorPagar, ProveedorFiltro, ReporteProveedor } from "../entities/ReporteDocumentosProveedor";

export interface IReporteDocumentosProveedorService {
  /**
   * Obtiene todos los proveedores disponibles.
   * 
   * @returns Lista de proveedores
   */
  obtenerProveedor(conjunto: string): Promise<ProveedorFiltro[]>;

  /**
   * Obtiene el reporte de documentos del proveedor en un rango de fechas.
   * 
   * @param proveedor Código del proveedor
   * @param fechaInicio Fecha inicial del reporte (formato: YYYY-MM-DD)
   * @param fechaFin Fecha final del reporte (formato: YYYY-MM-DD)
   * @returns Lista de documentos del proveedor dentro del rango de fechas
   */
  obtenerReporteDocumentosPorProveedor(
    conjunto: string,
    proveedor: string,
    fechaInicio: string,
    fechaFin: string
  ): Promise<ReporteProveedor[]>;

  obtenerReporteDocumentosPorPagar(
    conjunto: string,
    proveedor: string,
    fechaInicio: string,
    fechaFin: string
  ): Promise<DocumentosPorPagar[]>;

}
