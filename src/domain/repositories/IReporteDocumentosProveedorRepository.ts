import { ProveedorFiltro, ReporteProveedor } from "../entities/ReporteDocumentosProveedor";

export interface IReporteDocumentosProveedorRepository {
  /**
   * Obtiene todos los proveedores registrados.
   */
  obtenerProveedor(conjunto: string): Promise<ProveedorFiltro[]>;

  /**
   * Obtiene el reporte de documentos del proveedor en un rango de fechas.
   * @param proveedor Código del proveedor
   * @param fechaInicio Fecha mínima del documento (formato: YYYY-MM-DD)
   * @param fechaFin Fecha máxima del documento (formato: YYYY-MM-DD)
   */
  obtenerReporteDocumentosPorProveedor(
    conjunto: string,
    proveedor: string,
    fechaInicio: string,
    fechaFin: string
  ): Promise<ReporteProveedor[]>;
}
