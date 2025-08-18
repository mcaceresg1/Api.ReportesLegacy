export interface ReporteCatalogoCuentasModificadas {
  CuentaContable: string;
  CuentaContableDesc: string;
  UsuarioCreacion: string;
  UsuarioCreacionDesc: string;
  FechaCreacion: Date;
  UsuarioModificacion: string;
  UsuarioModificacionDesc: string;
  FechaModificacion: Date;
}

export interface FiltrosCatalogoCuentasModificadas {
  conjunto: string;
  fechaDesde?: string;
  fechaHasta?: string;
  usuarioCreacion?: string;
  usuarioModificacion?: string;
  cuentaContable?: string;
  pagina?: number;
  registrosPorPagina?: number;
}
