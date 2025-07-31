import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface MovimientoContableAttributes {
  id: number;
  cuenta: string;
  descripcion: string;
  tipo: string;
  centro_costo_id?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MovimientoContableCreationAttributes extends Optional<MovimientoContableAttributes, 'id'> {}

export class MovimientoContableModel extends Model<MovimientoContableAttributes, MovimientoContableCreationAttributes> implements MovimientoContableAttributes {
  public id!: number;
  public cuenta!: string;
  public descripcion!: string;
  public tipo!: string;
  public centro_costo_id?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MovimientoContableModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cuenta: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 20]
      }
    },
    descripcion: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50]
      }
    },
    tipo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50]
      }
    },
    centro_costo_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'centros_costos',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    tableName: 'movimientos_contables',
    timestamps: true,
    indexes: [
      {
        fields: ['tipo']
      },
      {
        fields: ['cuenta']
      },
      {
        fields: ['centro_costo_id']
      }
    ]
  }
); 