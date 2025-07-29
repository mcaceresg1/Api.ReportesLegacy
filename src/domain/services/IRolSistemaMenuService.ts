import { Menu } from '../entities/Menu';

export interface IRolSistemaMenuService {
  getMenusByRolAndSistema(rolId: number, sistemaId: number): Promise<Menu[]>;
  asignarMenusByRolAndSistema(rolId: number, sistemaId: number, menuIds: number[]): Promise<void>;
  updateAsignacionById(id: number, asignacionData: any): Promise<any>;
  getPermisosBySistema(sistemaId: number): Promise<any[]>;
} 