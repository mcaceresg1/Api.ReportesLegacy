import {
  RegistroComprasOficon,
  RegistroComprasOficonRequest,
} from "../entities/RegistroComprasOficon";

export interface IRegistroComprasOficonRepository {
  generarReporteRegistroComprasOficon(
    request: RegistroComprasOficonRequest
  ): Promise<RegistroComprasOficon[]>;
}
