import {
  RegistroComprasOficon,
  RegistroComprasOficonRequest,
} from "../entities/RegistroComprasOficon";

export interface IRegistroComprasOficonService {
  generarReporteRegistroComprasOficon(
    request: RegistroComprasOficonRequest
  ): Promise<RegistroComprasOficon[]>;
}
