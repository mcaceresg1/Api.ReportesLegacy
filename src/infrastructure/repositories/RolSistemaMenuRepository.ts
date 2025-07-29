import { injectable } from 'inversify';
import { IRolSistemaMenuRepository } from '../../domain/repositories/IRolSistemaMenuRepository';
import { RolSistemaMenu, RolSistemaMenuCreate, RolSistemaMenuUpdate } from '../../domain/entities/RolSistemaMenu';
import RolSistemaMenuModel from '../database/models/RolSistemaMenuModel';

@injectable()
export class RolSistemaMenuRepository implements IRolSistemaMenuRepository {
  async findAll(): Promise<RolSistemaMenu[]> {
    const rolSistemaMenus = await RolSistemaMenuModel.findAll({
      where: { estado: true },
      order: [['id', 'ASC']]
    });
    return rolSistemaMenus.map((rolSistemaMenu: any) => rolSistemaMenu.toJSON() as RolSistemaMenu);
  }

  async findById(id: number): Promise<RolSistemaMenu | null> {
    const rolSistemaMenu = await RolSistemaMenuModel.findByPk(id);
    return rolSistemaMenu ? rolSistemaMenu.toJSON() as RolSistemaMenu : null;
  }

  async findByRolAndSistema(rolId: number, sistemaId: number): Promise<RolSistemaMenu[]> {
    const rolSistemaMenus = await RolSistemaMenuModel.findAll({
      where: { 
        rolId,
        sistemaId,
        estado: true 
      },
      order: [['id', 'ASC']]
    });
    return rolSistemaMenus.map((rolSistemaMenu: any) => rolSistemaMenu.toJSON() as RolSistemaMenu);
  }

  async create(rolSistemaMenuData: RolSistemaMenuCreate): Promise<RolSistemaMenu> {
    const rolSistemaMenu = await RolSistemaMenuModel.create(rolSistemaMenuData);
    return rolSistemaMenu.toJSON() as RolSistemaMenu;
  }

  async update(id: number, rolSistemaMenuData: RolSistemaMenuUpdate): Promise<RolSistemaMenu | null> {
    const rolSistemaMenu = await RolSistemaMenuModel.findByPk(id);
    if (!rolSistemaMenu) return null;

    await rolSistemaMenu.update(rolSistemaMenuData);
    return rolSistemaMenu.toJSON() as RolSistemaMenu;
  }

  async delete(id: number): Promise<boolean> {
    const rolSistemaMenu = await RolSistemaMenuModel.findByPk(id);
    if (!rolSistemaMenu) return false;

    await rolSistemaMenu.update({ estado: false });
    return true;
  }
} 