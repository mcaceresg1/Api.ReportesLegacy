import { Menu, MenuCreate, MenuUpdate } from '../entities/Menu';

export interface IMenuService {
  getAllMenus(): Promise<Menu[]>;
  getMenusByRolAndSistema(rolId: number, sistemaId: number): Promise<Menu[]>;
  getMenusByArea(area: string): Promise<Menu[]>;
  getMenusBySistema(sistemaCode: string): Promise<Menu[]>;
  poblarMenusDesdeTabla(): Promise<any>;
  createMenu(menuData: MenuCreate): Promise<Menu>;
  updateMenu(menuData: MenuUpdate): Promise<Menu>;
  deleteMenu(id: number): Promise<boolean>;
} 