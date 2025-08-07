import { Rol, RolCreate, RolUpdate } from '../entities/Rol';

export interface IRolService {
  getAllRoles(): Promise<Rol[]>;
  getRolById(id: number): Promise<Rol | null>;
  createRol(rolData: RolCreate): Promise<Rol>;
  updateRol(id: number, rolData: RolUpdate): Promise<Rol>;
  deleteRol(id: number): Promise<boolean>;
  changeRolEstado(id: number, estado: boolean): Promise<Rol>;
} 