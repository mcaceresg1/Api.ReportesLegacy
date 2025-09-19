import {
  PatrimonioNetoOficon,
  PatrimonioNetoOficonRequest,
} from "../entities/PatrimonioNetoOficon";

export interface IPatrimonioNetoOficonRepository {
  generarReportePatrimonioNetoOficon(
    request: PatrimonioNetoOficonRequest
  ): Promise<PatrimonioNetoOficon[]>;
}
