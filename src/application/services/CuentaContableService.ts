import { injectable, inject } from 'inversify';
import { IReporteCuentaContableModificadaRepository } from '../../domain/repositories/IReporteCuentaContableModificadaRepository';
import { ReporteCuentaContableModificada } from '../../domain/entities/ReporteCuentaContableModificada';
import { ICuentaContableService } from '../../domain/services/ICuentaContableService';

@injectable()
export class CuentaContableService implements ICuentaContableService {
  constructor(
    @inject('IReporteCuentaContableModificadaRepository') private reporteCuentaContableModificadaRepository: IReporteCuentaContableModificadaRepository
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
