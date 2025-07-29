import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface RolSistemaMenuAttributes {
  id: number;
  rolId: number;
  sistemaId: number;
  menuId: number;
  estado: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface RolSistemaMenuCreationAttributes extends Optional<RolSistemaMenuAttributes, 'id'> {}

class RolSistemaMenuModel extends Model<RolSistemaMenuAttributes, RolSistemaMenuCreationAttributes> implements RolSistemaMenuAttributes {
  declare id: number;
  declare rolId: number;
  declare sistemaId: number;
  declare menuId: number;
  declare estado: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

RolSistemaMenuModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rolId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Roles',
        key: 'id',
      },
    },
    sistemaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Sistemas',
        key: 'id',
      },
    },
    menuId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Menus',
        key: 'id',
      },
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'RolSistemaMenu',
    schema: 'dbo',
    timestamps: true,
  }
);

export default RolSistemaMenuModel; 