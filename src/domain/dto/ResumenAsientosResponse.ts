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

// Tipo para crear respuestas sin propiedades undefined
export type ResumenAsientosResponseInput = {
  [K in keyof ResumenAsientosResponse]: ResumenAsientosResponse[K] extends undefined ? never : ResumenAsientosResponse[K];
};
