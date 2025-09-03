import {
  DocumentosPorPagar,
  ProveedorFiltro,
  ReporteProveedor,
} from "../entities/ReporteDocumentosProveedor";

export interface IReporteDocumentosProveedorService {
  /**
   * Obtiene la lista de proveedores filtrados por un valor específico.
   *
   * @param conjunto Nombre del esquema/base de datos
   * @param filtro Filtro de búsqueda para nombre o código de proveedor
   * @returns Lista de proveedores filtrados
   */
  obtenerProveedor(
    conjunto: string,
    filtro: string
  ): Promise<ProveedorFiltro[]>;

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
    proveedor?: string | null,
    fechaInicio?: string | null,
    fechaFin?: string | null
  ): Promise<ReporteProveedor[]>;

  obtenerReporteDocumentosPorPagar(
    conjunto: string,
    proveedor?: string | null,
    fechaInicio?: string | null,
    fechaFin?: string | null
  ): Promise<DocumentosPorPagar[]>;
}
