import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface CentroCostoAttributes {
  id: number;
  codigo: string;
  descripcion: string;
  activo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CentroCostoCreationAttributes extends Optional<CentroCostoAttributes, 'id'> {}

export class CentroCostoModel extends Model<CentroCostoAttributes, CentroCostoCreationAttributes> implements CentroCostoAttributes {
  public id!: number;
  public codigo!: string;
  public descripcion!: string;
  public activo!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CentroCostoModel.init(
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
      validate: {
        notEmpty: true,
        len: [1, 20]
      }
    },
    descripcion: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100]
      }
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    sequelize,
    tableName: 'centros_costos',
    timestamps: true,
    indexes: [
      {
        fields: ['codigo']
      },
      {
        fields: ['activo']
      }
    ]
  }
); 