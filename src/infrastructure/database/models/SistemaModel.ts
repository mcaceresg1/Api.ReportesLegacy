import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface SistemaAttributes {
  id: number;
  descripcion: string;
  estado: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SistemaCreationAttributes extends Optional<SistemaAttributes, 'id'> {}

class SistemaModel extends Model<SistemaAttributes, SistemaCreationAttributes> implements SistemaAttributes {
  declare id: number;
  declare descripcion: string;
  declare estado: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

SistemaModel.init(
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
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'Sistemas',
    schema: 'dbo',
    timestamps: true,
  }
);

export default SistemaModel; 