import { DataTypes, Model, Sequelize } from 'sequelize';
import { exactusSequelize } from '../config/exactus-database';

// Modelo dinámico para CENTRO_COSTO
export class CentroCostoModel extends Model {
  public CENTRO_COSTO!: string;
  public DESCRIPCION?: string;
  public ESTADO?: string;
  public TIPO?: string;
  public NIVEL?: number;
  public CENTRO_PADRE?: string;
  public USUARIO?: string;
  public FECHA_HORA?: Date;
  public USUARIO_ULT_MOD?: string;
  public FCH_HORA_ULT_MOD?: Date;
  public NoteExistsFlag?: number;
  public RecordDate?: Date;
  public RowPointer?: string;
  public CreatedBy?: string;
  public UpdatedBy?: string;
  public CreateDate?: Date;
}

// Modelo dinámico para CUENTA_CONTABLE
export class CuentaContableModel extends Model {
  public CUENTA_CONTABLE!: string;
  public SECCION_CUENTA?: string;
  public UNIDAD?: string;
  public DESCRIPCION?: string;
  public TIPO?: string;
  public TIPO_DETALLADO?: string;
  public TIPO_OAF?: string;
  public SALDO_NORMAL?: string;
  public CONVERSION?: string;
  public TIPO_CAMBIO?: string;
  public ACEPTA_DATOS?: boolean;
  public CONSOLIDA?: boolean;
  public USA_CENTRO_COSTO?: boolean;
  public NOTAS?: string;
  public USUARIO?: string;
  public FECHA_HORA?: Date;
  public USUARIO_ULT_MOD?: string;
  public FCH_HORA_ULT_MOD?: Date;
  public ACEPTA_UNIDADES?: boolean;
  public USO_RESTRINGIDO?: boolean;
  public ORIGEN_CONVERSION?: string;
  public NoteExistsFlag?: number;
  public RecordDate?: Date;
  public RowPointer?: string;
  public CreatedBy?: string;
  public UpdatedBy?: string;
  public CreateDate?: Date;
  public RUBRO_FLUJO_DEBITO?: string;
  public RUBRO_FLUJO_CREDITO?: string;
  public INCLUIR_REP_CP?: boolean;
  public INCLUIR_REP_CB?: boolean;
  public ENTIDAD_FINANCIERA_CB?: string;
  public INCLUIR_REP_CC?: boolean;
  public VALIDA_PRESUP_CR?: boolean;
  public CUENTA_PDT?: string;
  public PARTE_SIGNIFICATIVA_PDT?: string;
  public CUENTA_IFRS?: string;
  public USA_CONTA_ELECTRO?: boolean;
  public VERSION?: string;
  public FECHA_INI_CE?: Date;
  public FECHA_FIN_CE?: Date;
  public COD_AGRUPADOR?: string;
  public DESC_COD_AGRUP?: string;
  public SUB_CTA_DE?: string;
  public DESC_SUB_CTA?: string;
  public NIVEL?: number;
  public MANEJA_TERCERO?: boolean;
  public DESCRIPCION_IFRS?: string;
}

// Factory para crear modelos dinámicos basados en el conjunto
export class DynamicModelFactory {
  private static centroCostoModelCache = new Map<string, typeof CentroCostoModel>();
  private static cuentaContableModelCache = new Map<string, typeof CuentaContableModel>();

  static createCentroCostoModel(conjunto: string): typeof CentroCostoModel {
    // Verificar si el modelo ya está inicializado para este conjunto
    if (this.centroCostoModelCache.has(conjunto)) {
      return this.centroCostoModelCache.get(conjunto)!;
    }

    // Crear una nueva instancia del modelo para este conjunto
    const modelName = `CentroCosto_${conjunto}`;
    const CentroCostoModelForConjunto = class extends CentroCostoModel {
      static override get tableName() {
        return 'CENTRO_COSTO';
      }
    };

    CentroCostoModelForConjunto.init(
      {
        CENTRO_COSTO: {
          type: DataTypes.STRING(50),
          primaryKey: true,
          allowNull: false,
        },
        DESCRIPCION: DataTypes.STRING(100),
        ESTADO: DataTypes.STRING(10),
        TIPO: DataTypes.STRING(20),
        NIVEL: DataTypes.INTEGER,
        CENTRO_PADRE: DataTypes.STRING(50),
        USUARIO: DataTypes.STRING(50),
        FECHA_HORA: DataTypes.DATE,
        USUARIO_ULT_MOD: DataTypes.STRING(50),
        FCH_HORA_ULT_MOD: DataTypes.DATE,
        NoteExistsFlag: DataTypes.INTEGER,
        RecordDate: DataTypes.DATE,
        RowPointer: DataTypes.STRING(16),
        CreatedBy: DataTypes.STRING(50),
        UpdatedBy: DataTypes.STRING(50),
        CreateDate: DataTypes.DATE,
      },
      {
        sequelize: exactusSequelize,
        tableName: 'CENTRO_COSTO',
        schema: conjunto,
        timestamps: false,
        modelName: modelName,
      }
    );

    // Guardar en caché
    this.centroCostoModelCache.set(conjunto, CentroCostoModelForConjunto);
    return CentroCostoModelForConjunto;
  }

