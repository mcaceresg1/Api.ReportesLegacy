export interface ClipperContrato {
    ContratoControl: string;
    SectorEspacio: string;
    CodigoTumba?: string;
    Cliente: string;
    Contrato: string;
    Control: string;
  }
  
  export interface ClipperContratoDetalle {
    cabecera: CabeceraContrato;
    detalleArticulo: DetalleArticulo[];
    cuentaCorriente: CuentaCorriente[];
    notasContables: NotaContable[];
    pagos: Pago[];
    comisiones: Comision[];
    factbol: Factbol[];
    sepelios: Sepelio[];
  }
  

  export interface CabeceraContrato {
    cliente?: string;             // T0.APPCLI + ' ' + T0.APMCLI + ' ' + T0.NOMCLI
    direccion?: string;           // T0.DIRCLI
    nombreEmpresa?: string;       // '' (vacío, opcional)
    direccionOficina?: string;    // T0.DIROFI
    estadoCivil?: string;         // T5.DESITM
    sexo?: string;                // T1.DESITM
    dni?: string;                 // T0.ELECLI
    pasaporteCliente?: string;    // T0.PASCLI (opcional)
    rucCliente?: string;          // T0.RUCCLI (opcional)
    codigoPostal?: string;        // T2.DESITM
    telfCliente?: string;         // T0.TE1CLI
    telfOpcional?: string;        // T0.TE3CLI (opcional)
    telCli?: string;              // T0.TE2CLI (opcional)
    fechaRecepcion?: string;      // T0.FCHPRC (fecha en string)
    sector?: string;              // T3.DESITM
    codigoSector?: string;        // T0.CODSEC
    tipoEspacioOrig?: string;     // T4.DESITM
    emailPersonal?: string;       // T0.EMAILP (opcional)
    aceptante?: string;           // T6.APPACE + ' ' + T6.APMACE + ' ' + T6.NOMACE
    direccionAceptante?: string;  // T6.DIRACE
    distritoAceptante?: string;   // T7.DESITM
    telAceptante?: string;        // T6.TELACE
    garante?: string;             // T8.APPGAR + ' ' + T8.APMGAR + ' ' + T8.NOMGAR
    direcGarante?: string;        // T8.DIRGAR  
    contratoControl: string;      // T0.NO_CONT + '/' + T0.CONTROL (requerido)
    tipo?: string;                // T3.TT00_DESC
    consejero?: string;           // T2.CODIGO + ' ' + T2.APELLIDOS + ' ' + T2.NOMBRE
    venta?: string;               // FECHA_V (fecha string)
    precio?: number;              // PRECIO
    gasto?: number;               // GASTOS
    total?: number;               // CAST(PRECIO AS FLOAT) + CAST(GASTOS AS FLOAT)
    escogido?: string;            // T0.ESCOGIDO
    letras?: string;              // T0.LETRAS
    producto?: string;            // T0.FORMA
    anulado?: string | null;      // FECHA_ANU (string o null)
  }
  

  export interface DetalleArticulo {
    articulo?: string;     // T3.ARTICULO
    desArticulo?: string;  // T3.DESCRIPC
    valorVenta?: number;   // T3.VAL_VTA
    fondo?: string;        // '' (vacío)
    canon?: number;        // T3.CANON
    igv?: number;          // ROUND(CAST(T3.VAL_VTA AS FLOAT) * (CAST(T3.IGV AS FLOAT) / 100.0), 2)
    precNeto?: number;     // T3.PRE_NET
  }
  

  export interface CuentaCorriente {
    tipoDescripcion?: string;  // TT00_DESC
    numLetra?: string;         // T4.NO_LETRA
    numSec?: string;           // T4.NO_SEC
    fecha?: string;            // T4.FECHA (fecha en string)
    monto?: number;            // CAST(MONTO AS FLOAT)
    saldo?: number;            // CAST(SALDO AS FLOAT)
    estado?: 'CANCELADO' | 'ANULADO' | null;  // CASE WHEN ESTADO...
  }
  

  export interface NotaContable {
    tipo?: string;        // T6.TT00_DESC
    numero?: string;      // T5.NUMERO
    fecha?: string;       // T5.FECHA (fecha en formato string)
    descripcion?: string; // T5.DESCRIPCIO
    importe?: number;     // CAST(T5.IMPORTE AS FLOAT)
    igv?: number;         // CAST(T5.IGV AS FLOAT)
    canon?: string;       // T5.CANON
  }
  

  export interface Pago {
    tipoDescrip?: string;   // T11.TT00_DESC
    numeroLetra?: string;   // T10.NO_LETRA
    secuencia?: string;     // T10.NO_SEC
    vencePago?: string;     // T10.VENCE + ' => ' + T10.FECHA_P (string concatenado)
    monto?: number;         // CAST(T10.MONTO AS FLOAT)
    canon?: number;         // CAST(T10.CANON AS FLOAT)
    recibo?: string;        // T10.RECIBO
  }
  
  export interface Comision {
    codVendedor?: string;      // T6.VENDEDOR
    nomVendedor?: string;      // T7.APELLIDOS + ' ' + T7.NOMBRE
    parte?: string;            // COALESCE con NRO_PARTE / NRO_PARTES en formato "X/Y"
    fechaComision?: string;    // T6.FECHA (string fecha)
    comision?: number;         // T6.COMISION (número)
    estadoComision?: string;   // T8.TT00_DESC
  }
  

  export interface Factbol {
    tipoFacBol?: string;    // TIPO
    numFacBol?: string;     // NRO_DOC
    fechaDoc?: string;      // FECHA_DOC (fecha en string)
    monedaFacBol?: string;  // MONEDA
    servicioFacBol?: string;// SERVICIO
    espacioFacBol?: string; // ESPACIO
    fondoFacBol?: string;   // FONDO
    igvFacBol?: number;     // IGV (número)
    canonFacBol?: number;   // CANON (número)
    tipocamFacBol?: string; // TIPOCA
  }
  

  export interface Sepelio {
    ordenSepelio?: string;       // T9.NUMERO
    nivelSepelio?: string;       // T9.NIVEL
    nomSepelio?: string;         // T9.APELLIDOS + ' ' + T9.NOMBRE
    fallecidoSepelio?: string;   // T9.FECHA_N (fecha en string)
    entierrosSepelio?: string;   // T9.FECHA_E (fecha en string)
    documentoSepelio?: string;   // T9.DOCUME
  }
  