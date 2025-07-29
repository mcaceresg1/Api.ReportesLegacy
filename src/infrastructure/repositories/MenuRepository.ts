import { injectable } from 'inversify';
import { IMenuRepository } from '../../domain/repositories/IMenuRepository';
import { Menu, MenuCreate, MenuUpdate } from '../../domain/entities/Menu';
import MenuModel from '../database/models/MenuModel';

@injectable()
export class MenuRepository implements IMenuRepository {
  async findAll(): Promise<Menu[]> {
    const menus = await MenuModel.findAll({
      where: { estado: true },
      order: [['descripcion', 'ASC']]
    });
    return menus.map((menu: any) => menu.toJSON() as Menu);
  }

  async findById(id: number): Promise<Menu | null> {
    const menu = await MenuModel.findByPk(id);
    return menu ? menu.toJSON() as Menu : null;
  }

  async findByRolAndSistema(rolId: number, sistemaId: number): Promise<Menu[]> {
    // TODO: Implementar join con RolSistemaMenu
    const menus = await MenuModel.findAll({
      where: { estado: true },
      order: [['descripcion', 'ASC']]
    });
    return menus.map((menu: any) => menu.toJSON() as Menu);
  }

  async findByArea(area: string): Promise<Menu[]> {
    const menus = await MenuModel.findAll({
      where: { 
        areaUsuaria: area,
        estado: true 
      },
      order: [['descripcion', 'ASC']]
    });
    return menus.map((menu: any) => menu.toJSON() as Menu);
  }

  async findBySistema(sistemaCode: string): Promise<Menu[]> {
    const menus = await MenuModel.findAll({
      where: { 
        sistemaCode: sistemaCode,
        estado: true 
      },
      order: [['descripcion', 'ASC']]
    });
    return menus.map((menu: any) => menu.toJSON() as Menu);
  }

  async create(menuData: MenuCreate): Promise<Menu> {
    const menu = await MenuModel.create(menuData);
    return menu.toJSON() as Menu;
  }

  async update(id: number, menuData: MenuUpdate): Promise<Menu | null> {
    const menu = await MenuModel.findByPk(id);
    if (!menu) return null;

    await menu.update(menuData);
    return menu.toJSON() as Menu;
  }

  async delete(id: number): Promise<boolean> {
    const menu = await MenuModel.findByPk(id);
    if (!menu) return false;

    await menu.update({ estado: false });
    return true;
  }
} 