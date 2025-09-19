import { EmpresaOfliplan } from "../entities/EmpresaOfliplan";

export interface IEmpresasOfliplanRepository {
  getEmpresas(): Promise<EmpresaOfliplan[]>;
}
