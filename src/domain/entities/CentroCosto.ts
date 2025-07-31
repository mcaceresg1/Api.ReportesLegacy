export interface CentroCosto {
  id: number;
  codigo: string;
  descripcion: string;
  activo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CentroCostoCreate {
  codigo: string;
  descripcion: string;
  activo?: boolean;
}

export interface CentroCostoUpdate {
  id: number;
  codigo?: string;
  descripcion?: string;
  activo?: boolean;
}

export interface CentroCostoFilter {
  codigo?: string;
  descripcion?: string;
  activo?: boolean;
} 