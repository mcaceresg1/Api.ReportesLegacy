import {
  PatrimonioNetoOficon,
  PatrimonioNetoOficonRequest,
} from "../entities/PatrimonioNetoOficon";

export interface IPatrimonioNetoOficonService {
  generarReportePatrimonioNetoOficon(
    request: PatrimonioNetoOficonRequest
  ): Promise<PatrimonioNetoOficon[]>;
}
