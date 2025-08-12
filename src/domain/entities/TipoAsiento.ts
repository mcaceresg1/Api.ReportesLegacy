export interface TipoAsiento {
  tipoAsiento: string;
  descripcion: string;
  noteExistsFlag: number;
  recordDate: Date;
  rowPointer: string;
  createdBy: string;
  updatedBy: string;
  createDate: Date;
}

export interface FiltrosTipoAsiento {
  tipoAsiento?: string;
  descripcion?: string;
  limit?: number;
}


