import { ReporteResumenAsientos } from '../entities/ReporteResumenAsientos';

export interface ResumenAsientosResponse {
  success: boolean;
  message?: string;
  data?: ReporteResumenAsientos[];
  totalRegistros?: number;
  fechaInicio?: Date;
  fechaFin?: Date;
  conjunto?: string;
}
