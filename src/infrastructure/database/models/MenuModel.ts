import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface MenuAttributes {
  id: number;
  descripcion: string;
  padreId?: number;
  icon?: string;
  ruta?: string;
  areaUsuaria?: string;
  sistemaCode?: string;
  routePath?: string;
  estado: boolean;
}

interface MenuCreationAttributes extends Optional<MenuAttributes, 'id'> {}

class MenuModel extends Model<MenuAttributes, MenuCreationAttributes> implements MenuAttributes {
  declare id: number;
  declare descripcion: string;
  declare padreId?: number;
  declare icon?: string;
  declare ruta?: string;
  declare areaUsuaria?: string;
  declare sistemaCode?: string;
  declare routePath?: string;
  declare estado: boolean;
}

MenuModel.init(
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
    padreId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Menus',
        key: 'id',
      },
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ruta: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    areaUsuaria: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sistemaCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    routePath: {
      type: DataTypes.STRING,
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
    tableName: 'Menus',
    schema: 'dbo',
    timestamps: false,
  }
);

export default MenuModel; 