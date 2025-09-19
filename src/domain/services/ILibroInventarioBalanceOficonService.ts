import {
  LibroInventarioBalanceOficon,
  LibroInventarioBalanceOficonRequest,
} from "../entities/LibroInventarioBalanceOficon";

export interface ILibroInventarioBalanceOficonService {
  generarReporteLibroInventarioBalanceOficon(
    request: LibroInventarioBalanceOficonRequest
  ): Promise<LibroInventarioBalanceOficon[]>;
}
