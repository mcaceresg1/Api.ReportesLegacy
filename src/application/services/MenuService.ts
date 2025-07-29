import { injectable, inject } from 'inversify';
import { IMenuService } from '../../domain/services/IMenuService';
import { IMenuRepository } from '../../domain/repositories/IMenuRepository';
import { Menu, MenuCreate, MenuUpdate } from '../../domain/entities/Menu';

@injectable()
export class MenuService implements IMenuService {
  constructor(
    @inject('IMenuRepository') private menuRepository: IMenuRepository
  ) {}

  async getAllMenus(): Promise<Menu[]> {
    return await this.menuRepository.findAll();
  }

  async getMenusByRolAndSistema(rolId: number, sistemaId: number): Promise<Menu[]> {
    return await this.menuRepository.findByRolAndSistema(rolId, sistemaId);
  }

  async getMenusByArea(area: string): Promise<Menu[]> {
    return await this.menuRepository.findByArea(area);
  }

  async getMenusBySistema(sistemaCode: string): Promise<Menu[]> {
    return await this.menuRepository.findBySistema(sistemaCode);
  }

  async poblarMenusDesdeTabla(): Promise<any> {
    // TODO: Implementar lógica para poblar desde tabla
    return { message: 'Menús poblados exitosamente' };
  }

  async createMenu(menuData: MenuCreate): Promise<Menu> {
    return await this.menuRepository.create(menuData);
  }

  async updateMenu(menuData: MenuUpdate): Promise<Menu> {
    if (!menuData.id) {
      throw new Error('ID del menú es requerido');
    }
    const menu = await this.menuRepository.update(menuData.id, menuData);
    if (!menu) {
      throw new Error('Menú no encontrado');
    }
    return menu;
  }

  async deleteMenu(id: number): Promise<boolean> {
    return await this.menuRepository.delete(id);
  }
} 