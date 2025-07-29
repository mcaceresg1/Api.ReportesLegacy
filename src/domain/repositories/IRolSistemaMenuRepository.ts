import { RolSistemaMenu, RolSistemaMenuCreate, RolSistemaMenuUpdate } from '../entities/RolSistemaMenu';

export interface IRolSistemaMenuRepository {
  findAll(): Promise<RolSistemaMenu[]>;
  findById(id: number): Promise<RolSistemaMenu | null>;
  findByRolAndSistema(rolId: number, sistemaId: number): Promise<RolSistemaMenu[]>;
  create(rolSistemaMenu: RolSistemaMenuCreate): Promise<RolSistemaMenu>;
  update(id: number, rolSistemaMenu: RolSistemaMenuUpdate): Promise<RolSistemaMenu | null>;
  delete(id: number): Promise<boolean>;
} 