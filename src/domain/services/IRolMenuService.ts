import { Menu } from '../entities/Menu';

export interface IRolMenuService {
  getAllRolMenu(): Promise<any[]>;
  createRolMenu(rolMenuData: any): Promise<any>;
  updateRolMenu(rolMenuData: any): Promise<any>;
  changeRolMenuEstado(id: number, estado: boolean): Promise<any>;
  getMenusByRolId(rolId: number): Promise<Menu[]>;
  deleteRolPermisos(rolId: number): Promise<void>;
  addRolPermisos(permisos: any[]): Promise<void>;
} 