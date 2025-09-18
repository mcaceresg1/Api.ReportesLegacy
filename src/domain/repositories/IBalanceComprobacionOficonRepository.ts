import {
  BalanceComprobacionOficon,
  BalanceComprobacionOficonRequest,
} from "../entities/BalanceComprobacionOficon";

export interface IBalanceComprobacionOficonRepository {
  generarReporteBalanceComprobacionOficon(
    request: BalanceComprobacionOficonRequest
  ): Promise<BalanceComprobacionOficon[]>;
}
