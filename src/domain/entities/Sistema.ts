export interface Sistema {
  id: number;
  descripcion: string;
  estado: boolean;
}

export interface SistemaCreate {
  descripcion: string;
  estado?: boolean;
}

export interface SistemaUpdate {
  id: number;
  descripcion?: string;
  estado?: boolean;
} 