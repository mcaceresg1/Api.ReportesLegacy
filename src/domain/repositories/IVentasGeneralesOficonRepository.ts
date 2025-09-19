import {
  VentasGeneralesOficon,
  VentasGeneralesOficonRequest,
} from "../entities/VentasGeneralesOficon";

export interface IVentasGeneralesOficonRepository {
  generarReporteVentasGeneralesOficon(
    request: VentasGeneralesOficonRequest
  ): Promise<VentasGeneralesOficon[]>;
}
