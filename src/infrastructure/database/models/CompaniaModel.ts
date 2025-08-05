import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface CompaniaAttributes {
  id: number;
  codigo: string;
  nombre: string;
  titReporte1?: string;
  nomCompania?: string;
  dirCompania1?: string;
  dirCompania2?: string;
  telCompania?: string;
  titReporte2?: string;
  titReporte3?: string;
  titReporte4?: string;
  titDescrip?: string;
  linTotales?: string;
  logoCompania?: string;
  estado: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CompaniaCreationAttributes extends Optional<CompaniaAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class CompaniaModel extends Model<CompaniaAttributes, CompaniaCreationAttributes> implements CompaniaAttributes {
  public id!: number;
  public codigo!: string;
  public nombre!: string;
  public titReporte1?: string;
  public nomCompania?: string;
  public dirCompania1?: string;
  public dirCompania2?: string;
  public telCompania?: string;
  public titReporte2?: string;
  public titReporte3?: string;
  public titReporte4?: string;
  public titDescrip?: string;
  public linTotales?: string;
  public logoCompania?: string;
  public estado!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CompaniaModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    codigo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    titReporte1: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    nomCompania: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    dirCompania1: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    dirCompania2: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    telCompania: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    titReporte2: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    titReporte3: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    titReporte4: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    titDescrip: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    linTotales: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    logoCompania: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'companias',
    timestamps: true,
  }
);

export default CompaniaModel; 