import {
  LibroInventarioBalanceOficon,
  LibroInventarioBalanceOficonRequest,
} from "../entities/LibroInventarioBalanceOficon";

export interface ILibroInventarioBalanceOficonRepository {
  generarReporteLibroInventarioBalanceOficon(
    request: LibroInventarioBalanceOficonRequest
  ): Promise<LibroInventarioBalanceOficon[]>;
}
