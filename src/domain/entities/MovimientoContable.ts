export interface MovimientoContable {
  id: number;
  cuenta: string;
  descripcion: string;
  tipo: string;
  centro_costo_id?: number;
  compania_id?: number;
  centroCosto?: {
    id: number;
    codigo: string;
    descripcion: string;
  };
  centro_costo_codigo?: string;
  centro_costo_descripcion?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MovimientoContableCreate {
  cuenta: string;
  descripcion: string;
  tipo: string;
  centro_costo_id?: number;
  compania_id?: number;
  centroCosto?: {
    id: number;
    codigo: string;
    descripcion: string;
  };
}

export interface MovimientoContableUpdate {
  id: number;
  cuenta?: string;
  descripcion?: string;
  tipo?: string;
  centro_costo_id?: number;
  compania_id?: number;
  centroCosto?: {
    id: number;
    codigo: string;
    descripcion: string;
  };
}

export interface MovimientoContableFilter {
  compania_id?: number;
  tipo?: string;
  cuenta?: string;
  descripcion?: string;
  centro_costo_id?: number;
  centro_costo_codigo?: string;
  centro_costo_descripcion?: string;
  periodoDesde?: string;
  periodoHasta?: string;
} 