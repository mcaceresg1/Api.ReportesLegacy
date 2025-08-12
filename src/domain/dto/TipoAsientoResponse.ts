import { TipoAsiento } from '../entities/TipoAsiento';

export interface TipoAsientoResponse {
  success: boolean;
  message?: string;
  data?: TipoAsiento[];
  totalRegistros?: number;
  conjunto?: string;
}

