export interface Rol {
  id: number;
  descripcion: string;
  descripcion_completa?: string;
  estado: boolean;
}

export interface RolCreate {
  descripcion: string;
  descripcion_completa?: string;
  estado?: boolean;
}

export interface RolUpdate {
  id: number;
  descripcion?: string;
  descripcion_completa?: string;
  estado?: boolean;
} 