import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface RolAttributes {
  id: number;
  descripcion: string;
  descripcion_completa: string;
  estado: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface RolCreationAttributes extends Optional<RolAttributes, 'id'> {}

class RolModel extends Model<RolAttributes, RolCreationAttributes> implements RolAttributes {
  declare id: number;
  declare descripcion: string;
  declare descripcion_completa: string;
  declare estado: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

RolModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion_completa: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'Roles',
    schema: 'dbo',
    timestamps: true,
  }
);

export default RolModel; 