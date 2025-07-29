import { Menu, MenuCreate, MenuUpdate } from '../entities/Menu';

export interface IMenuRepository {
  findAll(): Promise<Menu[]>;
  findById(id: number): Promise<Menu | null>;
  findByRol(rolId: number): Promise<Menu[]>;
  create(menu: MenuCreate): Promise<Menu>;
  update(id: number, menu: MenuUpdate): Promise<Menu | null>;
  delete(id: number): Promise<boolean>;
  activate(id: number): Promise<boolean>;
  deactivate(id: number): Promise<boolean>;
} 