  static createCuentaContableModel(conjunto: string): typeof CuentaContableModel {
    // Verificar si el modelo ya está inicializado para este conjunto
    if (this.cuentaContableModelCache.has(conjunto)) {
      return this.cuentaContableModelCache.get(conjunto)!;
    }

    // Crear una nueva instancia del modelo para este conjunto
    const modelName = `CuentaContable_${conjunto}`;
    const CuentaContableModelForConjunto = class extends CuentaContableModel {
      static override get tableName() {
        return 'CUENTA_CONTABLE';
      }
    };

    CuentaContableModelForConjunto.init(
      {
        CUENTA_CONTABLE: {
          type: DataTypes.STRING(50),
          primaryKey: true,
          allowNull: false,
        },
        SECCION_CUENTA: DataTypes.STRING(50),
        UNIDAD: DataTypes.STRING(10),
        DESCRIPCION: DataTypes.STRING(100),
        TIPO: DataTypes.STRING(20),
        TIPO_DETALLADO: DataTypes.STRING(50),
        TIPO_OAF: DataTypes.STRING(20),
        SALDO_NORMAL: DataTypes.STRING(10),
        CONVERSION: DataTypes.STRING(10),
        TIPO_CAMBIO: DataTypes.STRING(10),
        ACEPTA_DATOS: DataTypes.BOOLEAN,
        CONSOLIDA: DataTypes.BOOLEAN,
        USA_CENTRO_COSTO: DataTypes.BOOLEAN,
        NOTAS: DataTypes.TEXT,
        USUARIO: DataTypes.STRING(50),
        FECHA_HORA: DataTypes.DATE,
        USUARIO_ULT_MOD: DataTypes.STRING(50),
        FCH_HORA_ULT_MOD: DataTypes.DATE,
        ACEPTA_UNIDADES: DataTypes.BOOLEAN,
        USO_RESTRINGIDO: DataTypes.BOOLEAN,
        ORIGEN_CONVERSION: DataTypes.STRING(20),
        NoteExistsFlag: DataTypes.INTEGER,
        RecordDate: DataTypes.DATE,
        RowPointer: DataTypes.STRING(16),
        CreatedBy: DataTypes.STRING(50),
        UpdatedBy: DataTypes.STRING(50),
        CreateDate: DataTypes.DATE,
        RUBRO_FLUJO_DEBITO: DataTypes.STRING(50),
        RUBRO_FLUJO_CREDITO: DataTypes.STRING(50),
        INCLUIR_REP_CP: DataTypes.BOOLEAN,
        INCLUIR_REP_CB: DataTypes.BOOLEAN,
        ENTIDAD_FINANCIERA_CB: DataTypes.STRING(50),
        INCLUIR_REP_CC: DataTypes.BOOLEAN,
        VALIDA_PRESUP_CR: DataTypes.BOOLEAN,
        CUENTA_PDT: DataTypes.STRING(50),
        PARTE_SIGNIFICATIVA_PDT: DataTypes.STRING(50),
        CUENTA_IFRS: DataTypes.STRING(50),
        USA_CONTA_ELECTRO: DataTypes.BOOLEAN,
        VERSION: DataTypes.STRING(20),
        FECHA_INI_CE: DataTypes.DATE,
        FECHA_FIN_CE: DataTypes.DATE,
        COD_AGRUPADOR: DataTypes.STRING(50),
        DESC_COD_AGRUP: DataTypes.STRING(100),
        SUB_CTA_DE: DataTypes.STRING(50),
        DESC_SUB_CTA: DataTypes.STRING(100),
        NIVEL: DataTypes.INTEGER,
        MANEJA_TERCERO: DataTypes.BOOLEAN,
        DESCRIPCION_IFRS: DataTypes.STRING(100),
      },
      {
        sequelize: exactusSequelize,
        tableName: 'CUENTA_CONTABLE',
        schema: conjunto,
        timestamps: false,
        modelName: modelName,
      }
    );

    // Guardar en caché
    this.cuentaContableModelCache.set(conjunto, CuentaContableModelForConjunto);
    return CuentaContableModelForConjunto;
  }
}
