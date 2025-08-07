import { DataTypes, Model, Sequelize } from 'sequelize';
import { exactusSequelize } from '../config/exactus-database';

// Modelo dinámico para CENTRO_COSTO
export class CentroCostoModel extends Model {
  public CENTRO_COSTO!: string;
  public DESCRIPCION?: string;
  public ACEPTA_DATOS?: boolean;
  public TIPO?: string;
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

// Modelo dinámico para REPCG_MOV_CUENTA
export class MovimientoContableModel extends Model {
  public USUARIO!: string;
  public CUENTA_CONTABLE!: string;
  public DESCRIPCION_CUENTA_CONTABLE?: string;
  public ASIENTO!: string;
  public TIPO?: string;
  public DOCUMENTO?: string;
  public REFERENCIA?: string;
  public DEBITO_LOCAL?: number;
  public DEBITO_DOLAR?: number;
  public CREDITO_LOCAL?: number;
  public CREDITO_DOLAR?: number;
  public CENTRO_COSTO?: string;
  public DESCRIPCION_CENTRO_COSTO?: string;
  public TIPO_ASIENTO?: string;
  public FECHA?: Date;
  public ACEPTA_DATOS?: boolean;
  public CONSECUTIVO?: number;
  public NIT?: string;
  public RAZON_SOCIAL?: string;
  public FUENTE?: string;
  public NOTAS?: string;
  public U_FLUJO_EFECTIVO?: string;
  public U_PATRIMONIO_NETO?: string;
  public U_REP_REF?: string;
}

// Factory para crear modelos dinámicos basados en el conjunto
export class DynamicModelFactory {
  private static centroCostoModelCache = new Map<string, typeof CentroCostoModel>();
  private static cuentaContableModelCache = new Map<string, typeof CuentaContableModel>();
  private static movimientoContableModelCache = new Map<string, typeof MovimientoContableModel>();

  // Método para limpiar el caché (útil para desarrollo)
  static clearCache(): void {
    this.centroCostoModelCache.clear();
    this.cuentaContableModelCache.clear();
    this.movimientoContableModelCache.clear();
  }

  static createCentroCostoModel(conjunto: string): typeof CentroCostoModel {
    // Verificar si el modelo ya está inicializado para este conjunto
    if (this.centroCostoModelCache.has(conjunto)) {
      return this.centroCostoModelCache.get(conjunto)!;
    }

    // Crear una nueva instancia del modelo para este conjunto
    const modelName = `CentroCosto_${conjunto}`;
    const CentroCostoModelForConjunto = class extends Model {
      public CENTRO_COSTO!: string;
      public DESCRIPCION?: string;
      public ACEPTA_DATOS?: boolean;
      public TIPO?: string;
      public NoteExistsFlag?: number;
      public RecordDate?: Date;
      public RowPointer?: string;
      public CreatedBy?: string;
      public UpdatedBy?: string;
      public CreateDate?: Date;
    };

    CentroCostoModelForConjunto.init(
      {
        CENTRO_COSTO: {
          type: DataTypes.STRING(50),
          primaryKey: true,
          allowNull: false,
        },
        DESCRIPCION: DataTypes.STRING(100),
        ACEPTA_DATOS: DataTypes.BOOLEAN,
        TIPO: DataTypes.STRING(20),
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

  static createMovimientoContableModel(conjunto: string): typeof MovimientoContableModel {
    // Verificar si el modelo ya está inicializado para este conjunto
    if (this.movimientoContableModelCache.has(conjunto)) {
      return this.movimientoContableModelCache.get(conjunto)!;
    }

    // Crear una nueva instancia del modelo para este conjunto
    const modelName = `MovimientoContable_${conjunto}`;
    const MovimientoContableModelForConjunto = class extends Model {
      public USUARIO!: string;
      public CUENTA_CONTABLE!: string;
      public DESCRIPCION_CUENTA_CONTABLE?: string;
      public ASIENTO!: string;
      public TIPO?: string;
      public DOCUMENTO?: string;
      public REFERENCIA?: string;
      public DEBITO_LOCAL?: number;
      public DEBITO_DOLAR?: number;
      public CREDITO_LOCAL?: number;
      public CREDITO_DOLAR?: number;
      public CENTRO_COSTO?: string;
      public DESCRIPCION_CENTRO_COSTO?: string;
      public TIPO_ASIENTO?: string;
      public FECHA?: Date;
      public ACEPTA_DATOS?: boolean;
      public CONSECUTIVO?: number;
      public NIT?: string;
      public RAZON_SOCIAL?: string;
      public FUENTE?: string;
      public NOTAS?: string;
      public U_FLUJO_EFECTIVO?: string;
      public U_PATRIMONIO_NETO?: string;
      public U_REP_REF?: string;
    };

    MovimientoContableModelForConjunto.init(
      {
        USUARIO: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        CUENTA_CONTABLE: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        DESCRIPCION_CUENTA_CONTABLE: DataTypes.STRING(200),
        ASIENTO: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        TIPO: DataTypes.STRING(10),
        DOCUMENTO: DataTypes.STRING(50),
        REFERENCIA: DataTypes.STRING(200),
        DEBITO_LOCAL: DataTypes.DECIMAL(18, 2),
        DEBITO_DOLAR: DataTypes.DECIMAL(18, 2),
        CREDITO_LOCAL: DataTypes.DECIMAL(18, 2),
        CREDITO_DOLAR: DataTypes.DECIMAL(18, 2),
        CENTRO_COSTO: DataTypes.STRING(50),
        DESCRIPCION_CENTRO_COSTO: DataTypes.STRING(200),
        TIPO_ASIENTO: DataTypes.STRING(50),
        FECHA: DataTypes.DATE,
        ACEPTA_DATOS: DataTypes.BOOLEAN,
        CONSECUTIVO: DataTypes.INTEGER,
        NIT: DataTypes.STRING(50),
        RAZON_SOCIAL: DataTypes.STRING(200),
        FUENTE: DataTypes.STRING(100),
        NOTAS: DataTypes.TEXT,
        U_FLUJO_EFECTIVO: DataTypes.STRING(50),
        U_PATRIMONIO_NETO: DataTypes.STRING(50),
        U_REP_REF: DataTypes.STRING(50),
      },
      {
        sequelize: exactusSequelize,
        tableName: 'REPCG_MOV_CUENTA',
        schema: conjunto,
        timestamps: false,
        modelName: modelName,
        // No usar timestamps automáticos
        createdAt: false,
        updatedAt: false,
      }
    );

    // Guardar en caché
    this.movimientoContableModelCache.set(conjunto, MovimientoContableModelForConjunto);
    return MovimientoContableModelForConjunto;
  }

  static createCuentaContableModel(conjunto: string): typeof CuentaContableModel {
    // Verificar si el modelo ya está inicializado para este conjunto
    if (this.cuentaContableModelCache.has(conjunto)) {
      return this.cuentaContableModelCache.get(conjunto)!;
    }

    // Crear una nueva instancia del modelo para este conjunto
    const modelName = `CuentaContable_${conjunto}`;
    const CuentaContableModelForConjunto = class extends Model {
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
