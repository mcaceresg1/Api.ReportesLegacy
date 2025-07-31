import { Rol, RolCreate, RolUpdate } from '../entities/Rol';

export interface IRolRepository {
  findAll(): Promise<Rol[]>;
  findById(id: number): Promise<Rol | null>;
  create(rol: RolCreate): Promise<Rol>;
  update(id: number, rol: RolUpdate): Promise<Rol | null>;
  delete(id: number): Promise<boolean>;
  activate(id: number): Promise<boolean>;
  deactivate(id: number): Promise<boolean>;
  changeEstado(id: number, estado: boolean): Promise<Rol | null>;
} 