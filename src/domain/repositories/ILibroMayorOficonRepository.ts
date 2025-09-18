import {
  LibroMayorOficon,
  LibroMayorOficonRequest,
} from "../entities/LibroMayorOficon";

export interface ILibroMayorOficonRepository {
  generarReporteLibroMayorOficon(
    request: LibroMayorOficonRequest
  ): Promise<LibroMayorOficon[]>;
}
