import { ReporteCatalogoCuentasModificadas, FiltrosCatalogoCuentasModificadas } from '../entities/ReporteCatalogoCuentasModificadas';

export interface IReporteCatalogoCuentasModificadasRepository {
  obtenerCatalogoCuentasModificadas(
    conjunto: string,
    filtros: FiltrosCatalogoCuentasModificadas
  ): Promise<ReporteCatalogoCuentasModificadas[]>;

  exportarExcel(
    conjunto: string,
    filtros: FiltrosCatalogoCuentasModificadas
  ): Promise<Buffer>;
}

