import { Rol, RolCreate, RolUpdate } from '../entities/Rol';

export interface IRolService {
  getAllRoles(): Promise<Rol[]>;
  createRol(rolData: RolCreate): Promise<Rol>;
  updateRol(rolData: RolUpdate): Promise<Rol>;
  changeRolEstado(id: number, estado: boolean): Promise<Rol>;
} 