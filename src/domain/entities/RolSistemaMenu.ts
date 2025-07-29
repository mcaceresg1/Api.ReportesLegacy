export interface RolSistemaMenu {
  id: number;
  rolId: number;
  sistemaId: number;
  menuId: number;
  estado: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RolSistemaMenuCreate {
  rolId: number;
  sistemaId: number;
  menuId: number;
  estado?: boolean;
}

export interface RolSistemaMenuUpdate {
  id: number;
  rolId?: number;
  sistemaId?: number;
  menuId?: number;
  estado?: boolean;
} 