import {
  LibroDiarioOficon,
  LibroDiarioOficonRequest,
} from "../entities/LibroDiarioOficon";

export interface ILibroDiarioOficonRepository {
  generarReporteLibroDiarioOficon(
    request: LibroDiarioOficonRequest
  ): Promise<LibroDiarioOficon[]>;
}
