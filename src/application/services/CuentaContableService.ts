import { injectable } from 'inversify';
import { IReporteCuentaContableModificadaRepository } from '../../domain/repositories/IReporteCuentaContableModificadaRepository';
import { ReporteCuentaContableModificada } from '../../domain/entities/ReporteCuentaContableModificada';

@injectable()
export class CuentaContableService {
  constructor(
    private reporteCuentaContableModificadaRepository: IReporteCuentaContableModificadaRepository
  ) {}

  async generarReporteCuentasContablesModificadas(
    conjunto: string,
    fechaInicio?: Date,
    fechaFin?: Date
  ): Promise<ReporteCuentaContableModificada[]> {
    return await this.reporteCuentaContableModificadaRepository.obtenerCuentasContablesModificadas(
      conjunto,
      fechaInicio,
      fechaFin
    );
  }
}
