import {
  BalanceComprobacionOficon,
  BalanceComprobacionOficonRequest,
} from "../entities/BalanceComprobacionOficon";

export interface IBalanceComprobacionOficonService {
  generarReporteBalanceComprobacionOficon(
    request: BalanceComprobacionOficonRequest
  ): Promise<BalanceComprobacionOficon[]>;
}
