import { DataTypes, Model } from 'sequelize';
import { exactusSequelize } from '../config/exactus-database';
import { Conjunto } from '../../../domain/entities/Conjunto';

class ConjuntoModel extends Model<Conjunto> implements Conjunto {
  public CONJUNTO!: string;
  public NOMBRE!: string;
  public DIREC1?: string;
  public DIREC2?: string;
  public TELEFONO?: string;
  public LOGO?: string;
  public DOBLE_MONEDA?: boolean;
  public DOBLE_CONTABILIDAD?: boolean;
  public INVENTARIO_DOLAR?: boolean;
  public USA_LOTES?: boolean;
  public USAR_CENTROS_COSTO?: boolean;
  public CONSOLIDA?: boolean;
  public CONSOLIDADORA?: string;
  public BD_CIA_CONSOLIDAD?: string;
  public CONTA_A_CONSOLID?: boolean;
  public MISMO_CUADRO_CTB?: boolean;
  public USUARIO_ULT_MOD?: string;
  public FCH_HORA_ULT_MOD?: Date;
  public NOTAS?: string;
  public USA_UNIDADES?: boolean;
  public UNIDAD_OMISION?: string;
  public MONEDA_CONSOLIDA?: string;
  public VERSION_BD?: string;
  public USUARIO_MODIF_BD?: string;
  public FCH_HORA_MODIF_BD?: Date;
  public VERSION_INSTALAC?: string;
  public NIT?: string;
  public PAIS?: string;
  public GLN?: string;
  public UBICACION?: string;
  public IDIOMA?: string;
  public USA_SUCURSAL?: boolean;
  public MASCARA_SUCURSAL?: string;
  public DIRECCION_WEB1?: string;
  public DIRECCION_WEB2?: string;
  public NOMBRE_WEB1?: string;
  public NOMBRE_WEB2?: string;
  public DIRECCION_PAG_WEB?: string;
  public EMAIL_DOC_ELECTRONICO?: string;
  public NoteExistsFlag?: number;
  public RecordDate?: Date;
  public RowPointer?: string;
  public CreatedBy?: string;
  public UpdatedBy?: string;
  public CreateDate?: Date;
  public AGENTE_RETENCION?: boolean;
  public CODIGO_RETENCION_IGV?: string;
  public TIPO_CAMBIO_IGV?: string;
  public TIPO_INSTITUCION?: string;
  public PAIS_DIVISION?: string;
  public DIVISION_GEOGRAFICA1?: string;
  public DIVISION_GEOGRAFICA2?: string;
  public LOGO_CIA?: string;
  public ES_PRINCIPAL?: boolean;
  public REPLICA?: boolean;
  public ES_AGENTE_PERCEPCION?: boolean;
  public NUMERO_REGISTRO?: string;
  public DIREC3?: string;
  public COD_POSTAL?: string;
  public UBIGEO_EMPRESA?: string;
  public DIRECCION_COMPLETA_EMPRESA?: string;
  public URBANIZACION_EMPRESA?: string;
  public CUENTA_DETRACCION_EMPRESA?: string;
  public DIVISION_GEOGRAFICA3?: string;
  public DIVISION_GEOGRAFICA4?: string;
  public REGIMEN_FISCAL?: string;
  public COORDENADAS?: string;
  public ACTIVIDAD_COMERCIAL?: string;
  public NUMERO_REGISTRO_IVA?: string;
  public USA_CONSORCIO?: boolean;
  public TIPO_OPERACION?: string;
  public AGENTE_PERCEPCION?: boolean;
  public CALC_PERCE_SOLO_VENTA?: boolean;
  public RETENCION_CLIENTE?: boolean;
}

