import { inject, injectable } from 'inversify';
import { IReporteMensualCuentaCentroService } from '../../domain/services/IReporteMensualCuentaCentroService';
import { IReporteMensualCuentaCentroRepository } from '../../domain/repositories/IReporteMensualCuentaCentroRepository';
import { ReporteMensualCuentaCentroItem } from '../../domain/entities/ReporteMensualCuentaCentro';

@injectable()
export class ReporteMensualCuentaCentroService implements IReporteMensualCuentaCentroService {
  constructor(
    @inject('IReporteMensualCuentaCentroRepository')
    private readonly repository: IReporteMensualCuentaCentroRepository
  ) {}

  async obtenerPorAnio(
    conjunto: string,
    anio: number,
    contabilidad: 'F' | 'A' = 'F'
  ): Promise<ReporteMensualCuentaCentroItem[]> {
    if (!conjunto) throw new Error('conjunto es requerido');
    if (!Number.isInteger(anio) || anio < 1900 || anio > 3000) {
      throw new Error('año inválido');
    }
    if (contabilidad !== 'F' && contabilidad !== 'A') {
      throw new Error('contabilidad inválida');
    }
    return this.repository.obtenerPorAnio(conjunto, anio, contabilidad);
  }

  async exportarExcel(conjunto: string, anio: number, contabilidad: 'F' | 'A'): Promise<Buffer> {
    if (!conjunto) throw new Error('conjunto es requerido');
    if (!Number.isInteger(anio) || anio < 1900 || anio > 3000) {
      throw new Error('año inválido');
    }
    if (contabilidad !== 'F' && contabilidad !== 'A') {
      throw new Error('contabilidad inválida');
    }
    return this.repository.exportarExcel(conjunto, anio, contabilidad);
  }
}
