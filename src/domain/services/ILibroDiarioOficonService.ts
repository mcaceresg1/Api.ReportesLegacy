import {
  LibroDiarioOficon,
  LibroDiarioOficonRequest,
  LibroDiarioOficonResponse,
} from "../entities/LibroDiarioOficon";

export interface ILibroDiarioOficonService {
  generarReporteLibroDiarioOficon(
    request: LibroDiarioOficonRequest
  ): Promise<LibroDiarioOficonResponse>;
}