ConjuntoModel.init(
  {
    CONJUNTO: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: false,
    },
    NOMBRE: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    DIREC1: DataTypes.STRING(100),
    DIREC2: DataTypes.STRING(100),
    TELEFONO: DataTypes.STRING(20),
    LOGO: DataTypes.STRING(255),
    DOBLE_MONEDA: DataTypes.BOOLEAN,
    DOBLE_CONTABILIDAD: DataTypes.BOOLEAN,
    INVENTARIO_DOLAR: DataTypes.BOOLEAN,
    USA_LOTES: DataTypes.BOOLEAN,
    USAR_CENTROS_COSTO: DataTypes.BOOLEAN,
    CONSOLIDA: DataTypes.BOOLEAN,
    CONSOLIDADORA: DataTypes.STRING(50),
    BD_CIA_CONSOLIDAD: DataTypes.STRING(50),
    CONTA_A_CONSOLID: DataTypes.BOOLEAN,
    MISMO_CUADRO_CTB: DataTypes.BOOLEAN,
    USUARIO_ULT_MOD: DataTypes.STRING(50),
    FCH_HORA_ULT_MOD: DataTypes.DATE,
    NOTAS: DataTypes.TEXT,
    USA_UNIDADES: DataTypes.BOOLEAN,
    UNIDAD_OMISION: DataTypes.STRING(10),
    MONEDA_CONSOLIDA: DataTypes.STRING(10),
    VERSION_BD: DataTypes.STRING(20),
    USUARIO_MODIF_BD: DataTypes.STRING(50),
    FCH_HORA_MODIF_BD: DataTypes.DATE,
    VERSION_INSTALAC: DataTypes.STRING(20),
    NIT: DataTypes.STRING(20),
    PAIS: DataTypes.STRING(50),
    GLN: DataTypes.STRING(50),
    UBICACION: DataTypes.STRING(100),
    IDIOMA: DataTypes.STRING(10),
    USA_SUCURSAL: DataTypes.BOOLEAN,
    MASCARA_SUCURSAL: DataTypes.STRING(20),
    DIRECCION_WEB1: DataTypes.STRING(255),
    DIRECCION_WEB2: DataTypes.STRING(255),
    NOMBRE_WEB1: DataTypes.STRING(100),
    NOMBRE_WEB2: DataTypes.STRING(100),
    DIRECCION_PAG_WEB: DataTypes.STRING(255),
    EMAIL_DOC_ELECTRONICO: DataTypes.STRING(100),
    NoteExistsFlag: DataTypes.INTEGER,
    RecordDate: DataTypes.DATE,
    RowPointer: DataTypes.STRING(16),
    CreatedBy: DataTypes.STRING(50),
    UpdatedBy: DataTypes.STRING(50),
    CreateDate: DataTypes.DATE,
    AGENTE_RETENCION: DataTypes.BOOLEAN,
    CODIGO_RETENCION_IGV: DataTypes.STRING(20),
    TIPO_CAMBIO_IGV: DataTypes.STRING(20),
    TIPO_INSTITUCION: DataTypes.STRING(50),
    PAIS_DIVISION: DataTypes.STRING(50),
    DIVISION_GEOGRAFICA1: DataTypes.STRING(50),
    DIVISION_GEOGRAFICA2: DataTypes.STRING(50),
    LOGO_CIA: DataTypes.STRING(255),
    ES_PRINCIPAL: DataTypes.BOOLEAN,
    REPLICA: DataTypes.BOOLEAN,
    ES_AGENTE_PERCEPCION: DataTypes.BOOLEAN,
    NUMERO_REGISTRO: DataTypes.STRING(50),
    DIREC3: DataTypes.STRING(100),
    COD_POSTAL: DataTypes.STRING(10),
    UBIGEO_EMPRESA: DataTypes.STRING(10),
    DIRECCION_COMPLETA_EMPRESA: DataTypes.STRING(255),
    URBANIZACION_EMPRESA: DataTypes.STRING(100),
    CUENTA_DETRACCION_EMPRESA: DataTypes.STRING(20),
    DIVISION_GEOGRAFICA3: DataTypes.STRING(50),
    DIVISION_GEOGRAFICA4: DataTypes.STRING(50),
    REGIMEN_FISCAL: DataTypes.STRING(50),
    COORDENADAS: DataTypes.STRING(100),
    ACTIVIDAD_COMERCIAL: DataTypes.STRING(100),
    NUMERO_REGISTRO_IVA: DataTypes.STRING(50),
    USA_CONSORCIO: DataTypes.BOOLEAN,
    TIPO_OPERACION: DataTypes.STRING(50),
    AGENTE_PERCEPCION: DataTypes.BOOLEAN,
    CALC_PERCE_SOLO_VENTA: DataTypes.BOOLEAN,
    RETENCION_CLIENTE: DataTypes.BOOLEAN,
  },
  {
    sequelize: exactusSequelize,
    tableName: 'CONJUNTO',
    schema: 'ERPADMIN',
    timestamps: false,
  }
);

export default ConjuntoModel;
