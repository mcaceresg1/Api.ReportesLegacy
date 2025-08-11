import { ReporteCuentaContableModificada } from '../entities/ReporteCuentaContableModificada';

export interface IReporteCuentaContableModificadaRepository {
  obtenerCuentasContablesModificadas(
    conjunto: string,
    fechaInicio?: Date,
    fechaFin?: Date
  ): Promise<ReporteCuentaContableModificada[]>;
}
