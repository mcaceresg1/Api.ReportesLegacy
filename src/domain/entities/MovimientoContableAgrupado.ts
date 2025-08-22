export interface MovimientoContableAgrupadoItem {
  sNombreMonLocal: string;
  sNombreMonDolar: string;
  sTituloCuenta: string;
  sCuentaContableDesc: string;
  sTituloNit: string;
  sNitNombre: string;
  sReferencia: string;
  nMontoLocal: number;
  nMontoDolar: number;
  sAsiento: string;
  sCuentaContable: string;
  sNit: string;
  dtFecha: Date;
  sFuente: string;
  sNotas: string;
  sDimension: string;
  sDimensionDesc: string;
  sQuiebre1: string;
  sQuiebre2: string;
  sQuiebre3: string;
  sQuiebreDesc1: string;
  sQuiebreDesc2: string;
  sQuiebreDesc3: string;
  ORDEN: number;
}

export interface FiltroMovimientoContableAgrupado {
  conjunto: string;
  fechaDesde: string;
  fechaHasta: string;
  contabilidad?: string[];
  cuentaContable?: string;
  nit?: string;
  dimension?: string;
  asiento?: string;
  fuente?: string;
}

export interface MovimientoContableAgrupadoResponse {
  success: boolean;
  message: string;
  data: MovimientoContableAgrupadoItem[];
  total: number;
}

export interface MovimientoContableAgrupadoCreate {
  conjunto: string;
  usuario: string;
  filtros: FiltroMovimientoContableAgrupado;
}

// Interfaces auxiliares para las consultas
export interface MovimientoContableDiario {
  cuenta_contable: string;
  descripcion: string;
  nit: string;
  razon_social: string;
  dimension: string | null;
  dimension_desc: string | null;
  fecha: Date;
  asiento: string;
  fuente: string;
  referencia: string;
  monto_local: number;
  monto_dolar: number;
  notas: string;
  orden: number;
}

export interface MovimientoContableMayor {
  cuenta_contable: string;
  descripcion: string;
  nit: string;
  razon_social: string;
  dimension: string | null;
  dimension_desc: string | null;
  fecha: Date;
  asiento: string;
  fuente: string;
  referencia: string;
  monto_local: number;
  monto_dolar: number;
  notas: string;
  orden: number;
}

export interface NitCompleto {
  NIT: string;
  RAZON_SOCIAL: string;
  ALIAS?: string;
  NOTAS?: string;
  TIPO?: string;
  NoteExistsFlag?: number;
  RecordDate?: Date;
  RowPointer?: string;
  CreatedBy?: string;
  UpdatedBy?: string;
  CreateDate?: Date;
  TIPO_DOC_IDENTIFICACION?: string;
  PRIMER_NOMBRE_PE?: string;
  SEGUNDO_NOMBRE_PE?: string;
  PRIMER_APELLIDO_PE?: string;
  SEGUNDO_APELLIDO_PE?: string;
  FECHA_NACIMIENTO?: Date;
  SEXO?: string;
  NACIONALIDAD?: string;
  TELEFONO_PE?: string;
  CORREO_ELECTRONICO?: string;
  IND_ESSALUD?: string;
  IND_DOMICILIADO?: string;
  DETALLE_DIRECCION_PE?: string;
  CUARTA_CAT?: string;
  IDENTIFICACION?: string;
  TIPO_ID_NATURAL?: string;
  SOLICITUD?: string;
  FECHA_PRES?: Date;
  MEDIO?: string;
  DIRECCION_PE?: string;
  ACTIVIDAD_PS?: string;
  CONVENIO?: string;
  TIPO_PERS?: string;
  FECHA_ULT_MODIF?: Date;
  FECHA_CREACION?: Date;
  EMPRESA_DESTACA1?: string;
  EMPRESA_DESTACA2?: string;
  DIGITO_VERIFICADOR?: string;
  ASEGURADO?: string;
  USA_REPORTE_D151?: string;
  ORIGEN?: string;
  NUMERO_DOC_NIT?: string;
  SUCURSAL?: string;
  PRIMER_NOMBRE?: string;
  SEGUNDO_NOMBRE?: string;
  PRIMER_APELLIDO?: string;
  SEGUNDO_APELLIDO?: string;
  TIPO_DOCUMENTO?: string;
  CLASE_DOCUMENTO?: string;
  DEPARTAMENTO?: string;
  MUNICIPIO?: string;
  PAIS?: string;
  EXTERIOR?: string;
  DETALLE_DIRECCION?: string;
  DIRECCION?: string;
  NATURALEZA?: string;
  ACTIVIDAD_ECONOMINA?: string;
  CORREO?: string;
  TELEFONO?: string;
  CELULAR?: string;
  ACTIVO?: string;
  TIPO_DIR_LEGAL?: string;
  TIPO_DOC_ND?: string;
  FECHA_EMISION_ELECT?: Date;
  FECHA_EMISION_ELECT_FAC?: Date;
  FECHA_EMISION_ELECT_BV?: Date;
  FECHA_EMISION_ELECT_RHP?: Date;
  PAIS_EMISOR_DOC?: string;
  COD_LDN?: string;
  DETALLE_DIRECCION2?: string;
  DIRECCION2?: string;
  CENTRO_ESSALUD?: string;
  TIPO_CONTRIBUYENTE?: string;
  NRC?: string;
  GIRO?: string;
  CATEGORIA?: string;
  DUI?: string;
  TIPO_REGIMEN?: string;
  PASAPORTE?: string;
  CARNE?: string;
  OTRO?: string;
  INF_LEGAL?: string;
  COD_POSTAL?: string;
  OBLIG_RESPON_RUT?: string;
  RESPONSABLE_RUT?: string;
  TRIBUTO_RUT?: string;
  COD_INTERNO_EMP?: string;
  CARGO?: string;
  AREA_DEPTO_SECC?: string;
  GLN?: string;
  XSLT_PERSONALIZADO?: string;
  XSLT_PERSONALIZADO_CREDITO?: string;
  UBICACION?: string;
  EMAIL_DOC_ELECTRONICO?: string;
  EMAIL_DOC_ELECTRONICO_COPIA?: string;
  DETALLAR_KITS?: string;
  ACEPTA_DOC_ELECTRONICO?: string;
}
