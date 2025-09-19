import {
  VentasGeneralesOficon,
  VentasGeneralesOficonRequest,
} from "../entities/VentasGeneralesOficon";

export interface IVentasGeneralesOficonService {
  generarReporteVentasGeneralesOficon(
    request: VentasGeneralesOficonRequest
  ): Promise<VentasGeneralesOficon[]>;
}
