import { ReporteCuentaContableModificada } from '../entities/ReporteCuentaContableModificada';

export interface ICuentaContableService {
  generarReporteCuentasContablesModificadas(
    conjunto: string,
    fechaInicio?: Date,
    fechaFin?: Date
  ): Promise<ReporteCuentaContableModificada[]>;
}
