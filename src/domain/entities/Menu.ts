export interface Menu {
  id: number;
  descripcion: string;
  padreId?: number;
  icon?: string;
  ruta?: string;
  areaUsuaria?: string;
  sistemaCode?: string;
  routePath?: string;
  estado: boolean;
  hijos?: Menu[];
}

export interface MenuCreate {
  descripcion: string;
  padreId?: number;
  icon?: string;
  ruta?: string;
  areaUsuaria?: string;
  sistemaCode?: string;
  routePath?: string;
  estado?: boolean;
}

export interface MenuUpdate {
  id: number;
  descripcion?: string;
  padreId?: number;
  icon?: string;
  ruta?: string;
  areaUsuaria?: string;
  sistemaCode?: string;
  routePath?: string;
  estado?: boolean;
} 