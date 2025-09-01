import { inject, injectable } from "inversify";
import { IReporteDocumentosProveedorRepository } from "../../domain/repositories/IReporteDocumentosProveedorRepository";
import { IReporteDocumentosProveedorService } from "../../domain/services/IReporteDocumentosProveedorService";
import { DocumentosPorPagar, ProveedorFiltro, ReporteProveedor } from "../../domain/entities/ReporteDocumentosProveedor";

@injectable()
export class ReporteDocumentosProveedorService implements IReporteDocumentosProveedorService {
  constructor(
    @inject("IReporteDocumentosProveedorRepository")
    private readonly proveedorRepo: IReporteDocumentosProveedorRepository
  ) {}

  /**
   * Obtiene todos los proveedores disponibles.
   */
  async obtenerProveedor(conjunto: string): Promise<ProveedorFiltro[]> {
    return await this.proveedorRepo.obtenerProveedor(conjunto);
  }

  /**
   * Obtiene el reporte de documentos de un proveedor según rango de fechas.
   *
   * @param proveedor Código del proveedor
   * @param fechaInicio Fecha inicial del reporte
   * @param fechaFin Fecha final del reporte
   */
  async obtenerReporteDocumentosPorProveedor(
    conjunto: string,
    proveedor: string,
    fechaInicio: string,
    fechaFin: string
  ): Promise<ReporteProveedor[]> {
    return await this.proveedorRepo.obtenerReporteDocumentosPorProveedor(
      conjunto,
      proveedor,
      fechaInicio,
      fechaFin
    );
  }

  async obtenerReporteDocumentosPorPagar(
    conjunto: string,
    proveedor: string,
    fechaInicio: string,
    fechaFin: string
  ): Promise<DocumentosPorPagar[]> {
    return await this.proveedorRepo.obtenerReporteDocumentosPorPagar(
      conjunto,
      proveedor,
      fechaInicio,
      fechaFin
    );
  }


}
