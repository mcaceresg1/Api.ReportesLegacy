import {
  LibroMayorOficon,
  LibroMayorOficonRequest,
} from "../entities/LibroMayorOficon";

export interface ILibroMayorOficonService {
  generarReporteLibroMayorOficon(
    request: LibroMayorOficonRequest
  ): Promise<LibroMayorOficon[]>;
}
