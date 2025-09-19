import { EmpresaOficon } from "../entities/EmpresaOficon";

export interface IEmpresasOficonRepository {
  getEmpresas(): Promise<EmpresaOficon[]>;
}
